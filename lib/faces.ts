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

/** Official marks vendored locally. Do not hotlink or recolor. */
export const MIGRATE_MARKS = {
  hermes: "/brand/migrate/hermes-icon.png",
  openclaw: "/brand/migrate/openclaw.svg",
  grokLight: "/brand/migrate/Grok_Logomark_Light.svg",
  grokDark: "/brand/migrate/Grok_Logomark_Dark.svg",
} as const;

