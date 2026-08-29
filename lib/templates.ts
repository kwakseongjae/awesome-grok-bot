import { SITE_ORIGIN } from "./site";
import type { BotListing } from "./types";

/** Canonical English share URL for the templates index. */
export const templatesIndexShareUrl = () => `${SITE_ORIGIN}/en/templates`;

/**
 * Share-hub job cards. Hermes/OpenClaw stay a separate featured row.
 * Video Editor is first among listings. Jess EA, Sanity, and EM team follow
 * Fans Weekly. One Machine stays in the grid.
 */
export const FEATURED_TEMPLATE_SLUGS = [
  "video-editor",
  "x-top-fans",
  "jess-ea",
  "sanity",
  "em-team",
  "sales-outbound",
  "talent-scout",
  "paid-media",
  "expense-manager",
  "chief-of-staff",
  "one-machine",
] as const;

/** Home job-kind pills. Official roles we already list, plus Video Editor first. */
export const JOB_KIND_SLUGS = [
  "video-editor",
  "sales-outbound",
  "talent-scout",
  "paid-media",
  "expense-manager",
  "product-perf",
  "bug-desk",
  "customer-keep",
  "chief-of-staff",
] as const;

export const featuredSetups = (bots: BotListing[]) => {
  const bySlug = new Map<string, BotListing>();
  for (const bot of bots) {
    if (!bySlug.has(bot.slug)) bySlug.set(bot.slug, bot);
  }
  const picked = FEATURED_TEMPLATE_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (bot): bot is BotListing => Boolean(bot),
  );
  if (picked.length > 0) return picked;
  return [...bySlug.values()].slice(0, 8);
};

export const jobKindListings = (bots: BotListing[]) => {
  const bySlug = new Map<string, BotListing>();
  for (const bot of bots) {
    if (!bySlug.has(bot.slug)) bySlug.set(bot.slug, bot);
  }
  return JOB_KIND_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (bot): bot is BotListing => Boolean(bot),
  );
};
