export const HERMES_ENV_SENTINEL = "sk-fixture-hermes-env-do-not-leak-9f3a7c";
export const HERMES_AUTH_SENTINEL = "fixture-hermes-auth-json-do-not-leak";
export const HERMES_SESSION_SENTINEL = "fixture-hermes-session-do-not-leak";
export const OPENCLAW_ENV_SENTINEL = "sk-fixture-openclaw-env-do-not-leak-4b21ee";
export const OPENCLAW_TELEGRAM_SENTINEL = "fixture-telegram-botToken-do-not-leak";
export const OPENCLAW_GMAIL_SENTINEL = "fixture-gmail-apiKey-do-not-leak";

export const HERMES_SENTINELS = [
  HERMES_ENV_SENTINEL,
  HERMES_AUTH_SENTINEL,
  HERMES_SESSION_SENTINEL,
] as const;

export const OPENCLAW_SENTINELS = [
  OPENCLAW_ENV_SENTINEL,
  OPENCLAW_TELEGRAM_SENTINEL,
  OPENCLAW_GMAIL_SENTINEL,
] as const;
