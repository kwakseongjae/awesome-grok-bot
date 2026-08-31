import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const DOC_LANGS = ["en", "ko"] as const;
export type DocLang = (typeof DOC_LANGS)[number];

export const isDocLang = (value: string): value is DocLang =>
  (DOC_LANGS as readonly string[]).includes(value);

export type DocMeta = {
  title: string;
  lang: string;
  version: string;
  updated: string;
};

export type DocNode =
  | { type: "h1" | "h2" | "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "hr" }
  | { type: "img"; alt: string; src: string; missing: boolean };

const ROOT = join(process.cwd(), "content/101");

export const docPath = (lang: DocLang) => join(ROOT, `${lang}.md`);

export const loadDocMarkdown = (lang: DocLang) => readFileSync(docPath(lang), "utf8");

const parseFrontmatter = (raw: string): { meta: DocMeta; body: string } => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const empty: DocMeta = { title: "Grok Bot 101", lang: "en", version: "0.2.0", updated: "" };
  if (!match) return { meta: empty, body: raw };
  const meta = { ...empty };
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key === "title" || key === "lang" || key === "version" || key === "updated") {
      meta[key] = value;
    }
  }
  return { meta, body: match[2].trim() };
};

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "section";

const assetMissing = (src: string) => {
  const name = src.replace(/^assets\//, "");
  return !existsSync(join(ROOT, "assets", name));
};

export const parseDoc = (raw: string): { meta: DocMeta; nodes: DocNode[]; toc: { id: string; text: string }[] } => {
  const { meta, body } = parseFrontmatter(raw);
  const lines = body.split("\n");
  const nodes: DocNode[] = [];
  const toc: { id: string; text: string }[] = [];
  let i = 0;
  const used = new Map<string, number>();

  const headingId = (text: string) => {
    const base = slug(text);
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };

  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    if (line.trim() === "---") {
      nodes.push({ type: "hr" });
      i += 1;
      continue;
    }
    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      const level = h[1].length as 1 | 2 | 3;
      const text = h[2].trim();
      const id = headingId(text);
      const type = (`h${level}` as "h1" | "h2" | "h3");
      nodes.push({ type, text, id });
      if (level === 2) toc.push({ id, text });
      i += 1;
      continue;
    }
    const img = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
    if (img) {
      const src = img[2].trim();
      nodes.push({ type: "img", alt: img[1], src, missing: assetMissing(src) });
      i += 1;
      continue;
    }
    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && (lines[i] ?? "").startsWith("> ")) {
        buf.push((lines[i] ?? "").replace(/^>\s?/, ""));
        i += 1;
      }
      nodes.push({ type: "quote", text: buf.join(" ") });
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^[-*]\s+/, ""));
        i += 1;
      }
      nodes.push({ type: "ul", items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      nodes.push({ type: "ol", items });
      continue;
    }
    const buf: string[] = [line];
    i += 1;
    while (i < lines.length) {
      const next = lines[i] ?? "";
      if (
        next.trim() === "" ||
        next.trim() === "---" ||
        /^#{1,3}\s+/.test(next) ||
        /^[-*]\s+/.test(next) ||
        /^\d+\.\s+/.test(next) ||
        next.startsWith("> ") ||
        /^!\[/.test(next.trim())
      ) {
        break;
      }
      buf.push(next);
      i += 1;
    }
    nodes.push({ type: "p", text: buf.join(" ") });
  }

  return { meta, nodes, toc };
};

export const loadDoc = (lang: DocLang) => parseDoc(loadDocMarkdown(lang));
