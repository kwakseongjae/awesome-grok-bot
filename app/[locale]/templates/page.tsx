import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { JsonLd } from "@/components/json-ld";
import { TemplatesIndex } from "@/components/templates-index";
import { listPublishedBots } from "@/lib/bots";
import { breadcrumbJsonLd, localePath, pageSeo, templatesJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { templatesIndexShareUrl } from "@/lib/templates";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "templates" });
  return pageSeo({
    locale: appLocale,
    path: "templates",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("templates");
  const bots = await listPublishedBots({ locale: appLocale });
  const shareUrl = templatesIndexShareUrl();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
      <JsonLd
        data={templatesJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "templates") },
        ])}
      />
      <TemplatesIndex listings={bots} locale={appLocale} shareUrl={shareUrl} />
    </div>
  );
}
