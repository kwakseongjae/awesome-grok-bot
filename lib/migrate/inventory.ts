import { asJobList, jobName, jobSchedule, jsonValue } from "@/lib/migrate/jobs";
import {
  findAll,
  findFile,
  hasPath,
  identityNames,
  isCronFile,
  isDailyMemory,
  isDreams,
  isHeartbeat,
  isSkill,
  skillNameFrom,
} from "@/lib/migrate/paths";
import { isSecretPath } from "@/lib/migrate/secrets";
import { sourceLabel } from "@/lib/migrate/source";
import type {
  ArchiveFile,
  HandoffSource,
  InventoryMemory,
  InventoryRoutine,
  InventoryTool,
  Phase0Inventory,
} from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

export const GOLD_TASKS_PROMPT = {
  en: "Ask for 3–5 gold tasks (name, input, expected output). Do not touch Grok yet.",
  ko: "골드 태스크 3–5개(이름, 입력, 기대 출력)를 물어라. Grok을 아직 만지지 마라.",
} as const;

const recordKeys = (value: unknown): string[] => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.keys(value as Record<string, unknown>);
};

const unique = (items: string[]) => [...new Set(items.map((item) => item.trim()).filter(Boolean))];

const headingCount = (text: string) => {
  const headings = text.match(/^#{2,3}\s+.+$/gm);
  if (headings && headings.length > 0) return headings.length;
  return text.trim() ? 1 : 0;
};

const toolNamesFromFiles = (files: ArchiveFile[]) => {
  const names: string[] = [];
  for (const file of files) {
    const base = file.path.replace(/\\/g, "/").split("/").pop()?.toLowerCase() ?? "";
    if (
      base !== "openclaw.json" &&
      base !== "clawdbot.json" &&
      base !== "moltbot.json" &&
      base !== "mcp.json"
    ) {
      continue;
    }
    const json = jsonValue(file.text);
    if (!json || typeof json !== "object") continue;
    const root = json as Record<string, unknown>;
    names.push(...recordKeys(root.channels));
    const mcp = (root.mcp ?? root.mcp_servers ?? root.mcpServers) as Record<string, unknown> | undefined;
    const servers =
      mcp && typeof mcp === "object" ? ((mcp.servers as Record<string, unknown> | undefined) ?? mcp) : undefined;
    names.push(...recordKeys(servers));
  }
  return unique(names);
};

const memoryStats = (files: ArchiveFile[]): InventoryMemory => {
  const memoryFile = findFile(files, ["MEMORY.md"]);
  const standingFiles = memoryFile ? [fileLabel(memoryFile.path)] : [];
  let standingEntries = memoryFile ? headingCount(memoryFile.text) : 0;

  const extraStanding = findAll(
    files,
    (path) =>
      /(^|\/)memor(?:y|ies)\/.+\.md$/i.test(path) && !isDailyMemory(path) && !isDreams(path) && !isHeartbeat(path),
  );
  for (const file of extraStanding) {
    standingFiles.push(fileLabel(file.path));
    standingEntries += headingCount(file.text);
  }

  return {
    standingFiles,
    standingEntries,
    dailyNotes: findAll(files, isDailyMemory).map((file) => fileLabel(file.path)),
    dreams: findAll(files, isDreams).map((file) => fileLabel(file.path)),
    heartbeat: Boolean(findFile(files, ["HEARTBEAT.md"]) || findAll(files, isHeartbeat).length),
  };
};

const fileLabel = (path: string) => path.replace(/\\/g, "/");

const routinesFrom = (files: ArchiveFile[]): InventoryRoutine[] => {
  const routines: InventoryRoutine[] = [];
  let index = 0;
  for (const file of findAll(files, isCronFile)) {
    for (const job of asJobList(jsonValue(file.text))) {
      const name = jobName(job, index);
      const schedule = jobSchedule(job) ?? null;
      if (!schedule && name.startsWith("job-") && !jobPromptSafe(job)) continue;
      routines.push({ name, schedule, source: fileLabel(file.path) });
      index += 1;
    }
  }
  return routines;
};

const jobPromptSafe = (job: Record<string, unknown>) =>
  typeof job.prompt === "string" || typeof job.message === "string" || typeof job.task === "string";

export const goldTasksPrompt = (locale: ListingLocale) =>
  locale === "ko" ? GOLD_TASKS_PROMPT.ko : GOLD_TASKS_PROMPT.en;

export const formatInventoryTable = (inventory: Phase0Inventory, locale: ListingLocale) => {
  const ko = locale === "ko";
  const yes = (present: boolean) => (present ? (ko ? "있음" : "yes") : ko ? "없음" : "no");
  const identity = inventory.identity.map((row) => `${row.name} ${yes(row.present)}`).join(" · ");
  const daily = inventory.memory.dailyNotes.length;
  const dreams = inventory.memory.dreams.length;
  const memory = ko
    ? `고정 ${inventory.memory.standingEntries} · 일일 ${daily} (작업 레이어, 기본 큐 제외) · DREAMS ${dreams}${inventory.memory.heartbeat ? " · HEARTBEAT 작업 레이어" : ""}`
    : `standing ${inventory.memory.standingEntries} · daily ${daily} (working layer, not queued) · DREAMS ${dreams}${inventory.memory.heartbeat ? " · HEARTBEAT working layer" : ""}`;
  const skills = inventory.skills.map((skill) => skill.name).join(", ") || (ko ? "(없음)" : "(none)");
  const routines =
    inventory.routines
      .map((routine) => (routine.schedule ? `${routine.name} (${routine.schedule})` : routine.name))
      .join(", ") || (ko ? "(없음)" : "(none)");
  const tools = inventory.tools.map((tool) => tool.name).join(", ") || (ko ? "(없음)" : "(none)");
  const secretNames = inventory.skippedSecrets.join(" · ") || (ko ? "(없음)" : "(none)");
  const area = ko ? "영역" : "Area";
  const found = ko ? "결과" : "Found";

  return [
    ko ? `## ${sourceLabel(inventory.source)} 인벤토리` : `## ${sourceLabel(inventory.source)} inventory`,
    "",
    `| ${area} | ${found} |`,
    "| --- | --- |",
    `| ${ko ? "정체성" : "Identity"} | ${identity} |`,
    `| ${ko ? "기억" : "Memory"} | ${memory} |`,
    `| ${ko ? "스킬" : "Skills"} | ${skills} |`,
    `| ${ko ? "루틴" : "Routines"} | ${routines} |`,
    `| ${ko ? "도구" : "Tools"} | ${tools} |`,
    `| ${ko ? "시크릿" : "Secrets"} | ${ko ? `skipped ${inventory.skippedSecrets.length}` : `skipped ${inventory.skippedSecrets.length}`} · ${secretNames} |`,
    `| Grok | ${ko ? "만지지 않음" : "not touched"} |`,
    "",
    inventory.goldTasksPrompt,
  ].join("\n");
};

export const buildInventory = (input: {
  source: HandoffSource;
  locale: ListingLocale;
  files: ArchiveFile[];
  skipped: string[];
}): Phase0Inventory => {
  const files = input.files.filter((file) => !isSecretPath(file.path));
  const skippedSecrets = unique(input.skipped.filter((path) => isSecretPath(path)));
  const skippedOther = unique(input.skipped.filter((path) => !isSecretPath(path)));
  const identity = identityNames(input.source).map((name) => ({
    name,
    present: hasPath(files, name),
  }));
  const skills = findAll(files, isSkill).map((file) => ({
    name: skillNameFrom(file),
    path: fileLabel(file.path),
  }));
  const tools: InventoryTool[] = toolNamesFromFiles(files).map((name) => ({
    name,
    state: "configured" as const,
  }));
  const inventory: Phase0Inventory = {
    source: input.source,
    identity,
    memory: memoryStats(files),
    skills,
    routines: routinesFrom(files),
    tools,
    skippedSecrets,
    skippedOther,
    goldTasksPrompt: goldTasksPrompt(input.locale),
    grokTouched: false,
    table: "",
  };
  inventory.table = formatInventoryTable(inventory, input.locale);
  return inventory;
};

/** True when serialized inventory still contains a fixture sentinel. */
export const inventoryLeaks = (inventory: Phase0Inventory, sentinels: readonly string[]) => {
  const blob = JSON.stringify(inventory);
  return sentinels.filter((sentinel) => blob.includes(sentinel));
};
