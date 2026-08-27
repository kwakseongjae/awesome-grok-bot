-- Setup-bot reviews and visitor-corner marks on Neon Postgres.
-- Apply this file in the Neon SQL editor (or any Postgres client) using DATABASE_URL.
-- Writes go through the Next.js server. Do not expose DATABASE_URL to the browser.
-- These rows are never mixed into the locked 에디터 ranking (lib/scores.ts).

create extension if not exists pgcrypto;

create table if not exists public.setup_bot_reviews (
  id uuid primary key default gen_random_uuid(),
  bot_slug text not null,
  display_name text not null,
  score integer not null check (score between 1 and 10),
  body text not null,
  x_handle text,
  source text not null default 'setup-bot' check (source = 'setup-bot'),
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists setup_bot_reviews_slug_created_idx
  on public.setup_bot_reviews (bot_slug, created_at desc);
create index if not exists setup_bot_reviews_ip_created_idx
  on public.setup_bot_reviews (ip_hash, created_at desc);

create table if not exists public.visitor_marks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  line text not null,
  link text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists visitor_marks_created_idx
  on public.visitor_marks (created_at desc);
create index if not exists visitor_marks_ip_created_idx
  on public.visitor_marks (ip_hash, created_at desc);
