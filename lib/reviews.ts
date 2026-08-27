export const USED_SETUP_EVENT = "agb:setup-used";
export const REVIEW_ADDED_EVENT = "agb:review-added";

export const REVIEW_SCORE_MIN = 1;
export const REVIEW_SCORE_MAX = 10;
export const REVIEW_WHO_MAX = 40;
export const REVIEW_TAKE_MAX = 140;

export const usedSetupKey = (slug: string) => `agb:used:${slug}`;

export const listingNameFor = (
  slug: string,
  names: Record<string, string>,
  fallback = slug,
) => names[slug] ?? fallback;
