import { gunzipSync } from "node:zlib";
import JSZip from "jszip";
import { isTextPath, normalizeArchivePath, redactSecrets, shouldSkipPath } from "./secrets";
import type { ArchiveFile, TextFileInput } from "./types";

const MAX_FILES = 200;
const MAX_TEXT_BYTES = 256_000;
const MAX_TOTAL_BYTES = 8_000_000;

function decodeText(bytes: Uint8Array) {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

function readCString(bytes: Uint8Array) {
  const end = bytes.indexOf(0);
  return decodeText(end === -1 ? bytes : bytes.subarray(0, end)).trim();
}

function parseTar(buffer: Uint8Array) {
  const files: { path: string; bytes: Uint8Array }[] = [];
  let offset = 0;

  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;

    const name = readCString(header.subarray(0, 100));
    const prefix = readCString(header.subarray(345, 500));
    const size = Number.parseInt(readCString(header.subarray(124, 136)), 8) || 0;
    const typeFlag = header[156] ?? 0;
    offset += 512;
    const data = buffer.subarray(offset, offset + size);
    offset += Math.ceil(size / 512) * 512;
    if (!name || name.startsWith("PaxHeader/") || name.startsWith("././@PaxHeader")) {
      continue;
    }
    const path = prefix ? `${prefix}/${name}` : name;
    if (typeFlag === 0 || typeFlag === 48) {
      files.push({ path, bytes: data });
    }
  }

  return files;
}

function isZip(bytes: Uint8Array) {
  return bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b;
}

function isGzip(bytes: Uint8Array) {
  return bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

async function unzip(bytes: Uint8Array) {
  const zip = await JSZip.loadAsync(bytes, { createFolders: false });
  const files: { path: string; bytes: Uint8Array }[] = [];
  const entries = Object.values(zip.files);
  for (const entry of entries) {
    if (entry.dir) continue;
    const content = await entry.async("uint8array");
    files.push({ path: entry.name, bytes: content });
  }
  return files;
}

function expandArchive(name: string, bytes: Uint8Array) {
  const lower = name.toLowerCase();
  if (isZip(bytes) || lower.endsWith(".zip")) {
    return unzip(bytes);
  }
  if (isGzip(bytes) || lower.endsWith(".tar.gz") || lower.endsWith(".tgz")) {
    return Promise.resolve(parseTar(gunzipSync(Buffer.from(bytes))));
  }
  if (lower.endsWith(".tar")) {
    return Promise.resolve(parseTar(bytes));
  }
  return Promise.resolve([{ path: name, bytes }]);
}

export async function collectArchiveFiles(inputs: TextFileInput[]) {
  const collected: ArchiveFile[] = [];
  const skipped: string[] = [];
  let redactedCount = 0;
  let total = 0;

  for (const input of inputs) {
    const expanded = await expandArchive(input.name, input.bytes);
    for (const file of expanded) {
      const path = normalizeArchivePath(file.path);
      if (shouldSkipPath(path)) {
        skipped.push(path);
        continue;
      }
      if (!isTextPath(path)) {
        skipped.push(path);
        continue;
      }
      if (file.bytes.byteLength > MAX_TEXT_BYTES) {
        skipped.push(`${path} (too large)`);
        continue;
      }
      total += file.bytes.byteLength;
      if (total > MAX_TOTAL_BYTES || collected.length >= MAX_FILES) {
        skipped.push(`${path} (limit)`);
        continue;
      }
      const decoded = decodeText(file.bytes);
      const redacted = redactSecrets(decoded);
      redactedCount += redacted.count;
      collected.push({ path, text: redacted.text });
    }
  }

  return { files: collected, skipped, redactedCount };
}
