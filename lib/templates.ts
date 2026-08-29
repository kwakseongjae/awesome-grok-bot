import { SITE_ORIGIN } from "./site";
import type { BotListing } from "./types";

/** Canonical English share URL for the templates index. */
export const templatesIndexShareUrl = () => `${SITE_ORIGIN}/en/templates`;

/**
 * Pin order on /templates (Hermes/OpenClaw stay a separate featured row).
 * Video Editor is first among listings. Eng Table is the EM team
 * (issue → repro → debug) — no second slug.
 */
export const FEATURED_TEMPLATE_SLUGS = [
  "video-editor",
  "x-top-fans",
  "jess",
  "sanity",
  "eng-table",
  "one-machine",
  "chief-of-staff",
  "sales-outbound",
  "talent-scout",
  "paid-media",
  "expense-manager",
] as const;

/** Home job-kind pills. Video Editor first, then Jess as the EA job. */
export const JOB_KIND_SLUGS = [
  "video-editor",
  "jess",
  "sales-outbound",
  "talent-scout",
  "paid-media",
  "expense-manager",
  "product-perf",
  "bug-desk",
  "customer-keep",
  "chief-of-staff",
] as const;

const uniqueBySlug = (bots: BotListing[]) => {
  const bySlug = new Map<string, BotListing>();
  for (const bot of bots) {
    if (!bySlug.has(bot.slug)) bySlug.set(bot.slug, bot);
  }
  return bySlug;
};

export const featuredSetups = (bots: BotListing[]) => {
  const bySlug = uniqueBySlug(bots);
  const picked = FEATURED_TEMPLATE_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (bot): bot is BotListing => Boolean(bot),
  );
  if (picked.length > 0) return picked;
  return [...bySlug.values()].slice(0, 8);
};

/** Full catalog for /templates: pinned slugs first, then the rest by added_at. */
export const catalogSetups = (bots: BotListing[]) => {
  const bySlug = uniqueBySlug(bots);
  const pinned = featuredSetups(bots);
  const pinnedSet = new Set(pinned.map((bot) => bot.slug));
  const rest = [...bySlug.values()]
    .filter((bot) => !pinnedSet.has(bot.slug))
    .sort((a, b) => {
      const byDate = b.added_at.localeCompare(a.added_at);
      if (byDate !== 0) return byDate;
      return a.name.localeCompare(b.name, "en");
    });
  return [...pinned, ...rest];
};

export const jobKindListings = (bots: BotListing[]) => {
  const bySlug = uniqueBySlug(bots);
  return JOB_KIND_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (bot): bot is BotListing => Boolean(bot),
  );
};
