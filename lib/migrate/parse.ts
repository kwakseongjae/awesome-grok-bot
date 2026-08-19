import { capRoutines, listingDraftFromProfile, memoryPaste, profilePrompt, routinePaste, skillPaste, splitMemoryChunks } from "@/lib/migrate/packets";
import type { ArchiveFile, HandoffPacket, HandoffSource, ParseResult } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

function basename(path: string) {
  return path.split("/").pop()?.toLowerCase() ?? "";
}

function fileName(path: string) {
  return path.split("/").pop() ?? path;
}

function findFile(files: ArchiveFile[], names: string[]) {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  return files.find((file) => wanted.has(basename(file.path))) ?? null;
}

function findAll(files: ArchiveFile[], test: (path: string) => boolean) {
  return files.filter((file) => test(file.path.replace(/\\/g, "/")));
}

function isDailyMemory(path: string) {
  return /(^|\/)memory(ies)?\/\d{4}-\d{2}-\d{2}[^/]*\.md$/i.test(path);
}

function isDreams(path: string) {
  return /(^|\/)dreams\.md$/i.test(path);
}

function isSkill(path: string) {
  return /(^|\/)skills\/.+\/skill\.md$/i.test(path) || /(^|\/)skill\.md$/i.test(path);
}

function isCronFile(path: string) {
  const lower = path.toLowerCase();
  return (
    /(^|\/)cron\/jobs\.json$/i.test(lower) ||
    /(^|\/)jobs\.json$/i.test(lower) && lower.includes("cron") ||
    /(^|\/)cron\/.+\.json$/i.test(lower)
  );
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function jsonValue(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

function recordKeys(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  return Object.keys(value as Record<string, unknown>);
}

function collectPluginNames(files: ArchiveFile[]) {
  const names: string[] = [];

  for (const file of files) {
    if (isSkill(file.path)) {
      const folder = file.path.replace(/\\/g, "/").split("/").slice(0, -1).pop();
      if (folder && folder.toLowerCase() !== "skills") names.push(folder.replace(/[-_]/g, " "));
    }
    const base = basename(file.path);
    if (
      base === "mcp.json" ||
      base === "openclaw.json" ||
      base === "clawdbot.json" ||
      base === "moltbot.json" ||
      base === "config.yaml" ||
      base === "config.yml"
    ) {
      const json = jsonValue(file.text);
      if (json && typeof json === "object") {
        const root = json as Record<string, unknown>;
        const mcp = (root.mcp ?? root.mcp_servers ?? root.mcpServers) as Record<string, unknown> | undefined;
        const servers =
          mcp && typeof mcp === "object"
            ? ((mcp.servers as Record<string, unknown> | undefined) ?? mcp)
            : undefined;
        names.push(...recordKeys(servers));
        const channels = root.channels;
        names.push(...recordKeys(channels));
      }
      const yamlServers = file.text.match(/^\s{0,2}([A-Za-z0-9_-]+):\s*$/gm);
      if (!json && yamlServers && /mcp/i.test(file.text)) {
        names.push(
          ...yamlServers
            .map((line) => line.replace(":", "").trim())
            .filter((key) => !["mcp", "mcp_servers", "servers", "channels"].includes(key)),
        );
      }
    }
  }

  return unique(names).slice(0, 12);
}

function asJobList(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
  }
  if (value && typeof value === "object") {
    const root = value as Record<string, unknown>;
    const jobs = root.jobs ?? root.cron ?? root.automations;
    if (Array.isArray(jobs)) {
      return jobs.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
    }
    if (typeof root.name === "string" || typeof root.prompt === "string" || typeof root.schedule === "string") {
      return [root];
    }
  }
  return [];
}

function jobSchedule(job: Record<string, unknown>) {
  const schedule = job.schedule;
  if (typeof schedule === "string") return schedule;
  if (schedule && typeof schedule === "object") {
    const spec = schedule as Record<string, unknown>;
    if (typeof spec.expr === "string") return spec.expr;
    if (typeof spec.cron === "string") return spec.cron;
    if (typeof spec.every === "string") return `every ${spec.every}`;
    if (typeof spec.kind === "string" && spec.kind === "every" && spec.everyMs) {
      return `every ${spec.everyMs}ms`;
    }
    if (typeof spec.kind === "string") return spec.kind;
  }
  if (typeof job.cron === "string") return job.cron;
  if (typeof job.every === "string") return `every ${job.every}`;
  return undefined;
}

function jobPrompt(job: Record<string, unknown>) {
  const payload = job.payload;
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;
    if (typeof body.message === "string") return body.message;
    if (typeof body.prompt === "string") return body.prompt;
    if (typeof body.text === "string") return body.text;
  }
  if (typeof job.prompt === "string") return job.prompt;
  if (typeof job.message === "string") return job.message;
  if (typeof job.task === "string") return job.task;
  return "";
}

function jobName(job: Record<string, unknown>, index: number) {
  if (typeof job.name === "string" && job.name.trim()) return job.name.trim();
  if (typeof job.id === "string" && job.id.trim()) return job.id.trim();
  return `job-${index + 1}`;
}

