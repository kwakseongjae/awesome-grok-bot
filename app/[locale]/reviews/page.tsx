import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { SetupBotReviewList } from "@/components/setup-bot-review-list";
import { listPublishedBots } from "@/lib/bots";
import { rankingRows } from "@/lib/scores";
import { breadcrumbJsonLd, localePath, pageSeo, reviewsJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { listAllSetupBotReviews } from "@/lib/visitor-posts";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "reviews" });
  return pageSeo({
    locale: appLocale,
    path: "reviews",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("reviews");
  const bots = await listPublishedBots({ locale: appLocale });
  const reviews = await listAllSetupBotReviews();
  const listingNames = Object.fromEntries(bots.map((bot) => [bot.slug, bot.name]));
  const rows = rankingRows(bots);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={reviewsJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "reviews") },
        ])}
      />
      <Link
        href="/"
        className="cursor-pointer text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("back")}
      </Link>
      <header className="mt-8 space-y-3">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{t("lead")}</p>
        <p className="text-sm leading-6 text-muted-foreground">{t("leaveOnListing")}</p>
      </header>
      <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {rows.map((row) => (
          <Link
            key={row.slug}
            href={`/bots/${row.slug}#reviews`}
            className="cursor-pointer underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {row.name}
          </Link>
        ))}
      </p>
      <div className="mt-8">
        <SetupBotReviewList reviews={reviews} listingNames={listingNames} />
      </div>
    </div>
  );
}
