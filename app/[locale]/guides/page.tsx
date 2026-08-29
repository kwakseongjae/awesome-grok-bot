import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { GuideCardMedia } from "@/components/guide-card-media";
import { JobCard } from "@/components/job-card";
import { OFFICIAL_GUIDE_CARDS, SITE_GUIDE_CARDS } from "@/lib/guides";
import { breadcrumbJsonLd, localePath, pageSeo, absoluteUrl } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "guides" });
  return pageSeo({
    locale: appLocale,
    path: "guides",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("guides");
  const card = await getTranslations("card");

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("title"),
          description: t("lead"),
          inLanguage: appLocale,
          url: absoluteUrl(localePath(appLocale, "guides")),
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "guides") },
        ])}
      />
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("back")}
      </Link>
      <header className="mt-8 space-y-3">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t("lead")}</p>
      </header>

      <section className="mt-10 space-y-4">
        <div className="space-y-2">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("oursTitle")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("oursLead")}</p>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_GUIDE_CARDS.map((item) => (
            <JobCard
              key={item.href}
              href={item.href}
              title={t(item.titleKey)}
              byline={t("byDirectory")}
              blurb={t(item.blurbKey)}
              name={t(item.titleKey)}
              openLabel={card("open")}
              media={<GuideCardMedia kind={item.media} />}
            />
          ))}
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <div className="space-y-2">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("officialTitle")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("officialLead")}</p>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          {OFFICIAL_GUIDE_CARDS.map((item) => (
            <JobCard
              key={item.href}
              href={item.href}
              title={t(item.titleKey)}
              byline={t("byOfficial")}
              blurb={t(item.blurbKey)}
              name={t(item.titleKey)}
              openLabel={t("openOfficial")}
              external
              media={<GuideCardMedia kind={item.media} />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
