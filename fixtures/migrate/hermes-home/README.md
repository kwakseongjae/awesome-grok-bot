# Hermes home fixture (no real secrets)

This is a fake `~/.hermes`. Phase 0 must skip `.env`, `auth.json`, `state.db`, and `sessions/` without printing values.

Sentinels in those files exist only so tests can prove they never leak.
