import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/json-ld";
import { TemplatesBrowser } from "@/components/templates-browser";
import { breadcrumbJsonLd, localePath, pageSeo } from "@/lib/seo";
import { GROK_BOT, SITE_NAME } from "@/lib/site";
import { X_TEMPLATES } from "@/lib/templates";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "templates" });
  return pageSeo({ locale: appLocale, path: "templates", title: t("title"), description: t("lead") });
}

export default async function TemplatesPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("templates");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "templates") },
        ])}
      />
      <header className="space-y-3">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="max-w-2xl text-muted-foreground">{t("lead")}</p>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("mint")}</p>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("safety")}</p>
        <ul className="flex flex-col gap-1.5 text-sm">
          <li>
            <a
              href={GROK_BOT.bots}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("docsShare")}
            </a>
          </li>
          <li>
            <a
              href={GROK_BOT.shareTerms}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("docsTerms")}
            </a>
          </li>
        </ul>
      </header>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("xTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("xLead")}</p>
        </div>
        <TemplatesBrowser items={X_TEMPLATES} />
      </section>

      <p className="text-sm text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50">
          {t("allListings")}
        </Link>
      </p>
    </div>
  );
}
