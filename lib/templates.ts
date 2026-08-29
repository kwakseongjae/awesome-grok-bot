import { LISTING_FACE_SLUGS } from "./faces";
import { localeCollator, type AppLocale } from "./locales";
import { SITE_ORIGIN } from "./site";
import type { BotListing } from "./types";

/** Canonical English share URL for the templates index. */
export const templatesIndexShareUrl = () => `${SITE_ORIGIN}/en/templates`;

/** Featured “how we run this” guide — One Machine copy landed 2026-08-28. */
export const FEATURED_GUIDE_AT = "2026-08-28T12:00:00.000Z";

/** Shareable Hermes / OpenClaw migrate templates (#44). */
export const MIGRATE_TEMPLATE_AT = "2026-08-29T12:00:00.000Z";

export const PRIMARY_TEMPLATE_SLUGS = [
  "inbox-chief",
  "gtm-table",
  "launch-desk",
  "ops-pulse",
] as const;

export const TEMPLATE_LISTING_SLUGS = [
  ...PRIMARY_TEMPLATE_SLUGS,
  "one-machine",
  "customer-keep",
  "life-admin",
  "research-scout",
  "content-crew",
] as const;

export type GrainTone = "dusk" | "ember" | "ash" | "signal" | "tide" | "clay" | "pine" | "night";
export type GrainInk = "light" | "dark";

const NAMED_TONES: Record<string, GrainTone> = {
  "inbox-chief": "ash",
  "gtm-table": "ember",
  "launch-desk": "signal",
  "ops-pulse": "tide",
  "one-machine": "night",
  "customer-keep": "clay",
  "life-admin": "ash",
  "research-scout": "signal",
  "content-crew": "ember",
  hermes: "clay",
  openclaw: "pine",
};

const FALLBACK_TONES: GrainTone[] = ["dusk", "ember", "ash", "signal", "tide", "clay", "pine", "night"];

export const grainInk = (tone: GrainTone): GrainInk => (tone === "ash" ? "light" : "dark");

export const grainToneForSlug = (slug: string): GrainTone => {
  const named = NAMED_TONES[slug];
  if (named) return named;
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return FALLBACK_TONES[hash % FALLBACK_TONES.length] ?? "night";
};

export const grainSeed = (slug: string) => {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % 360;
};

export const formatGuideDate = (iso: string, locale: AppLocale) =>
  new Intl.DateTimeFormat(localeCollator(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Seoul",
  }).format(new Date(iso));

export const pickListingsBySlug = (bots: BotListing[], slugs: readonly string[]) => {
  const bySlug = new Map<string, BotListing>();
  for (const bot of bots) {
    if (!bySlug.has(bot.slug)) bySlug.set(bot.slug, bot);
  }
  return slugs.map((slug) => bySlug.get(slug)).filter((bot): bot is BotListing => Boolean(bot));
};

export const featuredSetups = (bots: BotListing[]) => {
  const picked = pickListingsBySlug(bots, TEMPLATE_LISTING_SLUGS);
  if (picked.length > 0) return picked;
  const huddle = pickListingsBySlug(bots, LISTING_FACE_SLUGS);
  if (huddle.length > 0) return huddle;
  const seen = new Set<string>();
  const fallback: BotListing[] = [];
  for (const bot of bots) {
    if (seen.has(bot.slug)) continue;
    seen.add(bot.slug);
    fallback.push(bot);
    if (fallback.length >= 8) break;
  }
  return fallback;
};
