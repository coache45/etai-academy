-- 001_create_eli5_guides.sql
-- Migration-ready DDL for the NEW etai-academy Supabase project (Phase 1).
-- Faithful recreation of public.eli5_guides from pvflufqfeaowzextilpl (live-verified 2026-07-20).
-- Apply via Supabase MCP apply_migration or SQL editor. RLS parity with source.

create table public.eli5_guides (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  tagline       text not null default ''::text,
  emoji         text not null default '📖'::text,
  slug          text not null unique,
  category      text not null default 'general'::text,
  difficulty    text not null default 'beginner'::text
                constraint eli5_guides_difficulty_check
                check (difficulty = any (array['beginner'::text,'intermediate'::text,'advanced'::text])),
  chapters      jsonb not null default '[]'::jsonb,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.eli5_guides is 'ELI5 (Explain Like I''m 5) guides with chapter-based content';
comment on column public.eli5_guides.chapters is 'JSONB array of {title, emoji, content, analogy?, steps?[]} objects';

create index idx_eli5_guides_published on public.eli5_guides using btree (is_published, category);
create index idx_eli5_guides_slug on public.eli5_guides using btree (slug);

create or replace function public.update_eli5_guides_updated_at()
returns trigger
language plpgsql
set search_path to ''
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

create trigger trg_eli5_guides_updated_at
  before update on public.eli5_guides
  for each row execute function public.update_eli5_guides_updated_at();

alter table public.eli5_guides enable row level security;

create policy "Anyone can read published guides"
  on public.eli5_guides for select
  using (is_published = true);

create policy "Authenticated users can manage guides"
  on public.eli5_guides for all
  using (auth.role() = 'authenticated'::text);
