import { listPublishedBots } from "@/lib/bots";
import { LOCALES } from "@/lib/locales";
import { absoluteUrl, localePath, STATIC_INDEX_PATHS } from "@/lib/seo";
import { SITE_ORIGIN } from "@/lib/site";

export const listPublicUrls = async () => {
  const bots = await listPublishedBots();
  const slugs = [...new Set(bots.map((bot) => bot.slug))];
  const urls = [`${SITE_ORIGIN}/llms.txt`, `${SITE_ORIGIN}/llms-full.txt`];

  for (const path of STATIC_INDEX_PATHS) {
    for (const locale of LOCALES) {
      urls.push(absoluteUrl(localePath(locale, path)));
    }
  }

  for (const slug of slugs) {
    for (const locale of LOCALES) {
      urls.push(absoluteUrl(localePath(locale, `bots/${slug}`)));
    }
  }

  return urls;
};
