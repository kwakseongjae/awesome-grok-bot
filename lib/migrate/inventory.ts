import fs from "node:fs";
import path from "node:path";
import { isSecretPath, isTextPath, normalizeArchivePath, shouldSkipPath } from "./secrets";
import { profilePrompt } from "./packets";
import { GOLD_TASKS_MISSING, goldTasksReady, type GoldTask } from "./playbook";
import type { ArchiveFile, HandoffPacket, HandoffSource } from "./types";
import type { ListingLocale } from "../types";

const IDENTITY_NAMES = new Set(["soul.md", "user.md", "agents.md", "identity.md"]);
const MEMORY_NAMES = new Set(["memory.md"]);

export type CronEntry = {
  name: string;
  schedule: string;
  path: string;
};

export type SkillEntry = {
  name: string;
  path: string;
};

export type WorkspaceInventory = {
  present: {
    soul: boolean;
    user: boolean;
    memory: boolean;
    agents: boolean;
    identity: boolean;
    heartbeat: boolean;
    openclaw: boolean;
  };
  identityFiles: string[];
  memoryFiles: string[];
  skills: SkillEntry[];
  cron: CronEntry[];
  tools: string[];
  skippedSecrets: string[];
  skippedOther: string[];
};

const isDailyMemory = (filePath: string) =>
  /(^|\/)memory(ies)?\/\d{4}-\d{2}-\d{2}[^/]*\.md$/i.test(filePath);

const isDreams = (filePath: string) => /(^|\/)dreams\.md$/i.test(filePath);

const isSkillPath = (filePath: string) =>
  /(^|\/)skills\/.+\/skill\.md$/i.test(filePath) || /(^|\/)skill\.md$/i.test(filePath);

const isCronPath = (filePath: string) => {
  const lower = filePath.toLowerCase();
  return (
    /(^|\/)cron\/jobs\.json$/i.test(lower) ||
    (/(^|\/)jobs\.json$/i.test(lower) && lower.includes("cron")) ||
    /(^|\/)cron\/.+\.json$/i.test(lower) ||
    /(^|\/)crontab$/i.test(lower) ||
    /(^|\/)cron$/.test(lower)
  );
};

const basename = (filePath: string) => filePath.split("/").pop()?.toLowerCase() ?? "";

const skillName = (filePath: string) => {
  const parts = filePath.replace(/\\/g, "/").split("/");
  const folder = parts.length >= 2 ? parts[parts.length - 2] : "";
  if (folder && folder.toLowerCase() !== "skills") return folder;
  return parts[parts.length - 1]?.replace(/\.md$/i, "") || "skill";
};

const asJobList = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
  }
  if (value && typeof value === "object") {
    const root = value as Record<string, unknown>;
    const jobs = root.jobs ?? root.cron ?? root.automations;
    if (Array.isArray(jobs)) {
      return jobs.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
    }
    if (typeof root.name === "string" || typeof root.prompt === "string" || typeof root.schedule === "string" || typeof root.cron === "string") {
      return [root];
    }
  }
  return [];
};

const jobSchedule = (job: Record<string, unknown>) => {
  if (typeof job.cron === "string") return job.cron;
  const schedule = job.schedule;
  if (typeof schedule === "string") return schedule;
  if (schedule && typeof schedule === "object") {
    const spec = schedule as Record<string, unknown>;
    if (typeof spec.expr === "string") return spec.expr;
    if (typeof spec.cron === "string") return spec.cron;
  }
  return "";
};

const jobName = (job: Record<string, unknown>, index: number) => {
  if (typeof job.name === "string" && job.name.trim()) return job.name.trim();
  if (typeof job.id === "string" && job.id.trim()) return job.id.trim();
  return `job-${index + 1}`;
};

const toolNamesFromConfig = (text: string) => {
  try {
    const json = JSON.parse(text) as Record<string, unknown>;
    const names: string[] = [];
    if (json.channels && typeof json.channels === "object" && !Array.isArray(json.channels)) {
      names.push(...Object.keys(json.channels as Record<string, unknown>));
    }
    const mcp = json.mcp ?? json.mcp_servers ?? json.mcpServers;
    if (mcp && typeof mcp === "object" && !Array.isArray(mcp)) {
      const root = mcp as Record<string, unknown>;
      const servers = (root.servers as Record<string, unknown> | undefined) ?? root;
      if (servers && typeof servers === "object" && !Array.isArray(servers)) {
        names.push(
          ...Object.keys(servers).filter((key) => !["mcp", "mcp_servers", "servers", "channels"].includes(key)),
        );
      }
    }
    return [...new Set(names.filter(Boolean))];
  } catch {
    return [];
  }
};

