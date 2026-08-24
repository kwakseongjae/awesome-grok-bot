import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { JsonLd } from "@/components/json-ld";
import { MigrateHub } from "@/components/migrate-hub";
import { breadcrumbJsonLd, localePath, pageSeo } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "migrate" });
  return pageSeo({ locale: appLocale, path: "migrate", title: t("hubTitle"), description: t("hubLead") });
}

export default async function MigrateHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("migrate");
  const appLocale = toAppLocale(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("hubTitle"), path: localePath(appLocale, "migrate") },
        ])}
      />
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("hubTitle")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("hubLead")}</p>
      <div className="mt-8">
        <MigrateHub />
      </div>
    </div>
  );
}
