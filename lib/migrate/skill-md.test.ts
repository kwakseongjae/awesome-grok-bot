import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { GET } from "@/app/api/migrate/skill/[source]/[[...file]]/route";
import {
  SKILL_FILE,
  SKILL_NAME,
  assertSkillMarkdown,
  installCommand,
  renderSkillMarkdown,
  skillUrl,
  skillUrlIsHermesInstallable,
  starterPrompt,
} from "@/lib/migrate/skill-md";
import type { HandoffSource } from "@/lib/migrate/types";

const ORIGIN = "https://getgrokbot.com";
const SOURCES: HandoffSource[] = ["hermes", "openclaw"];
const LOCALES = ["en", "ko"] as const;

const skillGET = async (path: string) => {
  const url = new URL(path, ORIGIN);
  const parts = url.pathname.replace("/api/migrate/skill/", "").split("/").filter(Boolean);
  const source = parts[0] ?? "";
  const file = parts.slice(1);
  return GET(new Request(url), { params: Promise.resolve({ source, file }) });
};

test("skill URLs end in .md so Hermes UrlSource claims them", () => {
  for (const source of SOURCES) {
    for (const locale of LOCALES) {
      const url = skillUrl(ORIGIN, source, locale);
      assert.equal(skillUrlIsHermesInstallable(url), true);
      assert.match(new URL(url).pathname, new RegExp(`/${source}/${SKILL_FILE}$`));
    }
  }
});

test("Hermes install command is skills install, not --migrate-secrets", () => {
  const command = installCommand(ORIGIN, "hermes", "en");
  assert.match(command, /^hermes skills install https:\/\/getgrokbot\.com\/api\/migrate\/skill\/hermes\/SKILL\.md\?locale=en /);
  assert.equal(command.includes("--migrate-secrets"), false);
  assert.match(command, /--name grok-bot-migrate/);
  assert.match(command, /--yes/);
});

test("OpenClaw one-liner curls SKILL.md", () => {
  const command = installCommand(ORIGIN, "openclaw", "en");
  assert.equal(command, `mkdir -p skills/${SKILL_NAME} && curl -fsSL ${skillUrl(ORIGIN, "openclaw", "en")} -o skills/${SKILL_NAME}/${SKILL_FILE}`);
});

test("rendered skill markdown passes checks for en and ko", () => {
  for (const source of SOURCES) {
    for (const locale of LOCALES) {
      const markdown = renderSkillMarkdown(source, locale);
      assert.deepEqual(assertSkillMarkdown(markdown, source), []);
      assert.match(markdown, /gold tasks|골드 태스크/i);
      assert.equal(markdown.includes("--migrate-secrets"), true);
    }
  }
});

test("skill HTTP handler serves markdown for SKILL.md and legacy paths", async () => {
  for (const source of SOURCES) {
    for (const locale of LOCALES) {
      for (const path of [
        `/api/migrate/skill/${source}/${SKILL_FILE}?locale=${locale}`,
        `/api/migrate/skill/${source}?locale=${locale}`,
      ]) {
        const response = await skillGET(path);
        assert.equal(response.status, 200, path);
        const type = response.headers.get("content-type") ?? "";
        assert.match(type, /text\/markdown/);
        const markdown = await response.text();
        assert.deepEqual(assertSkillMarkdown(markdown, source), []);
        assert.match(markdown, new RegExp(`name: ${SKILL_NAME}`));
      }
    }
  }
});

test("unknown source and non-skill files 404", async () => {
  const unknown = await skillGET("/api/migrate/skill/not-a-source/SKILL.md?locale=en");
  assert.equal(unknown.status, 404);
  const extra = await skillGET("/api/migrate/skill/hermes/README.md?locale=en");
  assert.equal(extra.status, 404);
});

test("starter prompt contains the install URL", () => {
  const starter = starterPrompt({ origin: ORIGIN, source: "hermes", locale: "en" });
  assert.equal(starter.includes(skillUrl(ORIGIN, "hermes", "en")), true);
  assert.equal(starter.includes("Do not move keys"), true);
});

test("curl -o equivalent writes a valid SKILL.md", async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "grok-bot-migrate-"));
  for (const source of SOURCES) {
    const dest = path.join(root, "skills", SKILL_NAME, `${source}.${SKILL_FILE}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const response = await skillGET(`/api/migrate/skill/${source}/${SKILL_FILE}?locale=en`);
    assert.equal(response.status, 200);
    fs.writeFileSync(dest, await response.text());
    const markdown = fs.readFileSync(dest, "utf8");
    assert.deepEqual(assertSkillMarkdown(markdown, source), []);
    assert.match(markdown, /^---\nname: grok-bot-migrate\n/);
  }
});
