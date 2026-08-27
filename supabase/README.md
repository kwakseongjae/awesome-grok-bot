Postgres SQL for this app now lives in [`db/migrations`](../db/migrations). Apply those files on Neon (or any Postgres) with `pnpm db:migrate` or the Neon SQL editor.

The app does not use the Supabase JavaScript client or `NEXT_PUBLIC_SUPABASE_*` keys.
