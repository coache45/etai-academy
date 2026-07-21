-- Academy Upgrade · Phase 1 Foundation · 2026-07-20
-- content_items: multi-format Academy content (video, tutorial, station) across the 6 pillars.
-- Guides remain in eli5_guides; this table holds the NEW formats. Additive only (no drops).
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  pillar text not null default 'learn_ai'
    check (pillar in ('learn_ai','health_wellbeing','lifestyle','tools_tutorials','learning_stations','media')),
  format text not null check (format in ('video','tutorial','station')),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  emoji text not null default '✨',
  tags text[] not null default '{}',
  url text,
  body jsonb not null default '{}'::jsonb,
  difficulty text not null default 'beginner' check (difficulty in ('beginner','intermediate','advanced')),
  is_published boolean not null default false,
  wave integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_content_items_published on public.content_items (is_published, pillar, format);
create index if not exists idx_content_items_slug on public.content_items (slug);

create or replace function public.update_content_items_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_content_items_updated_at
  before update on public.content_items
  for each row execute function public.update_content_items_updated_at();

alter table public.content_items enable row level security;

create policy "Anyone can read published content"
  on public.content_items for select
  using (is_published = true);

create policy "Authenticated users can manage content"
  on public.content_items for all
  using (auth.role() = 'authenticated');

comment on table public.content_items is 'Academy Upgrade multi-format content (video/tutorial/station) across 6 pillars; guides stay in eli5_guides';
