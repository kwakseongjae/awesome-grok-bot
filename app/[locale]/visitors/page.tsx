import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { VisitorMarkComposer } from "@/components/visitor-mark-composer";
import { VisitorMarkList } from "@/components/visitor-mark-list";
import { VisitorMarkPaste } from "@/components/visitor-mark-paste";
import { breadcrumbJsonLd, localePath, pageSeo, visitorsJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { getVisitorStoreStatus, listVisitorMarks } from "@/lib/visitor-posts";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "visitors" });
  return pageSeo({
    locale: appLocale,
    path: "visitors",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function VisitorsPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("visitors");
  const marks = await listVisitorMarks();
  const store = getVisitorStoreStatus();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={visitorsJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "visitors") },
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
        <p className="text-sm leading-6 text-muted-foreground">{t("lead")}</p>
      </header>
      <div className="mt-8 space-y-8">
        <VisitorMarkPaste />
        <VisitorMarkComposer canWrite={store.canWrite} />
        <VisitorMarkList marks={marks} />
      </div>
    </div>
  );
}
