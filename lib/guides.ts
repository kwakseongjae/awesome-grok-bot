import { GROK_BOT } from "@/lib/site";

export type GuideCardMediaKind = "how-to" | "templates" | "hermes" | "openclaw" | "official";

export const SITE_GUIDE_CARDS = [
  {
    href: "/how-to" as const,
    titleKey: "howToTitle" as const,
    blurbKey: "howToBlurb" as const,
    media: "how-to" as const,
  },
  {
    href: "/templates" as const,
    titleKey: "templatesTitle" as const,
    blurbKey: "templatesBlurb" as const,
    media: "templates" as const,
  },
  {
    href: "/migrate/hermes" as const,
    titleKey: "hermesTitle" as const,
    blurbKey: "hermesBlurb" as const,
    media: "hermes" as const,
  },
  {
    href: "/migrate/openclaw" as const,
    titleKey: "openclawTitle" as const,
    blurbKey: "openclawBlurb" as const,
    media: "openclaw" as const,
  },
];

export const OFFICIAL_GUIDE_CARDS = [
  {
    href: GROK_BOT.product,
    titleKey: "productTitle" as const,
    blurbKey: "productBlurb" as const,
    media: "official" as const,
  },
  {
    href: GROK_BOT.guides,
    titleKey: "guidesTitle" as const,
    blurbKey: "guidesBlurb" as const,
    media: "official" as const,
  },
];

export type SiteGuideCard = (typeof SITE_GUIDE_CARDS)[number];
export type OfficialGuideCard = (typeof OFFICIAL_GUIDE_CARDS)[number];
