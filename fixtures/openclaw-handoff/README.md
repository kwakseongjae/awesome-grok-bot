# OpenClaw handoff fixture (no real secrets)

Sample workspace for Phase 0 inventory and Phase 1 Chief packet tests. Not a live OpenClaw home.

Readable:

1. `SOUL.md` — persona
2. `AGENTS.md` — operating rules
3. `USER.md` — operator
4. `MEMORY.md` — durable facts
5. `HEARTBEAT.md` — working layer (off the default queue)
6. `openclaw.json` — channel/MCP **names only**
7. `skills/inbox-triage/SKILL.md` — one skill
8. `cron/jobs.json` — one cron line (`0 9 * * 1-5`)

Must skip (dummy values only; never copy into Grok):

- `.env`
- `auth.json`

The site does not write to Grok. There is no importer. Packets are Copy-only.
Gold tasks are not in this fixture. Phase 1 must stop until the human supplies 3–5.
