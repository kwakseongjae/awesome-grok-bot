import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { collectArchiveFiles } from "../lib/migrate/archive";
import {
  advanceToPhase1,
  draftChiefPacket,
  formatInventoryTable,
  inventoryWorkspace,
  readWorkspaceDir,
} from "../lib/migrate/inventory";
import { buildHandoff } from "../lib/migrate/parse";
import { GOLD_TASKS_MISSING, goldTasksReady, makeGoldTask } from "../lib/migrate/playbook";
import {
  assertSkillMarkdown,
  pasteInstallCommand,
  pasteStarter,
  renderSkillMarkdown,
  templateShareUrl,
} from "../lib/migrate/skill-md";
import type { HandoffSource } from "../lib/migrate/types";
import { LOCALES } from "../lib/locales";
import { SITE_ORIGIN } from "../lib/site";
import { CATALOG } from "../data/catalog";
import { FEATURED_TEMPLATE_SLUGS, templatesIndexShareUrl } from "../lib/templates";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HERMES = path.join(ROOT, "fixtures", "hermes-handoff");
const OPENCLAW = path.join(ROOT, "fixtures", "openclaw-handoff");
const FORBIDDEN = [
  "fixture-dummy-env-value-never-migrate",
  "fixture-dummy-auth-value-never-migrate",
  "fixture-dummy-openclaw-env-value-never-migrate",
  "fixture-dummy-openclaw-auth-value-never-migrate",
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

const assertSecretSkip = (root: string, envSentinel: string, authSentinel: string) => {
  const envText = fs.readFileSync(path.join(root, ".env"), "utf8");
  const authText = fs.readFileSync(path.join(root, "auth.json"), "utf8");
  assert.match(envText, new RegExp(envSentinel));
  assert.match(authText, new RegExp(authSentinel));
  assert.doesNotMatch(envText, /\bsk-[A-Za-z0-9_-]{16,}\b/);
  assert.doesNotMatch(authText, /\bsk-[A-Za-z0-9_-]{16,}\b/);
};

test("catalog ships Video Editor and keeps One Machine", () => {
  const slugs = CATALOG.map((item) => item.slug);
  assert.equal(FEATURED_TEMPLATE_SLUGS[0], "video-editor");
  assert.equal(slugs.includes("video-editor"), true);
  assert.equal(slugs.includes("x-top-fans"), true);
  assert.equal(slugs.includes("one-machine"), true);
  assert.equal(slugs.includes("kody"), false);
  const video = CATALOG.find((item) => item.slug === "video-editor");
  assert.match(video?.prompts.en ?? "", /Do not post/);
  assert.match(video?.prompts.en ?? "", /overwrite/i);
});

test("catalog ships Jess EA, Sanity, and EM team with our setup text", () => {
  const slugs = CATALOG.map((item) => item.slug);
  assert.equal(slugs.includes("jess-ea"), true);
  assert.equal(slugs.includes("sanity"), true);
  assert.equal(slugs.includes("em-team"), true);
  assert.equal(slugs.includes("kody"), false);
  assert.equal(FEATURED_TEMPLATE_SLUGS.some((slug) => slug === "jess-ea"), true);
  assert.equal(FEATURED_TEMPLATE_SLUGS.some((slug) => slug === "sanity"), true);
  assert.equal(FEATURED_TEMPLATE_SLUGS.some((slug) => slug === "em-team"), true);
  assert.equal(new Set(CATALOG.map((item) => item.index)).size, CATALOG.length);

  const jess = CATALOG.find((item) => item.slug === "jess-ea");
  assert.equal(jess?.kind, "bot");
  assert.equal(jess?.source_url, "https://x.ai/bot/Nmv2fCQEcQc3EHzVXJZKN");
  assert.match(jess?.prompts.en ?? "", /weekday/i);
  assert.match(jess?.prompts.en ?? "", /Do not send unapproved mail/);
  assert.match(jess?.prompts.en ?? "", /playbook/i);
  assert.doesNotMatch(jess?.prompts.en ?? "", /Nmv2fCQEcQc3EHzVXJZKN/);
  assert.doesNotMatch(jess?.prompts.en ?? "", /posts client call summaries without being asked/i);

  const sanity = CATALOG.find((item) => item.slug === "sanity");
  assert.equal(sanity?.kind, "bot");
  assert.equal(sanity?.source_url, "https://x.com/ahdumgray/status/2093504459741794550");
  assert.match(sanity?.prompts.en ?? "", /One job/);
  assert.match(sanity?.prompts.en ?? "", /swarm/i);
  assert.match(sanity?.prompts.en ?? "", /Do not publish/);
  assert.match(sanity?.prompts.en ?? "", /Do not spawn helpers/);
  assert.doesNotMatch(sanity?.prompts.en ?? "", /x\.ai\/bot\/[A-Za-z0-9]+/);

  const em = CATALOG.find((item) => item.slug === "em-team");
  assert.equal(em?.kind, "team");
  assert.equal(em?.source_url, "https://x.com/ZeroAdamEleven/status/2093510488134930915");
  assert.equal((em?.members?.en ?? []).length, 4);
  assert.equal(em?.members?.en?.[0]?.name, "Engineering Manager");
  assert.match(em?.prompts.en ?? "", /One Chief/);
  assert.match(em?.prompts.en ?? "", /unbounded swarm|Dispatch an unbounded swarm/);
  assert.match(em?.prompts.en ?? "", /One machine each/);
  assert.match(em?.intro?.en ?? "", /refuse/i);
});

test("fixture dummy secret files exist and are not real keys", () => {
  assertSecretSkip(HERMES, "fixture-dummy-env-value-never-migrate", "fixture-dummy-auth-value-never-migrate");
  assertSecretSkip(
    OPENCLAW,
    "fixture-dummy-openclaw-env-value-never-migrate",
    "fixture-dummy-openclaw-auth-value-never-migrate",
  );
});

test("Hermes Phase 0 inventory counts identity, skill, cron, and skips secrets unread", () => {
  const scanned = readWorkspaceDir(HERMES);
  const inventory = inventoryWorkspace(HERMES);
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
  assertNoSecrets("hermes scan", JSON.stringify(scanned));
  assertNoSecrets("hermes inventory table", table);
  assert.equal(
    scanned.files.some((file) => file.path.endsWith(".env") || file.path.endsWith("auth.json")),
    false,
    "secret files must not be opened as readable text",
  );
});

test("OpenClaw Phase 0 inventory counts AGENTS/HEARTBEAT/openclaw.json/cron and skips secrets unread", () => {
  const scanned = readWorkspaceDir(OPENCLAW);
  const inventory = inventoryWorkspace(OPENCLAW);
  const table = formatInventoryTable(inventory);

  assert.equal(inventory.present.soul, true);
  assert.equal(inventory.present.user, true);
  assert.equal(inventory.present.agents, true);
  assert.equal(inventory.present.memory, true);
  assert.equal(inventory.present.heartbeat, true);
  assert.equal(inventory.present.openclaw, true);
  assert.ok(inventory.skills.some((skill) => skill.name === "inbox-triage"));
  assert.ok(inventory.cron.some((job) => job.name === "inbox-triage" && job.schedule === "0 9 * * 1-5"));
  assert.ok(inventory.tools.includes("telegram"));
  assert.ok(inventory.tools.includes("filesystem"));
  assert.equal(inventory.skippedSecrets.length, 2);
  assert.ok(inventory.skippedSecrets.includes(".env"));
  assert.ok(inventory.skippedSecrets.includes("auth.json"));
  assert.match(table, /HEARTBEAT\.md\tpresent \(off default queue\)/);
  assert.match(table, /skipped: secret/);
  assertNoSecrets("openclaw scan", JSON.stringify(scanned));
  assertNoSecrets("openclaw inventory table", table);
  assert.doesNotMatch(table, /botToken|apiKey/i);
  assert.equal(
    scanned.files.some((file) => file.path.endsWith(".env") || file.path.endsWith("auth.json")),
    false,
  );
});

test("Phase 1 Chief packet can be drafted from identity files with no secret strings", () => {
  const hermes = readWorkspaceDir(HERMES);
  const hermesPacket = draftChiefPacket(hermes.files, "en", "hermes");
  const hermesParsed = buildHandoff(hermes.files, "hermes", "en");
  const hermesProfile = hermesParsed.packets.find((item) => item.kind === "profile");

  assert.match(hermesPacket.source, /SOUL\.md/);
  assert.match(hermesPacket.source, /USER\.md/);
  assert.match(hermesPacket.body, /수신함 정리 봇/);
  assert.match(hermesPacket.body, /fixture operator prefers Korean first/i);
  assert.ok(hermesProfile);
  assertNoSecrets("hermes chief packet", hermesPacket.body);
  assertNoSecrets("hermes handoff packets", JSON.stringify(hermesParsed.packets));

  const openclaw = readWorkspaceDir(OPENCLAW);
  const openclawPacket = draftChiefPacket(openclaw.files, "en", "openclaw");
  assert.match(openclawPacket.source, /SOUL\.md/);
  assert.match(openclawPacket.source, /USER\.md/);
  assert.match(openclawPacket.source, /AGENTS\.md/);
  assert.match(openclawPacket.body, /OpenClaw operator fixture/);
  assert.doesNotMatch(openclawPacket.body, /stays off the default Grok queue/);
  assertNoSecrets("openclaw chief packet", openclawPacket.body);
});

test("Phase 1 stops when gold tasks are missing and does not invent them", () => {
  const hermes = readWorkspaceDir(HERMES);
  const openclaw = readWorkspaceDir(OPENCLAW);
  assert.equal(goldTasksReady([]), false);
  assert.equal(goldTasksReady([makeGoldTask()]), false);

  for (const [label, files, source] of [
    ["hermes", hermes.files, "hermes"],
    ["openclaw", openclaw.files, "openclaw"],
  ] as const) {
    const result = advanceToPhase1({ files, locale: "en", source, goldTasks: [] });
    assert.equal(result.stopped, true, `${label} Phase 1 must stop without gold tasks`);
    assert.equal(result.reason, GOLD_TASKS_MISSING);
    assert.equal(result.packet, null);
  }
});

test("collectArchiveFiles skips dummy secrets without leaking values", async () => {
  for (const root of [HERMES, OPENCLAW]) {
    const names = [".env", "auth.json", "SOUL.md", "USER.md", "MEMORY.md"];
    const inputs = names.map((name) => ({
      name,
      bytes: new Uint8Array(fs.readFileSync(path.join(root, name))),
    }));
    const collected = await collectArchiveFiles(inputs);
    assert.ok(collected.skipped.includes(".env"));
    assert.ok(collected.skipped.includes("auth.json"));
    assert.equal(
      collected.files.some((file) => file.path === ".env" || file.path === "auth.json"),
      false,
    );
    assertNoSecrets(`archive ${root}`, JSON.stringify(collected));
  }
});

test("skill markdown is the playbook: packets, one Chief, no importer, no secret values", async () => {
  for (const source of ["hermes", "openclaw"] as const) {
    const markdown = await loadSkillMarkdown(source);
    assert.match(markdown, /First Bot is one Chief/);
    assert.match(markdown, /does not write to Grok/i);
    assert.match(markdown, /skipped: secret/);
    assert.match(markdown, /Do not open, print, or move secrets/);
    assert.match(markdown, /3–5 gold tasks/);
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

test("skill landing paste is the canonical one-liner with no origin wait", () => {
  const desk = fs.readFileSync(path.join(ROOT, "components/migrate-desk.tsx"), "utf8");
  const page = fs.readFileSync(path.join(ROOT, "app/[locale]/migrate/[source]/page.tsx"), "utf8");
  const analytics = fs.readFileSync(path.join(ROOT, "lib/analytics.ts"), "utf8");

  assert.doesNotMatch(desk, /waitingOrigin|window\.location|use client/);
  assert.match(page, /pasteStarter/);
  assert.match(page, /renderSkillMarkdown/);
  assert.match(page, /templateShareUrl/);
  assert.match(desk, /copySkill/);
  assert.match(desk, /skillMarkdown/);
  assert.match(desk, /ShareButton/);
  assert.match(desk, /moreTitle/);
  assert.match(desk, /moreIndex/);
  assert.match(desk, /href="\/templates"/);
  const templatesPage = fs.readFileSync(path.join(ROOT, "app/[locale]/templates/page.tsx"), "utf8");
  const templatesIndex = fs.readFileSync(path.join(ROOT, "components/templates-index.tsx"), "utf8");
  const useCaseCard = fs.readFileSync(path.join(ROOT, "components/use-case-card.tsx"), "utf8");
  assert.match(templatesPage, /featuredSetups/);
  assert.match(templatesIndex, /pasteInstallCommand/);
  assert.match(templatesIndex, /TemplateSetupGrid/);
  assert.ok(
    templatesIndex.indexOf("HANDOFF_SOURCES.map") < templatesIndex.indexOf("<TemplateSetupGrid"),
    "migrate one-liners must render before the setup card grid",
  );
  assert.match(useCaseCard, /sm:grid-cols-2/);
  assert.doesNotMatch(useCaseCard, /lg:grid-cols-3/);
  assert.doesNotMatch(page, /window\.location/);
  assert.doesNotMatch(analytics, /copy_kind.*skill|content_type: "migrate"/);

  assert.equal(templateShareUrl("hermes"), `${SITE_ORIGIN}/en/migrate/hermes`);
  assert.equal(templateShareUrl("openclaw"), `${SITE_ORIGIN}/en/migrate/openclaw`);
  assert.equal(templatesIndexShareUrl(), `${SITE_ORIGIN}/en/templates`);

  for (const locale of LOCALES) {
    const raw = fs.readFileSync(path.join(ROOT, "messages", `${locale}.json`), "utf8");
    const messages = JSON.parse(raw) as {
      migrate?: {
        desk?: {
          waitingOrigin?: string;
          templateEyebrow?: string;
          skillHint?: string;
          moreTitle?: string;
          moreIndex?: string;
          copySkill?: string;
        };
      };
      templates?: { title?: string };
    };
    assert.equal(messages.migrate?.desk?.waitingOrigin, undefined, `${locale} must not ship waitingOrigin`);
    assert.equal(typeof messages.migrate?.desk?.templateEyebrow, "string", `${locale} templateEyebrow`);
    assert.equal(typeof messages.migrate?.desk?.skillHint, "string", `${locale} skillHint`);
    assert.equal(typeof messages.migrate?.desk?.moreTitle, "string", `${locale} moreTitle`);
    assert.equal(typeof messages.migrate?.desk?.moreIndex, "string", `${locale} moreIndex`);
    assert.equal(typeof messages.templates?.title, "string", `${locale} templates.title`);
    assert.equal(messages.migrate?.desk?.copySkill, "SKILL.md", `${locale} copySkill stays SKILL.md`);
    assert.doesNotMatch(raw, /Reading this page/);
    assert.doesNotMatch(messages.migrate?.desk?.skillHint ?? "", /write to Grok|importer/i);

    const hermesInstall = pasteInstallCommand("hermes", locale);
    const openclawInstall = pasteInstallCommand("openclaw", locale);
    const hermesStarter = pasteStarter("hermes", locale);
    const openclawStarter = pasteStarter("openclaw", locale);
    const hermesSkill = renderSkillMarkdown("hermes", locale);
    const openclawSkill = renderSkillMarkdown("openclaw", locale);

    assert.equal(
      hermesInstall,
      `hermes skills install ${SITE_ORIGIN}/api/migrate/skill/hermes?locale=${locale} --category productivity --name grok-bot-migrate --yes`,
    );
    assert.equal(
      openclawInstall,
      `mkdir -p skills/grok-bot-migrate && curl -fsSL ${SITE_ORIGIN}/api/migrate/skill/openclaw?locale=${locale} -o skills/grok-bot-migrate/SKILL.md`,
    );
    assert.match(hermesStarter, /hermes skills install/);
    assert.match(openclawStarter, /curl -fsSL/);
    assert.doesNotMatch(hermesStarter, /Reading this page/);
    assert.doesNotMatch(openclawStarter, /Reading this page/);
    assertNoSecrets(`${locale} hermes starter`, hermesStarter);
    assertNoSecrets(`${locale} openclaw starter`, openclawStarter);
    assertNoSecrets(`${locale} hermes skill`, hermesSkill);
    assertNoSecrets(`${locale} openclaw skill`, openclawSkill);
    assert.match(hermesSkill, /does not write to Grok|Grok에 쓰지 않는다/);
    assert.match(openclawSkill, /skipped: secret/);
  }
});

test("GET /migrate/hermes and /migrate/openclaw HTML includes the paste and no origin wait", async () => {
  const origin = (process.env.MIGRATE_TEST_ORIGIN || "").replace(/\/$/, "");
  if (!origin) {
    assert.ok(true, "skip: set MIGRATE_TEST_ORIGIN to hit the app routes");
    return;
  }

  for (const locale of LOCALES) {
    for (const source of ["hermes", "openclaw"] as const) {
      const response = await fetch(`${origin}/${locale}/migrate/${source}`);
      assert.equal(response.status, 200, `${locale}/${source} must be 200`);
      const html = await response.text();
      const visible = html.replaceAll("&amp;", "&");
      const install = pasteInstallCommand(source, locale);
      assert.equal(visible.includes(install), true, `${locale}/${source} HTML must include ${install}`);
      assert.equal(visible.includes(templateShareUrl(source)), true, `${locale}/${source} HTML must include share URL`);
      assert.equal(html.includes("name: grok-bot-migrate"), true, `${locale}/${source} HTML must include SKILL.md`);
      assert.equal(html.includes("skipped: secret"), true, `${locale}/${source} HTML must keep secret-skip`);
      assert.equal(html.includes("Reading this page"), false, `${locale}/${source} HTML must not wait on origin`);
      assert.doesNotMatch(html, /waitingOrigin/);
      assert.equal(html.includes("/templates"), true, `${locale}/${source} HTML must link to templates index`);
    }
  }

  const index = await fetch(`${origin}/en/templates`);
  assert.equal(index.status, 200, "/en/templates must be 200");
  const indexHtml = (await index.text()).replaceAll("&amp;", "&");
  assert.equal(indexHtml.includes(templatesIndexShareUrl()), true, "templates index must include share URL");
  assert.equal(indexHtml.includes(templateShareUrl("hermes")), true, "templates index must include Hermes share URL");
  assert.equal(indexHtml.includes(templateShareUrl("openclaw")), true, "templates index must include OpenClaw share URL");
  assert.equal(
    indexHtml.includes(pasteInstallCommand("hermes", "en")),
    true,
    "templates index first HTML must include Hermes one-liner",
  );
  assert.equal(
    indexHtml.includes(pasteInstallCommand("openclaw", "en")),
    true,
    "templates index first HTML must include OpenClaw one-liner",
  );
  assert.equal(indexHtml.includes("does not write to Grok"), true, "templates index must say the site does not write to Grok");
  assert.equal(indexHtml.includes("Video Editor"), true, "templates index must show Video Editor on a card");
  assert.equal(indexHtml.includes("Jess EA"), true, "templates index must show Jess EA");
  assert.equal(indexHtml.includes("/en/bots/jess-ea") || indexHtml.includes("/bots/jess-ea"), true, "templates index must link Jess EA listing");
  assert.equal(indexHtml.includes("Sanity"), true, "templates index must show Sanity");
  assert.equal(indexHtml.includes("Engineering Manager"), true, "templates index must show Engineering Manager");
  assert.doesNotMatch(indexHtml, /\/api\/migrate\/preview/);

  const migrateRoot = await fetch(`${origin}/api/migrate`);
  assert.equal(migrateRoot.status, 404, "/api/migrate must stay 404");

  const guides = await fetch(`${origin}/en/guides`);
  assert.equal(guides.status, 200, "/en/guides must be 200");

  for (const source of ["hermes", "openclaw"] as const) {
    const skill = await fetch(`${origin}/api/migrate/skill/${source}?locale=en`);
    assert.equal(skill.status, 200, `${source} skill API must stay 200`);
    assert.match(skill.headers.get("content-type") || "", /text\/markdown/);
  }
});
