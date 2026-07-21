-- P3 · 2026-07-21 · atomic usage caps + learning streaks + anonymous demo caps + public share cards
-- Applied to lippaasbtqsizqzjxtyq via Supabase MCP apply_migration (p3_streaks_demo_shares_atomic_usage). Record copy.

create or replace function public.increment_usage(p_user_id uuid, p_kind text, p_cap int)
returns table(allowed boolean, new_count int)
language plpgsql
set search_path = public
as $$
declare v_count int;
begin
  insert into public.usage_daily(user_id, day, kind, count)
  values (p_user_id, current_date, p_kind, 1)
  on conflict (user_id, day, kind)
  do update set count = usage_daily.count + 1
  where usage_daily.count < p_cap
  returning count into v_count;
  if v_count is null then
    select u.count into v_count from public.usage_daily u
      where u.user_id = p_user_id and u.day = current_date and u.kind = p_kind;
    return query select false, coalesce(v_count, 0);
  else
    return query select true, v_count;
  end if;
end $$;
revoke execute on function public.increment_usage(uuid, text, int) from public, anon, authenticated;

create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  best_streak int not null default 0,
  last_day date
);
alter table public.user_streaks enable row level security;
create policy "Users read own streak"
  on public.user_streaks for select using (auth.uid() = user_id);

create or replace function public.bump_streak(p_user_id uuid)
returns int
language plpgsql
set search_path = public
as $$
declare v_cur int;
begin
  insert into public.user_streaks (user_id, current_streak, best_streak, last_day)
  values (p_user_id, 1, 1, current_date)
  on conflict (user_id) do update set
    current_streak = case
      when user_streaks.last_day = current_date then user_streaks.current_streak
      when user_streaks.last_day = current_date - 1 then user_streaks.current_streak + 1
      else 1 end,
    best_streak = greatest(user_streaks.best_streak, case
      when user_streaks.last_day = current_date then user_streaks.current_streak
      when user_streaks.last_day = current_date - 1 then user_streaks.current_streak + 1
      else 1 end),
    last_day = current_date
  returning current_streak into v_cur;
  return v_cur;
end $$;
revoke execute on function public.bump_streak(uuid) from public, anon, authenticated;

create table if not exists public.demo_usage (
  ip_hash text not null,
  day date not null default current_date,
  count int not null default 0,
  primary key (ip_hash, day)
);
alter table public.demo_usage enable row level security;
create policy "No client access to demo usage"
  on public.demo_usage for select using (false);

create or replace function public.increment_demo(p_ip_hash text, p_cap int)
returns boolean
language plpgsql
set search_path = public
as $$
declare v_count int;
begin
  insert into public.demo_usage(ip_hash, day, count)
  values (p_ip_hash, current_date, 1)
  on conflict (ip_hash, day)
  do update set count = demo_usage.count + 1
  where demo_usage.count < p_cap
  returning count into v_count;
  return v_count is not null;
end $$;
revoke execute on function public.increment_demo(text, int) from public, anon, authenticated;

create table if not exists public.shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);
alter table public.shares enable row level security;
create policy "Anyone can read shares"
  on public.shares for select using (true);

comment on table public.user_streaks is 'Daily learning streaks (UTC); bumped server-side by tutor use + lesson completion.';
comment on table public.demo_usage is 'Anonymous landing-demo counters (hashed IP + __global__); server-role only.';
comment on table public.shares is 'User-shared Ada answers for public OG share pages; server-verified content only.';
