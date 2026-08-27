# awesome-grok-bot

Grok Bot 디렉터리. 기본 언어는 영어. 한국어 및 다른 로케일 병기.

Live: [getgrokbot.com](https://getgrokbot.com). Agents: [/llms.txt](https://getgrokbot.com/llms.txt), [/llms-full.txt](https://getgrokbot.com/llms-full.txt). Each locale page also has `/llms.txt`.

A [Grok Bot](https://github.com/kwakseongjae/awesome-grok-bot) directory. English default, with Korean and other locales.

This repo is the public catalog of **bots** (named specialists you put into Grok Bot) and **teams** (a Chief plus specialists). On a listing page, **Copy** puts paste-ready setup text on the clipboard. There is no sponsor rail, ads, Stripe, or affiliate code.

Visual system: Grok-like white/black monotone. See [`design.md`](design.md). Listing faces are the Grok Bot sphere SVG (`public/brand/grok-bot-face.svg`). Migrate cards use official vendor marks in `public/brand/migrate/`.

## Run locally (no secrets)

The catalog works from committed seed data when Supabase is not configured.

```bash
pnpm install   # or npm install
cp .env.example .env.local
pnpm dev       # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Accept-Language sends you to `/ko` or `/en`.

You can:

- browse table and card views (`/en`, `/en?view=cards`)
- open the 에디터 ranking (`/en/rank`) — five scored setups, not a survey
- open a team (try **GTM 테이블** / **GTM Table**) — **Copy** vs **Copy all**
- visit `/from-link`, `/submit`, `/sign-in`, and `/migrate`
- Hermes sample files (no secrets): `fixtures/hermes-handoff/SOUL.md` and `MEMORY.md`

Sign-in and submit **save** need secrets (below). Migrate **upload/parse** is available without a session. Secrets are still stripped from handoff files.

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

X / Twitter sign-in is not wired. Better Auth can add a `twitter` social provider, but it needs a separate OAuth app and secrets; this directory keeps GitHub + Google only.

## Add a bot

- **In the app:** sign in → Submit. Markdown-like fields. You can publish immediately.
- **From a public URL:** `/from-link` fetches title/text (no LLM key) and fills a setup-text template. If fetch fails, fill the form yourself.
- **In seed data:** existing listings live in `data/seed-bots.json`. New official-role listings live in `data/catalog.ts` (local fallback). Keep `supabase/migrations/20260819000002_seed.sql` in sync for the original seed if you use Postgres.

Setup text should include: name and title, what it owns, what good looks like, what it must never do without asking, plugins, and a first task. Teams add member roles.

## Stack

Next.js App Router, TypeScript, Tailwind, shadcn/ui, next-intl (`ko` default, `en`), Supabase Postgres, Better Auth (GitHub + Google).

## License

[MIT](LICENSE). Code and listings are free to copy and adapt. Do not paste other directories' prompts verbatim.
