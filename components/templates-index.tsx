import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GuideCard, GuideHero } from "@/components/guide-card";
import { ShareButton } from "@/components/share-button";
import { toAppLocale } from "@/i18n/routing";
import { templateShareUrl } from "@/lib/migrate/skill-md";
import {
  FEATURED_GUIDE_AT,
  MIGRATE_TEMPLATE_AT,
  PRIMARY_TEMPLATE_SLUGS,
  featuredSetups,
  formatGuideDate,
  grainSeed,
  grainToneForSlug,
  pickListingsBySlug,
} from "@/lib/templates";
import type { BotListing } from "@/lib/types";

type Props = {
  listings: BotListing[];
  locale: string;
  shareUrl: string;
  /** Home keeps the site h1; templates page uses the featured title as h1. */
  featuredTitleAs?: "h1" | "h2";
  compact?: boolean;
};

export async function TemplatesIndex({
  listings,
  locale,
  shareUrl,
  featuredTitleAs = "h1",
  compact = false,
}: Props) {
  const appLocale = toAppLocale(locale);
  const t = await getTranslations("templates");
  const migrate = await getTranslations("migrate.home");
  const bot = await getTranslations("bot");
  const featuredDate = formatGuideDate(FEATURED_GUIDE_AT, appLocale);
  const migrateDate = formatGuideDate(MIGRATE_TEMPLATE_AT, appLocale);
  const cards = compact ? pickListingsBySlug(listings, PRIMARY_TEMPLATE_SLUGS) : featuredSetups(listings);
  const migrateCards = [
    { source: "hermes" as const, title: migrate("hermes"), href: "/migrate/hermes" as const, tone: grainToneForSlug("hermes") },
    { source: "openclaw" as const, title: migrate("openclaw"), href: "/migrate/openclaw" as const, tone: grainToneForSlug("openclaw") },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      <GuideHero
        href="/how-to"
        title={t("featuredTitle")}
        lead={t("featuredLead")}
        date={featuredDate}
        tone="dusk"
        seed={grainSeed("how-we-run")}
        readMore={t("readMore")}
        titleAs={featuredTitleAs}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <GuideCard
            key={item.id}
            href={`/bots/${item.slug}`}
            title={item.name}
            date={formatGuideDate(item.added_at, appLocale)}
            tone={grainToneForSlug(item.slug)}
            seed={grainSeed(item.slug)}
          />
        ))}
        {migrateCards.map((item) => (
          <GuideCard
            key={item.source}
            href={item.href}
            title={item.title}
            date={migrateDate}
            tone={item.tone}
            seed={grainSeed(item.source)}
          />
        ))}
      </div>

      {compact ? (
        <p className="text-sm">
          <Link
            href="/templates"
            className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("allTemplates")}
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ShareButton title={t("title")} url={shareUrl} />
          </div>
          <ul className="space-y-1 font-mono text-xs tracking-tight text-muted-foreground">
            <li>
              <span className="sr-only">{bot("share")}: </span>
              <a
                href={shareUrl}
                className="cursor-pointer underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {shareUrl}
              </a>
            </li>
            {migrateCards.map((item) => (
              <li key={item.source}>
                <a
                  href={templateShareUrl(item.source)}
                  className="cursor-pointer underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {templateShareUrl(item.source)}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm">
            <Link
              href="/"
              className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("directory")}
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
