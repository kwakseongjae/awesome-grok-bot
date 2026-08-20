import type { MetadataRoute } from "next";
import { listPublishedBots } from "@/lib/bots";
import { getAppUrl } from "@/lib/env";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const STATIC_PATHS = [
  "",
  "/from-link",
  "/migrate",
  "/migrate/hermes",
  "/migrate/openclaw",
  "/submit",
] as const;

function languageAlternates(path: string) {
  return {
    ko: `${getAppUrl()}/ko${path}`,
    en: `${getAppUrl()}/en${path}`,
    "x-default": `${getAppUrl()}/ko${path}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getAppUrl();
  const listings = await listPublishedBots({ locale: "all" });
  const seen = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${origin}/${locale}${path}`,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  for (const listing of listings) {
    const path = `/bots/${listing.slug}`;
    const key = `${listing.locale}:${listing.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({
      url: `${origin}/${listing.locale}${path}`,
      lastModified: listing.added_at,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languageAlternates(path) },
    });
  }

  return entries;
}
