import { LISTING_FACE_SLUGS } from "./faces";
import { SITE_ORIGIN } from "./site";
import type { BotListing } from "./types";

/** Canonical English share URL for the templates index. */
export const templatesIndexShareUrl = () => `${SITE_ORIGIN}/en/templates`;

export const featuredSetups = (bots: BotListing[]) => {
  const bySlug = new Map<string, BotListing>();
  for (const bot of bots) {
    if (!bySlug.has(bot.slug)) bySlug.set(bot.slug, bot);
  }
  const picked = LISTING_FACE_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (bot): bot is BotListing => Boolean(bot),
  );
  if (picked.length > 0) return picked;
  return [...bySlug.values()].slice(0, 8);
};
