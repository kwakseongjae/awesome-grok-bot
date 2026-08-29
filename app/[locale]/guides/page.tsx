import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { GuideCardMedia } from "@/components/guide-card-media";
import { GuideFeatured } from "@/components/guide-featured";
import { GuideTile, guideTileGridClass } from "@/components/guide-tile";
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

  const [featured, ...restSite] = SITE_GUIDE_CARDS;

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

      <div className="mt-10">
        <GuideFeatured
          href={featured.href}
          kicker={t("byDirectory")}
          title={t(featured.titleKey)}
          dek={t(featured.blurbKey)}
          cta={card("readMore")}
          name={t(featured.titleKey)}
          heading="h1"
          tone="violet"
          media={<GuideCardMedia kind={featured.media} />}
        />
      </div>

      <div className={`mt-16 ${guideTileGridClass}`}>
        {restSite.map((item) => (
          <GuideTile
            key={item.href}
            href={item.href}
            title={t(item.titleKey)}
            kicker={t("byDirectory")}
            name={t(item.titleKey)}
            tone={item.media === "hermes" ? "bleu" : item.media === "openclaw" ? "turquoise" : "bleu"}
            media={<GuideCardMedia kind={item.media} />}
          />
        ))}
        {OFFICIAL_GUIDE_CARDS.map((item) => (
          <GuideTile
            key={item.href}
            href={item.href}
            title={t(item.titleKey)}
            kicker={t("byOfficial")}
            name={t(item.titleKey)}
            external
            tone="gris"
            media={<GuideCardMedia kind={item.media} />}
          />
        ))}
      </div>
    </div>
  );
}