function jobSkill(job: Record<string, unknown>) {
  if (typeof job.skill === "string") return job.skill;
  if (Array.isArray(job.skills) && typeof job.skills[0] === "string") return job.skills[0];
  return undefined;
}

function detectSource(files: ArchiveFile[], hinted: HandoffSource): HandoffSource {
  const paths = files.map((file) => file.path.toLowerCase()).join("\n");
  if (hinted === "openclaw") return "openclaw";
  if (hinted === "hermes") return "hermes";
  if (paths.includes("openclaw.json") || paths.includes("clawdbot.json") || paths.includes("moltbot.json") || paths.includes("heartbeat.md")) {
    return "openclaw";
  }
  return "hermes";
}

function personaName(soul: string, identity: string, source: HandoffSource, locale: ListingLocale) {
  const heading = soul.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim()
    || identity.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim()
    || soul.match(/name:\s*(.+)/i)?.[1]?.trim();
  if (heading) return heading.slice(0, 80);
  if (locale === "ko") return source === "hermes" ? "Hermes 인수 봇" : "OpenClaw 인수 봇";
  return source === "hermes" ? "Hermes handoff bot" : "OpenClaw handoff bot";
}

export function buildHandoff(files: ArchiveFile[], hinted: HandoffSource, locale: ListingLocale): ParseResult {
  const source = detectSource(files, hinted);
  const soul = findFile(files, ["SOUL.md"])?.text ?? "";
  const agents = findFile(files, ["AGENTS.md"])?.text ?? "";
  const identity = findFile(files, ["IDENTITY.md"])?.text ?? "";
  const memory = findFile(files, ["MEMORY.md"])?.text ?? "";
  const user = findFile(files, ["USER.md"])?.text ?? "";
  const heartbeat = findFile(files, ["HEARTBEAT.md"])?.text ?? "";
  const plugins = collectPluginNames(files);
  const name = personaName(soul, identity, source, locale);
  const prompt = profilePrompt({ name, soul, agents, identity, plugins, locale });

  const packets: HandoffPacket[] = [
    {
      id: "profile",
      kind: "profile",
      title: locale === "ko" ? "프로필 · 설정 문구" : "Profile · setup text",
      source: [soul && "SOUL.md", agents && "AGENTS.md", identity && "IDENTITY.md"].filter(Boolean).join(", ") || "persona",
      body: prompt,
    },
  ];

  const memorySources = [
    { path: findFile(files, ["MEMORY.md"])?.path ?? "MEMORY.md", text: memory },
    { path: findFile(files, ["USER.md"])?.path ?? "USER.md", text: user },
  ];

  memorySources.forEach((entry, sourceIndex) => {
    splitMemoryChunks(entry.text, fileName(entry.path)).forEach((chunk, index) => {
      packets.push({
        id: `memory-${sourceIndex}-${index}`,
        kind: "memory",
        title: chunk.title,
        source: fileName(entry.path),
        body: memoryPaste(chunk.body, locale),
      });
    });
  });

  findAll(files, (path) => isDailyMemory(path) || isDreams(path)).forEach((file, index) => {
    splitMemoryChunks(file.text, fileName(file.path)).forEach((chunk, chunkIndex) => {
      packets.push({
        id: `memory-optional-${index}-${chunkIndex}`,
        kind: "memory",
        title: chunk.title,
        source: file.path,
        body: memoryPaste(chunk.body, locale),
        optional: true,
      });
    });
  });

  const skillFiles = findAll(files, isSkill);
  skillFiles.forEach((file, index) => {
    const parsed = {
      name: file.path.replace(/\\/g, "/").split("/").slice(0, -1).pop()?.replace(/[-_]/g, " ") || `skill ${index + 1}`,
      body: file.text,
    };
    const heading = file.text.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim();
    packets.push({
      id: `skill-${index}`,
      kind: "skill",
      title: heading || parsed.name,
      source: file.path,
      body: skillPaste(heading || parsed.name, parsed.body, locale),
    });
  });

  const cronFiles = findAll(files, isCronFile);
  let routineIndex = 0;
  for (const file of cronFiles) {
    const jobs = asJobList(jsonValue(file.text));
    for (const job of jobs) {
      const promptText = jobPrompt(job);
      const nameText = jobName(job, routineIndex);
      if (!promptText && !jobSchedule(job) && nameText.startsWith("job-")) continue;
      packets.push({
        id: `routine-${routineIndex}`,
        kind: "routine",
        title: nameText,
        source: file.path,
        body: routinePaste({
          name: nameText,
          schedule: jobSchedule(job),
          prompt: promptText,
          skill: jobSkill(job),
          locale,
        }),
      });
      routineIndex += 1;
    }
  }

  if (heartbeat.trim()) {
    packets.push({
      id: "routine-heartbeat",
      kind: "routine",
      title: locale === "ko" ? "HEARTBEAT 점검" : "HEARTBEAT check",
      source: "HEARTBEAT.md",
      body: routinePaste({
        name: "HEARTBEAT",
        schedule: "heartbeat",
        prompt: heartbeat,
        locale,
      }),
    });
  }

  const capped = capRoutines(packets);
  return {
    source,
    packets: capped,
    listingDraft: listingDraftFromProfile({ name, prompt, plugins, locale }),
    skipped: [],
    redactedCount: 0,
  };
}
