import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CatalogRank } from "@/components/catalog-rank";
import { JsonLd } from "@/components/json-ld";
import { listPublishedBots } from "@/lib/bots";
import { rankingRows, SCORE_DATE, SCORE_DISCLAIMER } from "@/lib/scores";
import { breadcrumbJsonLd, localePath, pageSeo, rankingJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "rank" });
  return pageSeo({
    locale: appLocale,
    path: "rank",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function RankPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("rank");
  const bots = await listPublishedBots({ locale: appLocale });
  const rows = rankingRows(bots);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={rankingJsonLd({
          locale: appLocale,
          name: t("title"),
          description: `${t("lead")} ${SCORE_DISCLAIMER}`,
          datePublished: SCORE_DATE,
          items: rows.map((row) => ({
            position: row.rank,
            name: row.name,
            description: row.why,
            path: localePath(appLocale, `bots/${row.slug}`),
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "rank") },
        ])}
      />
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("back")}
      </Link>
      <div className="mt-8">
        <CatalogRank rows={rows} variant="page" />
      </div>
    </div>
  );
}
