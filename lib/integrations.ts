import type { ListingLocale } from "@/lib/types";

export type KnownIntegrationId =
  | "gmail"
  | "slack"
  | "googlecalendar"
  | "salesforce"
  | "notion"
  | "googledocs"
  | "github"
  | "zendesk"
  | "googleslides"
  | "youtube"
  | "linear"
  | "google";

export type ResolvedIntegration = {
  raw: string;
  id: string;
  known: boolean;
  mark: KnownIntegrationId | "unknown";
  monogram: string;
  labels: Record<ListingLocale, string>;
};

type CatalogEntry = {
  id: KnownIntegrationId;
  aliases: string[];
  labels: Record<ListingLocale, string>;
};

const same = (value: string): Record<ListingLocale, string> => ({
  ko: value,
  en: value,
  ja: value,
  "zh-CN": value,
  "zh-TW": value,
});

const CATALOG: CatalogEntry[] = [
  { id: "gmail", aliases: ["gmail"], labels: same("Gmail") },
  { id: "slack", aliases: ["slack"], labels: same("Slack") },
  {
    id: "googlecalendar",
    aliases: ["googlecalendar", "gcal", "gcalendar"],
    labels: {
      ko: "캘린더",
      en: "Calendar",
      ja: "カレンダー",
      "zh-CN": "日历",
      "zh-TW": "日曆",
    },
  },
  { id: "salesforce", aliases: ["salesforce"], labels: same("Salesforce") },
  { id: "notion", aliases: ["notion"], labels: same("Notion") },
  {
    id: "googledocs",
    aliases: ["googledocs", "gdocs"],
    labels: {
      ko: "문서",
      en: "Docs",
      ja: "ドキュメント",
      "zh-CN": "文档",
      "zh-TW": "文件",
    },
  },
  { id: "github", aliases: ["github"], labels: same("GitHub") },
  { id: "zendesk", aliases: ["zendesk"], labels: same("Zendesk") },
  {
    id: "googleslides",
    aliases: ["googleslides", "gslides"],
    labels: {
      ko: "슬라이드",
      en: "Slides",
      ja: "スライド",
      "zh-CN": "幻灯片",
      "zh-TW": "簡報",
    },
  },
  { id: "youtube", aliases: ["youtube"], labels: same("YouTube") },
  { id: "linear", aliases: ["linear"], labels: same("Linear") },
  { id: "google", aliases: ["google"], labels: same("Google") },
];

const BY_ALIAS = new Map<string, CatalogEntry>();
for (const entry of CATALOG) {
  for (const alias of entry.aliases) {
    BY_ALIAS.set(alias, entry);
  }
}

export function integrationKey(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9가-힣]+/g, "");
}

function monogramFrom(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "?";
  return Array.from(trimmed)[0]?.toUpperCase() ?? "?";
}

export function resolveIntegration(raw: string): ResolvedIntegration {
  const key = integrationKey(raw);
  const known = BY_ALIAS.get(key);
  if (known) {
    return {
      raw,
      id: known.id,
      known: true,
      mark: known.id,
      monogram: monogramFrom(known.labels.en),
      labels: known.labels,
    };
  }

  const fallback = raw.trim() || key;
  return {
    raw,
    id: key || raw,
    known: false,
    mark: "unknown",
    monogram: monogramFrom(raw),
    labels: same(fallback),
  };
}

export function integrationLabel(raw: string, locale: ListingLocale) {
  const labels = resolveIntegration(raw).labels;
  return labels[locale] ?? labels.en;
}
