import { listPublishedBots } from "@/lib/bots";
import type { ReviewKind, SetupReview } from "@/lib/community-types";
import {
  REVIEW_SCORE_MAX,
  REVIEW_SCORE_MIN,
  REVIEW_TAKE_MAX,
  REVIEW_WHO_MAX,
} from "@/lib/reviews";
import { oneLine, todayStamp } from "@/lib/text-line";

export const isReviewKind = (value: unknown): value is ReviewKind =>
  value === "bot" || value === "human";

export const parseScore = (value: unknown) => {
  const score = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(score) || score < REVIEW_SCORE_MIN || score > REVIEW_SCORE_MAX) {
    return null;
  }
  return score;
};

export const publishedSlugSet = async () => {
  const bots = await listPublishedBots({ locale: "all" });
  return new Set(bots.map((bot) => bot.slug));
};

export const listingNames = (bots: { slug: string; name: string }[]) =>
  Object.fromEntries(bots.map((bot) => [bot.slug, bot.name]));

export const buildSetupReview = async (input: {
  listingSlug: unknown;
  score: unknown;
  take: unknown;
  who: unknown;
  kind: unknown;
}): Promise<{ ok: true; review: SetupReview } | { ok: false; error: string }> => {
  const listingSlug = oneLine(input.listingSlug, 80);
  const who = oneLine(input.who, REVIEW_WHO_MAX);
  const take = oneLine(input.take, REVIEW_TAKE_MAX);
  const score = parseScore(input.score);
  if (!listingSlug || !who || !take || score === null || !isReviewKind(input.kind)) {
    return { ok: false, error: "invalid" };
  }
  const slugs = await publishedSlugSet();
  if (!slugs.has(listingSlug)) {
    return { ok: false, error: "listing" };
  }
  return {
    ok: true,
    review: {
      id: crypto.randomUUID(),
      listingSlug,
      score,
      take,
      who,
      kind: input.kind,
      date: todayStamp(),
    },
  };
};
