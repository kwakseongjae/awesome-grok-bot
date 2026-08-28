import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { collectArchiveFiles } from "../lib/migrate/archive";
import {
  draftChiefPacket,
  formatInventoryTable,
  inventoryWorkspace,
  readWorkspaceDir,
} from "../lib/migrate/inventory";
import { buildHandoff } from "../lib/migrate/parse";
import { assertSkillMarkdown, renderSkillMarkdown } from "../lib/migrate/skill-md";
import type { HandoffSource } from "../lib/migrate/types";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FIXTURE = path.join(ROOT, "fixtures", "hermes-handoff");
const FORBIDDEN = [
  "fixture-dummy-env-value-never-migrate",
  "fixture-dummy-auth-value-never-migrate",
];

const assertNoSecrets = (label: string, text: string) => {
  for (const value of FORBIDDEN) {
    assert.equal(text.includes(value), false, `${label} must not contain secret values`);
  }
};

const loadSkillMarkdown = async (source: HandoffSource) => {
  const origin = (process.env.MIGRATE_TEST_ORIGIN || "").replace(/\/$/, "");
  if (origin) {
    const response = await fetch(`${origin}/api/migrate/skill/${source}?locale=en`);
    assert.equal(response.status, 200, `${source} skill route must be 200`);
    assert.match(response.headers.get("content-type") || "", /text\/markdown/);
    const markdown = await response.text();
    const missing = assertSkillMarkdown(markdown, source);
    assert.deepEqual(missing, [], `${source} skill markdown missing ${missing.join(", ")}`);
    return markdown;
  }
  const markdown = renderSkillMarkdown(source, "en");
  const missing = assertSkillMarkdown(markdown, source);
  assert.deepEqual(missing, [], `${source} built-in skill missing ${missing.join(", ")}`);
  return markdown;
};

test("fixture dummy secret files exist and are not real keys", () => {
  const envText = fs.readFileSync(path.join(FIXTURE, ".env"), "utf8");
  const authText = fs.readFileSync(path.join(FIXTURE, "auth.json"), "utf8");
  assert.match(envText, /fixture-dummy-env-value-never-migrate/);
  assert.match(authText, /fixture-dummy-auth-value-never-migrate/);
  assert.doesNotMatch(envText, /\bsk-[A-Za-z0-9_-]{16,}\b/);
  assert.doesNotMatch(authText, /\bsk-[A-Za-z0-9_-]{16,}\b/);
});

test("Phase 0 inventory counts identity, skill, cron, and skips secrets unread", () => {
  const scanned = readWorkspaceDir(FIXTURE);
  const inventory = inventoryWorkspace(FIXTURE);
  const table = formatInventoryTable(inventory);

  assert.equal(inventory.present.soul, true);
  assert.equal(inventory.present.user, true);
  assert.equal(inventory.present.memory, true);
  assert.equal(inventory.identityFiles.length, 3);
  assert.ok(inventory.skills.some((skill) => skill.name === "morning-brief"));
  assert.ok(inventory.cron.some((job) => job.name === "morning-brief" && job.schedule === "0 9 * * 1-5"));
  assert.equal(inventory.skippedSecrets.length, 2);
  assert.ok(inventory.skippedSecrets.includes(".env"));
  assert.ok(inventory.skippedSecrets.includes("auth.json"));
  assert.match(table, /skipped: secret/);
  assert.match(table, /Skipped secret files: 2/);

  const scannedJson = JSON.stringify(scanned);
  assertNoSecrets("workspace scan", scannedJson);
  assertNoSecrets("inventory table", table);
  assert.equal(
    scanned.files.some((file) => file.path.endsWith(".env") || file.path.endsWith("auth.json")),
    false,
    "secret files must not be opened as readable text",
  );
});

test("Phase 1 Chief packet is drafted from SOUL and USER with no secret strings", () => {
  const scanned = readWorkspaceDir(FIXTURE);
  const packet = draftChiefPacket(scanned.files, "en", "hermes");
  const parsed = buildHandoff(scanned.files, "hermes", "en");
  const profile = parsed.packets.find((item) => item.kind === "profile");

  assert.equal(packet.kind, "profile");
  assert.match(packet.source, /SOUL\.md/);
  assert.match(packet.source, /USER\.md/);
  assert.match(packet.body, /수신함 정리 봇/);
  assert.match(packet.body, /fixture operator prefers Korean first/i);
  assert.match(packet.body, /Never do without asking/);
  assert.doesNotMatch(packet.body, /fixture-dummy/);
  assert.ok(profile);
  assert.match(profile.body, /수신함 정리 봇/);
  assert.match(profile.body, /fixture operator prefers Korean first/i);
  assertNoSecrets("chief packet", packet.body);
  assertNoSecrets("handoff packets", JSON.stringify(parsed.packets));
});

test("collectArchiveFiles skips dummy secrets without leaking values", async () => {
  const names = [".env", "auth.json", "SOUL.md", "USER.md", "MEMORY.md"];
  const inputs = names.map((name) => ({
    name,
    bytes: new Uint8Array(fs.readFileSync(path.join(FIXTURE, name))),
  }));
  const collected = await collectArchiveFiles(inputs);
  assert.ok(collected.skipped.includes(".env"));
  assert.ok(collected.skipped.includes("auth.json"));
  assert.equal(
    collected.files.some((file) => file.path === ".env" || file.path === "auth.json"),
    false,
  );
  assertNoSecrets("archive output", JSON.stringify(collected));
});

test("skill markdown is the playbook: packets, one Chief, no importer, no secret values", async () => {
  for (const source of ["hermes", "openclaw"] as const) {
    const markdown = await loadSkillMarkdown(source);
    assert.match(markdown, /First Bot is one Chief/);
    assert.match(markdown, /does not write to Grok/i);
    assert.match(markdown, /skipped: secret/);
    assert.match(markdown, /Do not open, print, or move secrets/);
    assert.doesNotMatch(markdown, /create-bot|official importer|\/api\/migrate\/preview/i);
    assertNoSecrets(`${source} skill`, markdown);
  }
});

test("GET /api/migrate and /api/migrate/preview stay 404 when an origin is set", async () => {
  const origin = (process.env.MIGRATE_TEST_ORIGIN || "").replace(/\/$/, "");
  if (!origin) {
    assert.ok(true, "skip: set MIGRATE_TEST_ORIGIN to hit the app routes");
    return;
  }
  for (const route of ["/api/migrate", "/api/migrate/preview"]) {
    const response = await fetch(`${origin}${route}`);
    assert.equal(response.status, 404, `${route} must stay 404 (no importer)`);
  }
});
