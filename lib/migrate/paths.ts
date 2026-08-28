import type { ArchiveFile, HandoffSource } from "@/lib/migrate/types";

export const posixPath = (path: string) => path.replace(/\\/g, "/");

export const fileName = (path: string) => posixPath(path).split("/").pop() ?? path;

export const basename = (path: string) => fileName(path).toLowerCase();

export const findFile = (files: ArchiveFile[], names: string[]) => {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  return files.find((file) => wanted.has(basename(file.path))) ?? null;
};

export const hasPath = (files: ArchiveFile[], name: string) => {
  const lower = posixPath(name).toLowerCase();
  return files.some((file) => {
    const path = posixPath(file.path).toLowerCase();
    return path === lower || path.endsWith(`/${lower}`);
  });
};

export const findAll = (files: ArchiveFile[], test: (path: string) => boolean) =>
  files.filter((file) => test(posixPath(file.path)));

export const isDailyMemory = (path: string) =>
  /(^|\/)memor(?:y|ies)\/\d{4}-\d{2}-\d{2}[^/]*\.md$/i.test(posixPath(path));

export const isDreams = (path: string) => /(^|\/)dreams\.md$/i.test(posixPath(path));

export const isHeartbeat = (path: string) => /(^|\/)heartbeat\.md$/i.test(posixPath(path));

export const isSkill = (path: string) => {
  const normalized = posixPath(path);
  return /(^|\/)skills\/.+\/skill\.md$/i.test(normalized) || /(^|\/)skill\.md$/i.test(normalized);
};

export const isCronFile = (path: string) => {
  const lower = posixPath(path).toLowerCase();
  return (
    /(^|\/)cron\/jobs\.json$/i.test(lower) ||
    (/(^|\/)jobs\.json$/i.test(lower) && lower.includes("cron")) ||
    /(^|\/)cron\/.+\.json$/i.test(lower)
  );
};

export const identityNames = (source: HandoffSource) =>
  source === "hermes"
    ? ["SOUL.md", "USER.md", "MEMORY.md"]
    : ["SOUL.md", "AGENTS.md", "USER.md", "MEMORY.md", "HEARTBEAT.md", "openclaw.json", "cron/jobs.json"];

export const skillNameFrom = (file: ArchiveFile) => {
  const frontmatter = file.text.match(/^---\s*\n([\s\S]*?)\n---/);
  const named = frontmatter?.[1].match(/^name:\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, "");
  if (named) return named;
  const heading = file.text.match(/^#{1,3}\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading;
  const folder = posixPath(file.path).split("/").slice(0, -1).pop();
  return folder || "skill";
};
