-- P6-1 · 2026-07-21 · public shareable certificates (entitlement-gated creation; server-verified from own credentials)
-- Applied to lippaasbtqsizqzjxtyq via Supabase MCP (p6_cert_shares). Record copy.
create table if not exists public.cert_shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  label text not null,
  emoji text not null default '🏅',
  learner_name text not null,
  awarded_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.cert_shares enable row level security;
create policy "Anyone can read certificates"
  on public.cert_shares for select using (true);

comment on table public.cert_shares is 'Public shareable certificates minted from real earned credentials; server-role writes only, entitlement-gated.';
