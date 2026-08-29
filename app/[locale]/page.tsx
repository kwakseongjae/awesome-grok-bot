import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { CatalogRank } from "@/components/catalog-rank";
import { Directory } from "@/components/directory";
import { HeroHuddle } from "@/components/hero-huddle";
import { HomeChangelog } from "@/components/home-changelog";
import { HomeInstall } from "@/components/home-install";
import { HomeOpsBar } from "@/components/home-ops-bar";
import { HomeReading } from "@/components/home-reading";
import { HomeVisitorWall } from "@/components/home-visitor-wall";
import { SiteFaq } from "@/components/site-faq";
import { TemplatesIndex } from "@/components/templates-index";
import { parseDirectoryCategory, parseDirectoryView } from "@/lib/directory-view";
import { listIntegrations, listPublishedBots } from "@/lib/bots";
import { LISTING_FACE_SLUGS } from "@/lib/faces";
import { rankingRows } from "@/lib/scores";
import { pageSeo } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { templatesIndexShareUrl } from "@/lib/templates";
import { getVisitorStoreStatus, listVisitorMarks } from "@/lib/visitor-posts";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string | string[]; category?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "home" });
  return {
    ...pageSeo({ locale: appLocale, title: SITE_NAME, description: t("lead") }),
    title: { absolute: SITE_NAME },
  };
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations();
  const uiLocale = toAppLocale(locale);
  const [bots, integrations, marks] = await Promise.all([
    listPublishedBots({ locale: uiLocale }),
    listIntegrations(),
    listVisitorMarks(),
  ]);
  const store = getVisitorStoreStatus();
  const huddle = LISTING_FACE_SLUGS.map((slug) => {
    const match =
      bots.find((bot) => bot.slug === slug && bot.locale === uiLocale) ??
      bots.find((bot) => bot.slug === slug);
    return { slug, name: match?.name ?? slug };
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12 sm:py-16">
      <HomeOpsBar />
      <section className="space-y-6 overflow-x-clip border-b pb-12">
        <HeroHuddle listings={huddle} />
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("home.eyebrow")}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("home.title")}
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            {t("home.lead")}
          </p>
        </div>
      </section>
      <TemplatesIndex
        listings={bots}
        locale={uiLocale}
        shareUrl={templatesIndexShareUrl()}
        featuredTitleAs="h2"
        compact
      />
      <HomeVisitorWall marks={marks} canWrite={store.canWrite} />
      <HomeChangelog />
      <HomeInstall />
      <HomeReading />
      <CatalogRank rows={rankingRows(bots)} />
      <Directory
        bots={bots}
        integrations={integrations}
        view={parseDirectoryView(query.view)}
        category={parseDirectoryCategory(query.category)}
      />
      <SiteFaq />
    </div>
  );
}
