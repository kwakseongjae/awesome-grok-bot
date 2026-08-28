# Hermes handoff fixture (no real secrets)

Sample profile for Phase 0 inventory and Phase 1 Chief packet tests. Not a live Hermes home.

Readable:

1. `SOUL.md` — persona
2. `USER.md` — operator
3. `MEMORY.md` — durable facts
4. `skills/morning-brief/SKILL.md` — one skill
5. `cron/jobs.json` — one cron line (`0 9 * * 1-5`)

Must skip (dummy values only; never copy into Grok):

- `.env`
- `auth.json`

The site does not write to Grok. There is no importer. Packets are Copy-only.
