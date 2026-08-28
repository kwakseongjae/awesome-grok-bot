import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import { POST } from "@/app/api/migrate/parse/route";
import { GOLD_TASKS_PROMPT } from "@/lib/migrate/inventory";
import type { ParseResult, Phase0Inventory } from "@/lib/migrate/types";
import {
  HERMES_ENV_SENTINEL,
  HERMES_SENTINELS,
  OPENCLAW_SENTINELS,
} from "../../fixtures/migrate/sentinels";

const hermesRoot = fileURLToPath(new URL("../../fixtures/migrate/hermes-home", import.meta.url));
const openclawRoot = fileURLToPath(new URL("../../fixtures/migrate/openclaw-workspace", import.meta.url));

type ParsePayload = ParseResult & { error?: string; inventory?: Phase0Inventory };

const leaked = (blob: string, sentinels: readonly string[]) =>
  sentinels.some((sentinel) => blob.includes(sentinel));

const zipDirectory = async (root: string, prefix: string) => {
  const zip = new JSZip();
  const walk = (dir: string, rel: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const child = rel ? `${rel}/${entry.name}` : entry.name;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs, child);
        continue;
      }
      if (entry.isFile()) zip.file(child, fs.readFileSync(abs));
    }
  };
  walk(root, prefix);
  return zip.generateAsync({ type: "uint8array" });
};

const parsePOST = async (form: FormData) => {
  const response = await POST(new Request("https://getgrokbot.com/api/migrate/parse", { method: "POST", body: form }));
  const payload = (await response.json()) as ParsePayload;
  return { response, payload, blob: JSON.stringify(payload) };
};

test("parse API zips the Hermes fixture: inventory, skipped secrets, no leaks, no Grok", async () => {
  const bytes = await zipDirectory(hermesRoot, "hermes-home");
  const form = new FormData();
  form.set("source", "hermes");
  form.set("locale", "en");
  form.append("files", new File([bytes], "hermes-home.zip", { type: "application/zip" }));

  const { response, payload, blob } = await parsePOST(form);
  assert.equal(response.status, 200);
  assert.equal(leaked(blob, HERMES_SENTINELS), false, "parse response leaked a fixture sentinel");
  assert.ok(payload.inventory);
  assert.equal(payload.inventory.grokTouched, false);
  assert.equal(payload.inventory.goldTasksPrompt, GOLD_TASKS_PROMPT.en);
  assert.match(payload.inventory.table, /Ask for 3–5 gold tasks/);
  assert.match(payload.inventory.table, /not touched/);
  assert.ok(payload.inventory.skippedSecrets.some((item) => item.endsWith(".env")));
  assert.ok(payload.inventory.skippedSecrets.some((item) => item.endsWith("auth.json")));
  assert.equal(payload.inventory.identity.find((row) => row.name === "SOUL.md")?.present, true);
  assert.deepEqual(
    payload.inventory.skills.map((skill) => skill.name),
    ["inbox-brief"],
  );
  assert.equal(payload.inventory.routines.some((routine) => routine.name === "Morning brief"), true);
  assert.equal(payload.skipped.some((item) => item.endsWith(".env")), true);
});

test("parse API zips the OpenClaw fixture and redacts channel values", async () => {
  const bytes = await zipDirectory(openclawRoot, "openclaw-workspace");
  const form = new FormData();
  form.set("source", "openclaw");
  form.set("locale", "en");
  form.append("files", new File([bytes], "openclaw-workspace.zip", { type: "application/zip" }));

  const { response, payload, blob } = await parsePOST(form);
  assert.equal(response.status, 200);
  assert.equal(leaked(blob, OPENCLAW_SENTINELS), false, "parse response leaked a fixture sentinel");
  assert.ok(payload.inventory);
  assert.equal(payload.inventory.grokTouched, false);
  assert.ok(payload.inventory.skippedSecrets.some((item) => item.endsWith(".env")));
  assert.equal(payload.inventory.identity.find((row) => row.name === "HEARTBEAT.md")?.present, true);
  assert.ok(payload.inventory.tools.map((tool) => tool.name).includes("telegram"));
  assert.ok(payload.inventory.tools.map((tool) => tool.name).includes("gmail"));
  assert.match(payload.inventory.table, /HEARTBEAT working layer/);
});

test("parse API skips a lone .env without reading it into packets", async () => {
  const form = new FormData();
  form.set("source", "hermes");
  form.set("locale", "ko");
  form.append("files", new File([`HERMES_API_KEY=${HERMES_ENV_SENTINEL}\n`], ".env"));

  const { response, payload, blob } = await parsePOST(form);
  assert.equal(response.status, 200);
  assert.equal(blob.includes(HERMES_ENV_SENTINEL), false, "parse response leaked a fixture sentinel");
  assert.ok(payload.inventory);
  assert.equal(payload.inventory.goldTasksPrompt, GOLD_TASKS_PROMPT.ko);
  assert.ok(payload.skipped.includes(".env"));
  assert.ok(payload.inventory.skippedSecrets.includes(".env"));
  assert.equal(payload.inventory.grokTouched, false);
  assert.equal(
    payload.packets.some((packet) => packet.body.includes(HERMES_ENV_SENTINEL)),
    false,
  );
});
