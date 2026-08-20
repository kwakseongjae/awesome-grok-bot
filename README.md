# awesome-grok-bot

스폰서 없는 Grok Bot 디렉터리. 한국어 우선, 영문 병기.

A sponsor-free [Grok Bot](https://github.com/kwakseongjae/awesome-grok-bot) directory. Korean-first, with English.

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

- browse table and card views (`/ko`, `/ko?view=cards`)
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

## Production launch

Live today: [https://awesome-grok-bot.vercel.app](https://awesome-grok-bot.vercel.app). No custom domain is attached yet. The catalog can run from seed data; **sign-in/submit persist only after Vercel env values are filled**. Dashboard keys currently exist as empty placeholders — production `/api/auth/*` returns 503 until real values are set.

### 1. Fill Vercel environment variables

Project → Settings → Environment Variables. Production **and** Preview. Then **redeploy**. Empty names do not count.

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` / `BETTER_AUTH_URL` | Canonical origin, e.g. `https://your-domain` (or the `.vercel.app` URL until DNS is live) |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `DATABASE_URL` | Supabase Postgres URI (Better Auth tables from `supabase/migrations`) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Catalog reads/writes |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth client |
| `NEXT_PUBLIC_GTM_ID` | `GTM-…` container; omit until the container exists |
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML-tag token |
| `NAVER_SITE_VERIFICATION` | 서치어드바이저 HTML-tag token |
| `INDEXNOW_KEY` | 8–128 chars (`A–Z a–z 0–9 -`). Serves `/{key}.txt` after rebuild |
| `BETTER_AUTH_ALLOWED_HOSTS` / `BETTER_AUTH_TRUSTED_ORIGINS` | Optional extras for the custom domain (`www` + apex). `*.vercel.app` is already trusted |

### 2. OAuth callbacks

In the GitHub and Google OAuth apps, add **both** the Vercel URL and the custom domain:

- `{origin}/api/auth/callback/github`
- `{origin}/api/auth/callback/google`

Replace `{origin}` with `https://awesome-grok-bot.vercel.app` and later `https://your-domain`.

### 3. Custom domain (Vercel)

1. Vercel project → Settings → Domains → add the hostname.
2. At the registrar, follow Vercel’s DNS (usually `A 10.0.1.2` for apex, `CNAME cname.vercel-dns.com` for `www`, or Vercel nameservers).
3. After TLS is issued, set `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to `https://your-domain`, add the host to `BETTER_AUTH_ALLOWED_HOSTS`, update OAuth callbacks, redeploy.

Tell the agent the domain name when you have it — it cannot be guessed from this repo.

### 4. GTM, Search Console, 네이버 서치어드바이저, Brave

Code already emits (once env is set):

- `gtm.js` via `@next/third-parties` `GoogleTagManager` (GA4 should live **inside** the GTM container, not as a second `gtag` snippet).
- `<meta name="google-site-verification">` and `<meta name="naver-site-verification">`
- `/robots.txt` (allow `/`, disallow `/api/`, sitemap URL) and `/sitemap.xml` (ko/en + listings, hreflang)
- IndexNow key file + ping on published listings (`https://api.indexnow.org/indexnow`, shared with participating engines including Bing)

Dashboard steps after the next production deploy:

1. [Google Tag Manager](https://tagmanager.google.com/) → create a web container → paste the `GTM-` id into `NEXT_PUBLIC_GTM_ID` → add a GA4 Configuration tag in that container.
2. [Google Search Console](https://search.google.com/search-console) → URL-prefix property → HTML tag → `GOOGLE_SITE_VERIFICATION` → redeploy → verify → submit `https://your-domain/sitemap.xml`. GTM can also verify Search Console, but the meta tag is the path this app implements.
3. [네이버 서치어드바이저](https://searchadvisor.naver.com/) → 사이트 등록 (host 단위, 예: `https://your-domain`) → HTML 메타 태그 소유확인 → `NAVER_SITE_VERIFICATION` → 재배포 → 요청에서 사이트맵 제출. 네이버 로봇 User-Agent는 `Yeti`.
4. Brave Search has no separate webmaster console. Independent indexing is: `robots.txt` allow + sitemap + [IndexNow](https://www.indexnow.org/documentation) (this app) and/or [Bing Webmaster](https://www.bing.com/webmasters) sitemap import (Brave consumes a large independent index and also overlapping web crawl; IndexNow is the submission protocol we can automate).

`/sign-in` is `noindex`. Do not put secrets or verification files in git; env and Vercel only.

**Auth vs RLS:** published rows are public-read. Drafts and writes are not allowed for the anon key. The app uses the service role only after a Better Auth session, and only the author can publish their own listing (no review board in v1).

X / Twitter sign-in is not wired. Better Auth can add a `twitter` social provider, but it needs a separate OAuth app and secrets; this directory keeps GitHub + Google only.

## Add a bot

- **In the app:** sign in → Submit. Markdown-like fields. You can publish immediately.
- **From a public URL:** `/from-link` fetches title/text (no LLM key) and fills a setup-text template. If fetch fails, fill the form yourself.
- **In seed data:** edit `data/seed-bots.json` (local fallback) and keep `supabase/migrations/20260819000002_seed.sql` in sync for Postgres.

Setup text should include: name and title, what it owns, what good looks like, what it must never do without asking, plugins, and a first task. Teams add member roles.

## Stack

Next.js App Router, TypeScript, Tailwind, shadcn/ui, next-intl (`ko` default, `en`), Supabase Postgres, Better Auth (GitHub + Google).

## License

Listings are free to copy and adapt. Do not paste other directories' prompts verbatim.
