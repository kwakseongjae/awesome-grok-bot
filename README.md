# awesome-grok-bot

스폰서 없는 Grok Bot 디렉터리. 한국어 우선, 영문 병기.

A sponsor-free [Grok Bot](https://github.com/kwakseongjae/awesome-grok-bot) directory. Korean-first, with English.

This repo is the public catalog of **bots** (named teammates with a job title and a charter) and **teams** (a Chief plus specialists). Copy a paste-ready charter into Grok Bot. There is no sponsor rail, ads, Stripe, or affiliate code.

## Run locally (no secrets)

The catalog works from committed seed data when Supabase is not configured.

```bash
pnpm install   # or npm install
cp .env.example .env.local
pnpm dev       # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Accept-Language sends you to `/ko` or `/en`.

You can:

- browse table and card views
- open a team (try **GTM 테이블** / **GTM Table**)
- copy a charter
- visit `/from-link`, `/submit`, and `/sign-in`

Sign-in and submit **save** need secrets (below). The pages still render and explain which env vars are missing.

## Run with secrets (Supabase + Better Auth)

1. Create a Supabase project. In the SQL editor, run in order:
   - `supabase/migrations/20260819000001_init.sql`
   - `supabase/migrations/20260819000002_seed.sql`
2. Create GitHub and Google OAuth apps. Callbacks:
   - `{BETTER_AUTH_URL}/api/auth/callback/github`
   - `{BETTER_AUTH_URL}/api/auth/callback/google`
3. Fill `.env.local` (see `.env.example`):

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL |
| `BETTER_AUTH_URL` | Better Auth base URL (same as the site URL) |
| `BETTER_AUTH_SECRET` | Session signing (`openssl rand -base64 32`) |
| `DATABASE_URL` | Supabase Postgres URI for Better Auth tables |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public reads (published bots, RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes after Better Auth session checks |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub login |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login |

On Vercel, set the same values. `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` should be the production origin.

**Auth vs RLS:** published rows are public-read. Drafts and writes are not allowed for the anon key. The app uses the service role only after a Better Auth session, and only the author can publish their own listing (no review board in v1).

## Add a bot

- **In the app:** sign in → Submit. Markdown-like fields. You can publish immediately.
- **From a public URL:** `/from-link` fetches title/text (no LLM key) and fills a charter template. If fetch fails, fill the form yourself.
- **In seed data:** edit `data/seed-bots.json` (local fallback) and keep `supabase/migrations/20260819000002_seed.sql` in sync for Postgres.

A charter should include: name and title, what it owns, what good looks like, what it must never do without asking, integrations, and a first task. Teams add member roles.

## Stack

Next.js App Router, TypeScript, Tailwind, shadcn/ui, next-intl (`ko` default, `en`), Supabase Postgres, Better Auth (GitHub + Google).

## License

Listings are free to copy and adapt. Do not paste other directories' prompts verbatim.
