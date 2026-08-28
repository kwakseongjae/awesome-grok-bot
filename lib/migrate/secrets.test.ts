import assert from "node:assert/strict";
import test from "node:test";
import { collectArchiveFiles } from "@/lib/migrate/archive";
import { isSecretPath, redactSecrets, shouldSkipPath } from "@/lib/migrate/secrets";
import { HERMES_ENV_SENTINEL } from "../../fixtures/migrate/sentinels";

test("secret paths are skipped and never treated as text", () => {
  assert.equal(shouldSkipPath(".env"), true);
  assert.equal(isSecretPath(".env"), true);
  assert.equal(shouldSkipPath("hermes/.env.local"), true);
  assert.equal(shouldSkipPath("auth.json"), true);
  assert.equal(shouldSkipPath("sessions/clip.txt"), true);
  assert.equal(shouldSkipPath("state.db"), true);
  assert.equal(isSecretPath("node_modules/foo"), false);
  assert.equal(shouldSkipPath("node_modules/foo"), true);
  assert.equal(shouldSkipPath("SOUL.md"), false);
  assert.equal(shouldSkipPath("skills/inbox-brief/SKILL.md"), false);
});

test("redactSecrets strips values without returning them", () => {
  const redacted = redactSecrets(`HERMES_API_KEY=${HERMES_ENV_SENTINEL}\n`);
  assert.equal(redacted.text.includes(HERMES_ENV_SENTINEL), false);
  assert.match(redacted.text, /HERMES_API_KEY=\s*\[redacted\]/);
  assert.ok(redacted.count >= 1);
});

test("archive collection skips .env bytes without decoding them as packets", async () => {
  const encoder = new TextEncoder();
  const collected = await collectArchiveFiles([
    { name: "SOUL.md", bytes: encoder.encode("# Soul\n") },
    { name: ".env", bytes: encoder.encode(`HERMES_API_KEY=${HERMES_ENV_SENTINEL}\n`) },
  ]);
  assert.equal(collected.files.some((file) => file.path.endsWith(".env")), false);
  assert.ok(collected.skipped.some((path) => path.endsWith(".env")));
  assert.equal(
    collected.files.map((file) => file.text).join("").includes(HERMES_ENV_SENTINEL),
    false,
  );
});
