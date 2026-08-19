import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Directory } from "@/components/directory";
import { HeroHuddle } from "@/components/hero-huddle";
import { HomeMigrate } from "@/components/home-migrate";
import { SetupGuide } from "@/components/setup-guide";
import { parseDirectoryView } from "@/lib/directory-view";
import { listIntegrations, listPublishedBots } from "@/lib/bots";
import { LISTING_FACE_SLUGS } from "@/lib/faces";
import type { ListingLocale } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string | string[] }>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations();
  const bots = await listPublishedBots({ locale: "all" });
  const integrations = await listIntegrations();
  const uiLocale = locale as ListingLocale;
  const huddle = LISTING_FACE_SLUGS.map((slug) => {
    const match =
      bots.find((bot) => bot.slug === slug && bot.locale === uiLocale) ??
      bots.find((bot) => bot.slug === slug);
    return { slug, name: match?.name ?? slug };
  });

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12 sm:py-16">
      <section className="space-y-6 border-b pb-12">
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
      <SetupGuide />
      <HomeMigrate />
      <Directory
        bots={bots}
        integrations={integrations}
        uiLocale={uiLocale}
        view={parseDirectoryView(query.view)}
      />
    </div>
  );
}
