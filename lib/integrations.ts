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

const CATALOG: CatalogEntry[] = [
  { id: "gmail", aliases: ["gmail"], labels: { ko: "Gmail", en: "Gmail" } },
  { id: "slack", aliases: ["slack"], labels: { ko: "Slack", en: "Slack" } },
  {
    id: "googlecalendar",
    aliases: ["googlecalendar", "gcal", "gcalendar"],
    labels: { ko: "캘린더", en: "Calendar" },
  },
  {
    id: "salesforce",
    aliases: ["salesforce"],
    labels: { ko: "Salesforce", en: "Salesforce" },
  },
  { id: "notion", aliases: ["notion"], labels: { ko: "Notion", en: "Notion" } },
  {
    id: "googledocs",
    aliases: ["googledocs", "gdocs"],
    labels: { ko: "문서", en: "Docs" },
  },
  { id: "github", aliases: ["github"], labels: { ko: "GitHub", en: "GitHub" } },
  { id: "zendesk", aliases: ["zendesk"], labels: { ko: "Zendesk", en: "Zendesk" } },
  {
    id: "googleslides",
    aliases: ["googleslides", "gslides"],
    labels: { ko: "슬라이드", en: "Slides" },
  },
  { id: "youtube", aliases: ["youtube"], labels: { ko: "YouTube", en: "YouTube" } },
  { id: "linear", aliases: ["linear"], labels: { ko: "Linear", en: "Linear" } },
  { id: "google", aliases: ["google"], labels: { ko: "Google", en: "Google" } },
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
    labels: { ko: fallback, en: fallback },
  };
}

export function integrationLabel(raw: string, locale: ListingLocale) {
  return resolveIntegration(raw).labels[locale];
}
