-- Grok Book schema: Better Auth tables + directory tables + RLS.
-- Apply in the Supabase SQL editor or via `supabase db push`.

create extension if not exists pgcrypto;

-- Better Auth core (camelCase column names, quoted identifiers)
create table if not exists "user" (
  "id" text primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null default false,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "session" (
  "id" text primary key,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user"("id") on delete cascade
);

create index if not exists session_userId_idx on "session" ("userId");

create table if not exists "account" (
  "id" text primary key,
  "issuer" text not null,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user"("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("issuer", "accountId")
);

create index if not exists account_userId_idx on "account" ("userId");

create table if not exists "verification" (
  "id" text primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists verification_identifier_idx on "verification" ("identifier");

create table if not exists public.profiles (
  id text primary key references "user"("id") on delete cascade,
  handle text not null unique,
  display_name text not null,
  locale text not null default 'ko' check (locale in ('ko', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bots (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  name text not null,
  kind text not null check (kind in ('bot', 'team')),
  category text not null check (
    category in ('productivity', 'sales', 'marketing', 'ops', 'success', 'personal')
  ),
  locale text not null check (locale in ('ko', 'en')),
  summary text not null,
  prompt text not null,
  integrations text[] not null default '{}',
  source_url text,
  contributor_handle text not null default 'anonymous',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by text references public.profiles(id) on delete set null,
  added_at timestamptz not null default now(),
  copy_count integer not null default 0,
  unique (slug, locale)
);

create index if not exists bots_status_idx on public.bots (status);
create index if not exists bots_category_idx on public.bots (category);
create index if not exists bots_kind_idx on public.bots (kind);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_bot_id uuid not null references public.bots(id) on delete cascade,
  name text not null,
  role text not null,
  charter text not null,
  sort_order integer not null default 0
);

create index if not exists team_members_team_bot_id_idx on public.team_members (team_bot_id);

create table if not exists public.copy_events (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots(id) on delete cascade,
  copied_by text references public.profiles(id) on delete set null,
  copied_at timestamptz not null default now()
);

create index if not exists copy_events_bot_id_idx on public.copy_events (bot_id);

alter table public.profiles enable row level security;
alter table public.bots enable row level security;
alter table public.team_members enable row level security;
alter table public.copy_events enable row level security;

-- Anon / authenticated clients may read published listings.
-- Writes go through the Next.js server with the service role after Better Auth
-- checks the session. Service role bypasses RLS; app code enforces ownership.

drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read
  on public.profiles
  for select
  using (true);

drop policy if exists bots_public_read_published on public.bots;
create policy bots_public_read_published
  on public.bots
  for select
  using (status = 'published');

drop policy if exists team_members_public_read on public.team_members;
create policy team_members_public_read
  on public.team_members
  for select
  using (
    exists (
      select 1
      from public.bots
      where bots.id = team_members.team_bot_id
        and bots.status = 'published'
    )
  );

-- No insert/update/delete policies for anon or authenticated roles.
-- Drafts are owner-only via the service-role API after session checks.
