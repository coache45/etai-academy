-- Academy Upgrade · Batch E · 2026-07-20 · earned credentials/badges (auto-awarded)
create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  label text not null,
  emoji text not null default '🏅',
  awarded_at timestamptz not null default now(),
  unique (user_id, code)
);

create index if not exists idx_credentials_user on public.credentials (user_id);

alter table public.credentials enable row level security;

create policy "Users read own credentials"
  on public.credentials for select using (auth.uid() = user_id);

create or replace function public.award_credentials()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  c integer;
begin
  if new.status = 'completed' then
    select count(*) into c from public.progress
      where user_id = new.user_id and status = 'completed';
    if c >= 1 then
      insert into public.credentials (user_id, code, label, emoji)
        values (new.user_id, 'first_step', 'First Step', '🌱') on conflict do nothing;
    end if;
    if c >= 3 then
      insert into public.credentials (user_id, code, label, emoji)
        values (new.user_id, 'builder', 'Builder', '🔨') on conflict do nothing;
    end if;
    if c >= 6 then
      insert into public.credentials (user_id, code, label, emoji)
        values (new.user_id, 'pathfinder', 'Pathfinder', '🧭') on conflict do nothing;
    end if;
    if c >= 10 then
      insert into public.credentials (user_id, code, label, emoji)
        values (new.user_id, 'navigator', 'Navigator', '🚀') on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_award_credentials
  after insert or update on public.progress
  for each row execute function public.award_credentials();

-- Trigger function must not be RPC-callable (clears SECURITY DEFINER advisors).
revoke execute on function public.award_credentials() from anon, authenticated, public;

comment on table public.credentials is 'Earned badges; auto-awarded by award_credentials() on progress completion; owner-only read';
