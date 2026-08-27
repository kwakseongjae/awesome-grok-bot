import type { MetadataRoute } from "next";
import { listPublishedBots } from "@/lib/bots";
import { SITE_UPDATED_AT } from "@/lib/changelog";
import { LOCALES } from "@/lib/locales";
import { OPS_UPDATED_AT } from "@/lib/ops";
import { PLAY_UPDATED_AT } from "@/lib/community-types";
import { SCORE_DATE } from "@/lib/scores";
import { absoluteUrl, localePath, pageLanguages, STATIC_INDEX_PATHS } from "@/lib/seo";
import { SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bots = await listPublishedBots();
  const slugs = [...new Set(bots.map((bot) => bot.slug))];
  const now = new Date();

  const pages: MetadataRoute.Sitemap = STATIC_INDEX_PATHS.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified:
        path === "changelog"
          ? new Date(SITE_UPDATED_AT)
          : path === "rank"
            ? new Date(SCORE_DATE)
            : path === "play"
              ? new Date(PLAY_UPDATED_AT)
            : path === "ops" || path.startsWith("ops/")
            ? new Date(OPS_UPDATED_AT)
            : now,
      changeFrequency: path === "" || path === "ops" ? "daily" : "weekly",
      priority: path === "" ? 1 : path.startsWith("migrate/") || path === "ops" || path.startsWith("ops/") ? 0.8 : 0.7,
      alternates: { languages: pageLanguages(path) },
    })),
  );

  const listings: MetadataRoute.Sitemap = slugs.flatMap((slug) => {
    const path = `bots/${slug}`;
    const added = bots.find((bot) => bot.slug === slug)?.added_at;
    return LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: added ? new Date(added) : now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: { languages: pageLanguages(path) },
    }));
  });

  return [
    {
      url: `${SITE_ORIGIN}/llms.txt`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${SITE_ORIGIN}/llms-full.txt`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.4,
    },
    ...pages,
    ...listings,
  ];
}
