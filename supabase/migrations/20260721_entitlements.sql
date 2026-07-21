-- Academy Upgrade · P1 · 2026-07-21 · entitlements + usage caps + founder cohort (free-safe; no payments wired)

alter table public.profiles
  add column if not exists stripe_customer_id  text,
  add column if not exists subscription_status text not null default 'inactive'
    check (subscription_status in ('inactive','active','past_due','canceled')),
  add column if not exists current_period_end  timestamptz,
  add column if not exists entitlements         jsonb not null default '{}'::jsonb,
  add column if not exists is_founder           boolean not null default false;

create table if not exists public.usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default current_date,
  kind text not null default 'tutor',
  count integer not null default 0,
  primary key (user_id, day, kind)
);
alter table public.usage_daily enable row level security;
create policy "Users read own usage"
  on public.usage_daily for select using (auth.uid() = user_id);
-- No user write policy: only the server (service role) increments — caps can't be self-reset.

create table if not exists public.founder_slots (
  id boolean primary key default true check (id),
  claimed integer not null default 0,
  cap integer not null default 1000
);
insert into public.founder_slots (id) values (true) on conflict (id) do nothing;
alter table public.founder_slots enable row level security;
create policy "Anyone can read founder slots"
  on public.founder_slots for select using (true);

comment on table public.usage_daily is 'Server-written daily usage counters for entitlement caps (e.g. tutor). Users read own only.';
comment on table public.founder_slots is 'Single-row counter for the first-1000 Founder pricing cohort.';
