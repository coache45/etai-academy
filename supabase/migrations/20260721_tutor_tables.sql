-- Ada P2-T1 · 2026-07-21 · tutor conversations/messages (owner-read RLS, server-only writes) + FTS search RPC
-- Applied to lippaasbtqsizqzjxtyq via Supabase MCP apply_migration (tutor_tables_and_search). Record copy.

create table if not exists public.tutor_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.tutor_conversations enable row level security;
create policy "Users read own conversations"
  on public.tutor_conversations for select using (auth.uid() = user_id);
-- No user write policies: the tutor API (service role) creates/updates conversations
-- so the moderation gate + caps can never be bypassed client-side.

create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.tutor_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
alter table public.tutor_messages enable row level security;
create policy "Users read own messages"
  on public.tutor_messages for select using (auth.uid() = user_id);

create index if not exists tutor_messages_conversation_idx
  on public.tutor_messages (conversation_id, created_at);
create index if not exists tutor_conversations_user_idx
  on public.tutor_conversations (user_id, updated_at desc);

-- Grounding: full-text search over published guides + content items (server-only EXECUTE).
create or replace function public.search_academy_content(query text, max_results int default 4)
returns table (source text, slug text, title text, snippet text)
language sql
stable
set search_path = public
as $$
  with q as (select websearch_to_tsquery('english', query) as tsq)
  (
    select 'guide'::text as source, g.slug, g.title,
           left(coalesce(g.tagline,'') || ' ' || coalesce(g.chapters::text,''), 1500) as snippet
    from eli5_guides g, q
    where g.is_published
      and to_tsvector('english', g.title || ' ' || coalesce(g.tagline,'') || ' ' || coalesce(g.chapters::text,'')) @@ q.tsq
    order by ts_rank(to_tsvector('english', g.title || ' ' || coalesce(g.tagline,'')), q.tsq) desc
    limit max_results
  )
  union all
  (
    select 'content'::text as source, c.slug, c.title,
           left(coalesce(c.summary,'') || ' ' || coalesce(c.body::text,''), 1500) as snippet
    from content_items c, q
    where c.is_published
      and to_tsvector('english', c.title || ' ' || coalesce(c.summary,'') || ' ' || coalesce(c.body::text,'')) @@ q.tsq
    order by ts_rank(to_tsvector('english', c.title || ' ' || coalesce(c.summary,'')), q.tsq) desc
    limit max_results
  )
$$;
revoke execute on function public.search_academy_content(text, int) from public, anon, authenticated;

comment on table public.tutor_conversations is 'Ada tutor chat threads; owner-only read, server-role writes.';
comment on table public.tutor_messages is 'Ada tutor messages; owner-only read, server-role writes (moderation-gated).';
comment on function public.search_academy_content is 'FTS grounding for Ada over published guides + content_items; server-only EXECUTE.';
