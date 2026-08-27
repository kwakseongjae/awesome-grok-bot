# Postgres (Neon)

Catalog, reviews, visitor marks, copy events, and Better Auth tables live here.

Set **`DATABASE_URL`** to the Neon **pooled** connection string (`…-pooler.…`). That is the only database env var the app reads. Do not commit credentials.

When `DATABASE_URL` is unset, listings fall back to `data/seed-bots.json`. Reviews and visitor marks return `STORE_UNAVAILABLE` until the URL is set and migrations are applied.

Editor ranking stays in git: `lib/scores.ts`. Do not load it from Postgres.

## Apply

```bash
pnpm db:migrate
```

Or paste the files in `db/migrations/` into the Neon SQL editor, in filename order. `20260819000001_init.sql` and `20260827000001_visitor_posts.sql` are the minimum for reviews/visitors. Seed files load the same listings as `data/seed-bots.json`.
