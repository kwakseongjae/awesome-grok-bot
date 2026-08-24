import type { Metadata } from "next";
import { LOCALES, LOCALE_OG, isAppLocale, type AppLocale } from "@/lib/locales";
import { OG_IMAGE, SHOW_ACCOUNT_CHROME, SITE_NAME, SITE_ORIGIN } from "@/lib/site";

export const SEO_FAQ_KEYS = ["what", "importer", "updates", "inside", "copy", "migrate", "free"] as const;
export const HOW_TO_STEP_KEYS = [
  "access",
  "install",
  "create",
  "setup",
  "task",
  "login",
  "skill",
  "team",
] as const;

export const STATIC_INDEX_PATHS = [
  "",
  "how-to",
  "changelog",
  "install",
  "migrate",
  "migrate/hermes",
  "migrate/openclaw",
  ...(SHOW_ACCOUNT_CHROME ? (["submit", "from-link"] as const) : []),
  "license",
] as const;

export const localePath = (locale: string, path = "") => {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${locale}/${trimmed}` : `/${locale}`;
};

export const absoluteUrl = (path = "") => {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
};

export const llmsPath = (locale?: string, path = "") => {
  if (!locale) return "/llms.txt";
  return `${localePath(locale, path)}/llms.txt`;
};

export const pageLanguages = (path = "") => {
  const languages: Record<string, string> = {
    "x-default": absoluteUrl(localePath("en", path)),
  };
  for (const locale of LOCALES) {
    languages[locale] = absoluteUrl(localePath(locale, path));
  }
  return languages;
};

export const pageSeo = ({
  locale,
  path = "",
  title,
  description,
  index = true,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  index?: boolean;
}): Metadata => {
  const canonical = absoluteUrl(localePath(locale, path));
  const ogLocale = isAppLocale(locale) ? LOCALE_OG[locale] : LOCALE_OG.ko;
  const alternateLocale = LOCALES.filter((item) => item !== locale).map((item) => LOCALE_OG[item]);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: pageLanguages(path),
      types: {
        "text/plain": absoluteUrl(llmsPath(locale, path)),
      },
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale,
      alternateLocale,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
};

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_ORIGIN}/#org`,
      name: SITE_NAME,
      url: SITE_ORIGIN,
      logo: absoluteUrl("/brand/mascot/awesome-mark.png"),
      sameAs: ["https://github.com/kwakseongjae/awesome-grok-bot"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#site`,
      url: SITE_ORIGIN,
      name: SITE_NAME,
      inLanguage: [...LOCALES],
      publisher: { "@id": `${SITE_ORIGIN}/#org` },
    },
  ],
});

export const faqJsonLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
});

export const howToJsonLd = ({
  locale,
  name,
  description,
  steps,
}: {
  locale: string;
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name,
  description,
  inLanguage: locale,
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
});

export const changelogJsonLd = ({
  locale,
  name,
  description,
  dateModified,
  entries,
}: {
  locale: string;
  name: string;
  description: string;
  dateModified: string;
  entries: { id: string; date: string; headline: string; text: string }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  dateModified,
  inLanguage: locale,
  url: absoluteUrl(localePath(locale, "changelog")),
  publisher: { "@id": `${SITE_ORIGIN}/#org` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "TechArticle",
        headline: entry.headline,
        description: entry.text,
        datePublished: entry.date,
        url: `${absoluteUrl(localePath(locale, "changelog"))}#${entry.id}`,
        about: {
          "@type": "SoftwareApplication",
          name: "Grok Bot",
          applicationCategory: "BusinessApplication",
          operatingSystem: "macOS, iOS",
        },
      },
    })),
  },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const listingJsonLd = ({
  name,
  summary,
  url,
  locale,
  plugins,
  author,
}: {
  name: string;
  summary: string;
  url: string;
  locale: AppLocale;
  plugins: string[];
  author: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: name,
  description: summary,
  url,
  inLanguage: locale,
  about: {
    "@type": "SoftwareApplication",
    name: "Grok Bot",
    applicationCategory: "BusinessApplication",
    operatingSystem: "macOS, iOS",
  },
  author: {
    "@type": "Person",
    name: author.replace(/^@/, ""),
  },
  publisher: { "@id": `${SITE_ORIGIN}/#org` },
  keywords: plugins.join(", "),
});
