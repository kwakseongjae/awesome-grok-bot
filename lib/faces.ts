export const LISTING_FACE_SLUGS = [
  "inbox-chief",
  "gtm-table",
  "launch-desk",
  "ops-pulse",
  "customer-keep",
  "life-admin",
  "research-scout",
  "content-crew",
] as const;

export type ListingFaceSlug = (typeof LISTING_FACE_SLUGS)[number];

export const BRAND = {
  mascot: "/brand/mascot-hero.png",
  lockup: "/brand/logo-lockup.png",
  mark: "/brand/favicon-mark.png",
} as const;

const FACE_SLUG_SET = new Set<string>(LISTING_FACE_SLUGS);

export function listingFaceSrc(slug: string) {
  if (FACE_SLUG_SET.has(slug)) {
    return `/brand/faces/${slug}.png`;
  }
  return BRAND.mark;
}

export function isListingFaceSlug(slug: string): slug is ListingFaceSlug {
  return FACE_SLUG_SET.has(slug);
}
