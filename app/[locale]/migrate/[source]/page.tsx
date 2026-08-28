import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MigrateDesk } from "@/components/migrate-desk";
import { MigrateLockup } from "@/components/migrate-lockup";
import { HANDOFF_SOURCES, isHandoffSource } from "@/lib/migrate/source";
import { breadcrumbJsonLd, localePath, pageSeo } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

type Props = {
  params: Promise<{ locale: string; source: string }>;
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return HANDOFF_SOURCES.map((source) => ({ source }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, source } = await params;
  if (!isHandoffSource(source)) return {};
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "migrate" });
  return pageSeo({
    locale: appLocale,
    path: `migrate/${source}`,
    title: source === "hermes" ? t("hermesTitle") : t("openclawTitle"),
    description: source === "hermes" ? t("hermesPageLead") : t("openclawPageLead"),
  });
}

export default async function MigrateSourcePage({ params }: Props) {
  const { locale, source } = await params;
  setRequestLocale(toAppLocale(locale));
  if (!isHandoffSource(source)) notFound();
  const t = await getTranslations("migrate");
  const titleKey = source === "hermes" ? "hermesTitle" : "openclawTitle";
  const appLocale = toAppLocale(locale);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("hubTitle"), path: localePath(appLocale, "migrate") },
          { name: t(titleKey), path: localePath(appLocale, `migrate/${source}`) },
        ])}
      />
      <Link
        href="/migrate"
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("backHub")}
      </Link>
      <div className="mt-8 rounded-lg border bg-card p-5">
        <MigrateLockup source={source} />
      </div>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">{t(titleKey)}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("desk.pageLead")}</p>
      <div className="mt-8">
        <MigrateDesk source={source} />
      </div>
    </div>
  );
}
