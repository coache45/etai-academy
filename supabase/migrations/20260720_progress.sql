-- Academy Upgrade · Phase 2a · 2026-07-20 · per-user learning progress (owner-only RLS)
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('guide','content')),
  item_slug text not null,
  status text not null default 'started' check (status in ('started','completed')),
  percent integer not null default 0 check (percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, item_type, item_slug)
);

create index if not exists idx_progress_user on public.progress (user_id, status);

create or replace function public.update_progress_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_progress_updated_at
  before update on public.progress
  for each row execute function public.update_progress_updated_at();

alter table public.progress enable row level security;

create policy "Users read own progress"
  on public.progress for select using (auth.uid() = user_id);
create policy "Users insert own progress"
  on public.progress for insert with check (auth.uid() = user_id);
create policy "Users update own progress"
  on public.progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own progress"
  on public.progress for delete using (auth.uid() = user_id);

comment on table public.progress is 'Per-user learning progress across guides and content_items; owner-only RLS (auth.uid() = user_id)';