const cronFromFile = (filePath: string, text: string): CronEntry[] => {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".json")) {
    try {
      const jobs = asJobList(JSON.parse(text) as unknown);
      return jobs.map((job, index) => ({
        name: jobName(job, index),
        schedule: jobSchedule(job),
        path: filePath,
      }));
    } catch {
      return [{ name: path.basename(filePath), schedule: "", path: filePath }];
    }
  }
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line, index) => ({
      name: line.split(/\s+/).slice(5).join(" ") || `cron-${index + 1}`,
      schedule: line,
      path: filePath,
    }));
};

const walkFiles = (rootDir: string) => {
  const skippedSecrets: string[] = [];
  const skippedOther: string[] = [];
  const readable: string[] = [];

  const visit = (dir: string) => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry.name === "." || entry.name === "..") continue;
      const full = path.join(dir, entry.name);
      const rel = normalizeArchivePath(path.relative(rootDir, full));
      if (!rel || rel === "readme.md" || rel.endsWith("/readme.md")) continue;
      if (entry.isDirectory()) {
        if (shouldSkipPath(`${rel}/`) || isSecretPath(`${rel}/`)) {
          if (isSecretPath(`${rel}/`)) skippedSecrets.push(rel);
          else skippedOther.push(rel);
          continue;
        }
        visit(full);
        continue;
      }
      if (!entry.isFile()) continue;
      if (isSecretPath(rel) || shouldSkipPath(rel)) {
        if (isSecretPath(rel)) skippedSecrets.push(rel);
        else skippedOther.push(rel);
        continue;
      }
      if (!isTextPath(rel)) {
        skippedOther.push(rel);
        continue;
      }
      readable.push(rel);
    }
  };

  visit(rootDir);
  return { readable, skippedSecrets, skippedOther };
};

export const readWorkspaceDir = (rootDir: string) => {
  const root = path.resolve(rootDir);
  const { readable, skippedSecrets, skippedOther } = walkFiles(root);
  const files: ArchiveFile[] = readable.map((rel) => ({
    path: rel,
    text: fs.readFileSync(path.join(root, rel), "utf8"),
  }));
  return { files, skippedSecrets, skippedOther };
};

export const inventoryFromScan = (
  files: ArchiveFile[],
  skippedSecrets: string[],
  skippedOther: string[] = [],
): WorkspaceInventory => {
  const identityFiles: string[] = [];
  const memoryFiles: string[] = [];
  const skills: SkillEntry[] = [];
  const cron: CronEntry[] = [];
  const tools: string[] = [];
  const present = {
    soul: false,
    user: false,
    memory: false,
    agents: false,
    identity: false,
    heartbeat: false,
    openclaw: false,
  };

  for (const file of files) {
    const rel = normalizeArchivePath(file.path);
    const base = basename(rel);
    if (base === "soul.md") present.soul = true;
    if (base === "user.md") present.user = true;
    if (base === "memory.md") present.memory = true;
    if (base === "agents.md") present.agents = true;
    if (base === "identity.md") present.identity = true;
    if (base === "heartbeat.md") present.heartbeat = true;
    if (base === "openclaw.json" || base === "clawdbot.json" || base === "moltbot.json") {
      present.openclaw = true;
      tools.push(...toolNamesFromConfig(file.text));
    }
    if (IDENTITY_NAMES.has(base) || MEMORY_NAMES.has(base)) identityFiles.push(rel);
    if (MEMORY_NAMES.has(base) || isDailyMemory(rel) || isDreams(rel) || /(^|\/)memory(ies)?\//i.test(rel)) {
      memoryFiles.push(rel);
    }
    if (isSkillPath(rel)) skills.push({ name: skillName(rel), path: rel });
    if (isCronPath(rel)) cron.push(...cronFromFile(rel, file.text));
  }

  return {
    present,
    identityFiles: [...new Set(identityFiles)],
    memoryFiles: [...new Set(memoryFiles)],
    skills,
    cron,
    tools: [...new Set(tools)],
    skippedSecrets: [...new Set(skippedSecrets)],
    skippedOther: [...new Set(skippedOther)],
  };
};

