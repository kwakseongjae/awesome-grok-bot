import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { GOLD_TASKS_PROMPT, inventoryLeaks } from "@/lib/migrate/inventory";
import { buildHandoff } from "@/lib/migrate/parse";
import { runPhase0 } from "@/lib/migrate/workspace";
import {
  HERMES_SENTINELS,
  OPENCLAW_GMAIL_SENTINEL,
  OPENCLAW_SENTINELS,
  OPENCLAW_TELEGRAM_SENTINEL,
} from "../../fixtures/migrate/sentinels";

const hermesRoot = fileURLToPath(new URL("../../fixtures/migrate/hermes-home", import.meta.url));
const openclawRoot = fileURLToPath(new URL("../../fixtures/migrate/openclaw-workspace", import.meta.url));

const fileText = (files: { path: string; text: string }[]) => files.map((file) => file.text).join("\n");

test("Hermes Phase 0 inventory is complete and leaks no secrets", () => {
  let fetchCalls = 0;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (...args: Parameters<typeof fetch>) => {
    fetchCalls += 1;
    return originalFetch(...args);
  }) as typeof fetch;

  try {
    const result = runPhase0(hermesRoot, "hermes", "en");
    const { inventory } = result;

    assert.equal(inventory.grokTouched, false);
    assert.equal(fetchCalls, 0);
    assert.equal(inventoryLeaks(inventory, HERMES_SENTINELS).length, 0);
    assert.equal(
      HERMES_SENTINELS.filter((sentinel) => fileText(result.files).includes(sentinel)).length,
      0,
    );

    const identity = Object.fromEntries(inventory.identity.map((row) => [row.name, row.present]));
    assert.equal(identity["SOUL.md"], true);
    assert.equal(identity["USER.md"], true);
    assert.equal(identity["MEMORY.md"], true);
    assert.equal(inventory.memory.standingEntries, 5);
    assert.equal(inventory.memory.dailyNotes.length, 1);
    assert.match(inventory.memory.dailyNotes[0] ?? "", /2026-08-20/);
    assert.deepEqual(
      inventory.skills.map((skill) => skill.name),
      ["inbox-brief"],
    );
    assert.equal(inventory.routines.some((routine) => routine.name === "Morning brief"), true);
    assert.ok(inventory.skippedSecrets.includes(".env"));
    assert.ok(inventory.skippedSecrets.includes("auth.json"));
    assert.ok(inventory.skippedSecrets.includes("state.db"));
    assert.ok(inventory.skippedSecrets.some((path) => path === "sessions" || path.startsWith("sessions/")));
    assert.match(inventory.table, /working layer, not queued/);
    assert.match(inventory.table, /not touched/);
    assert.equal(inventory.goldTasksPrompt, GOLD_TASKS_PROMPT.en);
    assert.match(inventory.table, /Ask for 3–5 gold tasks/);

    const parsed = buildHandoff(result.files, "hermes", "en");
    const packetBlob = JSON.stringify(parsed.packets);
    for (const sentinel of HERMES_SENTINELS) {
      assert.equal(packetBlob.includes(sentinel), false);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("OpenClaw Phase 0 inventory skips .env and redacts channel values", () => {
  const result = runPhase0(openclawRoot, "openclaw", "en");
  const { inventory } = result;

  assert.equal(inventory.grokTouched, false);
  assert.equal(inventoryLeaks(inventory, OPENCLAW_SENTINELS).length, 0);
  assert.equal(fileText(result.files).includes(OPENCLAW_SENTINELS[0]), false);
  assert.equal(fileText(result.files).includes(OPENCLAW_TELEGRAM_SENTINEL), false);
  assert.equal(fileText(result.files).includes(OPENCLAW_GMAIL_SENTINEL), false);

  const identity = Object.fromEntries(inventory.identity.map((row) => [row.name, row.present]));
  assert.equal(identity["SOUL.md"], true);
  assert.equal(identity["AGENTS.md"], true);
  assert.equal(identity["USER.md"], true);
  assert.equal(identity["MEMORY.md"], true);
  assert.equal(identity["HEARTBEAT.md"], true);
  assert.equal(identity["openclaw.json"], true);
  assert.equal(identity["cron/jobs.json"], true);
  assert.equal(inventory.memory.heartbeat, true);
  assert.equal(inventory.memory.dailyNotes.length, 1);
  assert.deepEqual(
    inventory.skills.map((skill) => skill.name),
    ["inbox-brief"],
  );
  assert.equal(inventory.routines.some((routine) => routine.name === "Morning brief"), true);
  assert.ok(inventory.tools.map((tool) => tool.name).includes("telegram"));
  assert.ok(inventory.tools.map((tool) => tool.name).includes("gmail"));
  assert.ok(inventory.skippedSecrets.includes(".env"));
  assert.match(inventory.table, /HEARTBEAT working layer/);
  assert.equal(inventory.goldTasksPrompt, GOLD_TASKS_PROMPT.en);

  const parsed = buildHandoff(result.files, "openclaw", "en");
  const packetBlob = JSON.stringify(parsed);
  for (const sentinel of OPENCLAW_SENTINELS) {
    assert.equal(packetBlob.includes(sentinel), false);
  }
});

test("Korean Phase 0 asks for gold tasks and does not touch Grok", () => {
  const { inventory } = runPhase0(hermesRoot, "hermes", "ko");
  assert.equal(inventory.goldTasksPrompt, GOLD_TASKS_PROMPT.ko);
  assert.match(inventory.table, /만지지 않음/);
  assert.equal(inventory.grokTouched, false);
});
