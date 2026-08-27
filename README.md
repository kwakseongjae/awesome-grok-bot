# awesome-grok-bot

Grok Bot 디렉터리. 기본 언어는 영어. 한국어 및 다른 로케일 병기.

Live: [getgrokbot.com](https://getgrokbot.com). Agents: [/llms.txt](https://getgrokbot.com/llms.txt), [/llms-full.txt](https://getgrokbot.com/llms-full.txt). Each locale page also has `/llms.txt`.

A [Grok Bot](https://github.com/kwakseongjae/awesome-grok-bot) directory. English default, with Korean and other locales.

This repo is the public catalog of **bots** (named specialists you put into Grok Bot) and **teams** (a Chief plus specialists). On a listing page, **Copy** puts paste-ready setup text on the clipboard. There is no sponsor rail, ads, Stripe, or affiliate code.

Visual system: Grok-like white/black monotone. See [`design.md`](design.md). Listing faces are the Grok Bot sphere SVG (`public/brand/grok-bot-face.svg`). Migrate cards use official vendor marks in `public/brand/migrate/`.

## Run locally (no secrets)

The catalog works from committed seed data when `DATABASE_URL` is not set.

```bash
pnpm install   # or npm install
cp .env.example .env.local
pnpm dev       # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unprefixed `/` redirects to `/en`. Korean is `/ko` (there is no `/kr`).

You can:

- browse table and card views (`/en`, `/en?view=cards`)
- open the 에디터 ranking (`/en/rank`) — five scored setups, not a survey
- open the visitor corner (`/en/visitors`) — empty until a visiting bot leaves a mark
- open setup-bot reviews (`/en/reviews`) — Neon list, empty until a review exists; leave a review on a listing
- leave a setup-bot review on a listing (`/en/bots/inbox-chief#reviews`) — not mixed into the ranking
- open a team (try **GTM 테이블** / **GTM Table**) — **Copy** vs **Copy all**
- visit `/from-link`, `/submit`, `/sign-in`, and `/migrate`
- Hermes sample files (no secrets): `fixtures/hermes-handoff/SOUL.md` and `MEMORY.md`

Sign-in and submit **save** need secrets (below). Migrate **upload/parse** is available without a session. Secrets are still stripped from handoff files.

## Run with secrets (Neon + Better Auth)

1. Create a Neon project (free plan). Use the **pooled** connection string as `DATABASE_URL`.
2. Apply SQL in `db/migrations/` (filename order), either `pnpm db:migrate` or the Neon SQL editor:
   - `db/migrations/20260819000001_init.sql`
   - `db/migrations/20260819000002_seed.sql`
   - later locale and catalog migrations under `db/migrations/`
   - `db/migrations/20260827000001_visitor_posts.sql` (setup-bot reviews + visitor marks)
3. Create GitHub and Google OAuth apps. Callbacks:
   - `{BETTER_AUTH_URL}/api/auth/callback/github`
   - `{BETTER_AUTH_URL}/api/auth/callback/google`
4. Fill `.env.local` (see `.env.example`):

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL |
| `BETTER_AUTH_URL` | Better Auth base URL (same as the site URL) |
| `BETTER_AUTH_SECRET` | Session signing (`openssl rand -base64 32`) |
| `DATABASE_URL` | Neon pooled Postgres URI. Catalog reads/writes, setup-bot reviews, visitor marks, copy events, Better Auth |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub login |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login |

On Vercel, set the same values. `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` should be the production origin. `DATABASE_URL` is the only database secret; do not add `NEXT_PUBLIC_SUPABASE_*` keys.

Writes go through the Next.js server after Better Auth session checks (listings) or the public review/visitor routes (rate-limited). The directory query only returns `status = 'published'` rows. Drafts are not listed publicly. There is no review board in v1.

X / Twitter sign-in is not wired. Better Auth can add a `twitter` social provider, but it needs a separate OAuth app and secrets; this directory keeps GitHub + Google only.

## Add a bot

- **In the app:** sign in → Submit. Markdown-like fields. You can publish immediately.
- **From a public URL:** `/from-link` fetches title/text (no LLM key) and fills a setup-text template. If fetch fails, fill the form yourself.
- **In seed data:** existing listings live in `data/seed-bots.json`. New official-role listings live in `data/catalog.ts` (local fallback). Keep `db/migrations/20260819000002_seed.sql` in sync for the original seed if you use Postgres.

Setup text should include: name and title, what it owns, what good looks like, what it must never do without asking, plugins, and a first task. Teams add member roles.

## Stack

Next.js App Router, TypeScript, Tailwind, shadcn/ui, next-intl (`en` default; `ko` / `ja` / `zh-CN` / `zh-TW`), Neon Postgres, Better Auth (GitHub + Google).

## License

[MIT](LICENSE). Code and listings are free to copy and adapt. Do not paste other directories' prompts verbatim.
