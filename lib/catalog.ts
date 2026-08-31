import { CATALOG } from "@/data/catalog";
import { SHARE_URLS } from "@/data/share-urls";
import type { CatalogItem } from "@/lib/catalog-define";
import { LOCALES, type AppLocale } from "@/lib/locales";
import type { BotListing } from "@/lib/types";

export type { CatalogItem };

const LOCALE_N: Record<AppLocale, number> = {
  ko: 1,
  en: 2,
  ja: 3,
  "zh-CN": 4,
  "zh-TW": 5,
};

export const listingId = (index: number, locale: AppLocale) =>
  `a1c0ffee-${index.toString(16).padStart(4, "0")}-4000-8000-${LOCALE_N[locale]
    .toString()
    .padStart(12, "0")}`;

/** Stable, non-zero display count so the directory does not look empty. */
export const seededInstalls = (slug: string) => {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return 18 + ((h >>> 0) % 211);
};

export const expandCatalog = (): BotListing[] => {
  const rows: BotListing[] = [];
  for (const item of CATALOG) {
    for (const locale of LOCALES) {
      const promptLocale: "ko" | "en" = locale === "ko" ? "ko" : "en";
      rows.push({
        id: listingId(item.index, locale),
        slug: item.slug,
        name: item.names[locale],
        kind: item.kind,
        category: item.category,
        locale,
        summary: item.summaries[locale],
        prompt: item.prompts[promptLocale],
        integrations: item.integrations,
        source_url: item.source_url,
        share_url: SHARE_URLS[item.slug] ?? item.share_url ?? null,
        contributor_handle: "kwak",
        status: "published",
        created_by: null,
        added_at: item.added_at,
        copy_count: seededInstalls(item.slug),
        team_members: item.members?.[locale] ?? item.members?.en ?? item.members?.ko ?? [],
      });
    }
  }
  return rows;
};