export const inventoryWorkspace = (rootDir: string) => {
  const scanned = readWorkspaceDir(rootDir);
  return inventoryFromScan(scanned.files, scanned.skippedSecrets, scanned.skippedOther);
};

export const formatInventoryTable = (inventory: WorkspaceInventory) => {
  const identityLines = [
    `SOUL.md\t${inventory.present.soul ? "present" : "missing"}`,
    `USER.md\t${inventory.present.user ? "present" : "missing"}`,
    `AGENTS.md\t${inventory.present.agents ? "present" : "missing"}`,
    `MEMORY.md\t${inventory.present.memory ? "present" : "missing"}`,
    `HEARTBEAT.md\t${inventory.present.heartbeat ? "present (off default queue)" : "missing"}`,
  ];
  const skillLines =
    inventory.skills.length > 0
      ? inventory.skills.map((skill) => `${skill.name}\t${skill.path}`)
      : ["(none)"];
  const cronLines =
    inventory.cron.length > 0
      ? inventory.cron.map((job) => `${job.name}\t${job.schedule || "(no clock)"}\t${job.path}`)
      : ["(none)"];
  const secretLines =
    inventory.skippedSecrets.length > 0
      ? inventory.skippedSecrets.map((filePath) => `${filePath}\tskipped: secret`)
      : ["(none)"];

  return [
    "Phase 0 inventory",
    "",
    "Identity files",
    ...identityLines,
    "",
    `Memory files: ${inventory.memoryFiles.length} (daily/DREAMS counted separately; not queued by default)`,
    "",
    "Skills",
    ...skillLines,
    "",
    "Cron",
    ...cronLines,
    "",
    "Tools (names only)",
    inventory.tools.length > 0 ? inventory.tools.join(", ") : "(none)",
    "",
    `Skipped secret files: ${inventory.skippedSecrets.length}`,
    ...secretLines,
  ].join("\n");
};

const headingName = (soul: string, user: string, source: HandoffSource, locale: ListingLocale) => {
  const heading =
    soul.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim() ||
    user.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim() ||
    soul.match(/name:\s*(.+)/i)?.[1]?.trim();
  if (heading) return heading.slice(0, 80);
  if (locale === "ko") return source === "hermes" ? "Hermes 인수 봇" : "OpenClaw 인수 봇";
  return source === "hermes" ? "Hermes handoff bot" : "OpenClaw handoff bot";
};

export const draftChiefPacket = (
  files: ArchiveFile[],
  locale: ListingLocale,
  source: HandoffSource = "hermes",
): HandoffPacket => {
  const soul = files.find((file) => basename(file.path) === "soul.md")?.text ?? "";
  const user = files.find((file) => basename(file.path) === "user.md")?.text ?? "";
  const agents = files.find((file) => basename(file.path) === "agents.md")?.text ?? "";
  const identity = files.find((file) => basename(file.path) === "identity.md")?.text ?? "";
  const name = headingName(soul, user, source, locale);
  const body = profilePrompt({ name, soul, user, agents, identity, plugins: [], locale });
  return {
    id: "profile",
    kind: "profile",
    title: locale === "ko" ? "프로필 · 설정 문구" : "Profile · setup text",
    source: [soul && "SOUL.md", user && "USER.md", agents && "AGENTS.md"].filter(Boolean).join(", ") || "persona",
    body,
  };
};

export const advanceToPhase1 = (input: {
  files: ArchiveFile[];
  locale: ListingLocale;
  source?: HandoffSource;
  goldTasks?: GoldTask[];
}) => {
  if (!goldTasksReady(input.goldTasks ?? [])) {
    return { stopped: true as const, reason: GOLD_TASKS_MISSING, packet: null };
  }
  return {
    stopped: false as const,
    reason: null,
    packet: draftChiefPacket(input.files, input.locale, input.source ?? "hermes"),
  };
};
