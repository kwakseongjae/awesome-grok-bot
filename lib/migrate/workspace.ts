import fs from "node:fs";
import path from "node:path";
import { buildInventory } from "@/lib/migrate/inventory";
import { isTextPath, normalizeArchivePath, redactSecrets, shouldSkipPath } from "@/lib/migrate/secrets";
import type { ArchiveFile, HandoffSource } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

const MAX_FILES = 200;
const MAX_TEXT_BYTES = 256_000;

const walk = (root: string, relative: string, skipped: string[], files: { path: string; abs: string }[]) => {
  const absDir = relative ? path.join(root, relative) : root;
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const rel = relative ? `${relative}/${entry.name}` : entry.name;
    const normalized = normalizeArchivePath(rel);
    if (shouldSkipPath(normalized) || shouldSkipPath(`${normalized}/`)) {
      skipped.push(normalized);
      continue;
    }
    const abs = path.join(root, rel);
    if (entry.isDirectory()) {
      walk(root, rel, skipped, files);
      continue;
    }
    if (!entry.isFile()) continue;
    files.push({ path: normalized, abs });
  }
};

/** Read a workspace without opening secret paths. Never follows symlinks out. */
export const scanWorkspaceDir = (root: string) => {
  const absRoot = fs.realpathSync(root);
  const skipped: string[] = [];
  const listed: { path: string; abs: string }[] = [];
  walk(absRoot, "", skipped, listed);

  const files: ArchiveFile[] = [];
  let redactedCount = 0;

  for (const entry of listed) {
    if (shouldSkipPath(entry.path)) {
      skipped.push(entry.path);
      continue;
    }
    if (!isTextPath(entry.path)) {
      skipped.push(entry.path);
      continue;
    }
    let stat: fs.Stats;
    try {
      stat = fs.statSync(entry.abs);
    } catch {
      skipped.push(entry.path);
      continue;
    }
    if (stat.size > MAX_TEXT_BYTES || files.length >= MAX_FILES) {
      skipped.push(entry.path);
      continue;
    }
    const decoded = fs.readFileSync(entry.abs, "utf8");
    const redacted = redactSecrets(decoded);
    redactedCount += redacted.count;
    files.push({ path: entry.path, text: redacted.text });
  }

  return { files, skipped: [...new Set(skipped)], redactedCount };
};

export const runPhase0 = (root: string, source: HandoffSource, locale: ListingLocale) => {
  const scan = scanWorkspaceDir(root);
  return {
    ...scan,
    inventory: buildInventory({
      source,
      locale,
      files: scan.files,
      skipped: scan.skipped,
    }),
  };
};
