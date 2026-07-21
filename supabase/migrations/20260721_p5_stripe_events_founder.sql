-- P5 · 2026-07-21 · Stripe webhook idempotency ledger + atomic founder-slot claim
-- Applied to lippaasbtqsizqzjxtyq via Supabase MCP (p5_stripe_events_founder_claim). Record copy.

create table if not exists public.stripe_events (
  id text primary key,
  type text not null default '',
  received_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;
create policy "No client access to stripe events"
  on public.stripe_events for select using (false);

create or replace function public.claim_founder_slot()
returns boolean
language plpgsql
set search_path = public
as $$
declare v int;
begin
  update public.founder_slots
     set claimed = claimed + 1
   where id = true and claimed < cap
  returning claimed into v;
  return v is not null;
end $$;
revoke execute on function public.claim_founder_slot() from public, anon, authenticated;

comment on table public.stripe_events is 'Processed Stripe webhook event ids (idempotency); service-role only.';
comment on function public.claim_founder_slot is 'Atomically claims one of the first-1000 Founder slots; false when full. Server-only EXECUTE.';
