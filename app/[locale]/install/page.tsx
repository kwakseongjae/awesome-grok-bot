import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { JsonLd } from "@/components/json-ld";
import { toAppLocale } from "@/i18n/routing";
import { INSTALL_TOOLS } from "@/lib/install";
import { breadcrumbJsonLd, howToJsonLd, localePath, pageSeo } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "install" });
  return pageSeo({ locale: appLocale, path: "install", title: t("title"), description: t("lead") });
}

export default async function InstallPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("install");
  const bot = await getTranslations("bot");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={howToJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
          steps: INSTALL_TOOLS.map((tool) => ({
            name: tool.name,
            text: t(`tools.${tool.summaryKey}`),
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "install") },
        ])}
      />
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{t("note")}</p>

      <div className="mt-10 space-y-12">
        {INSTALL_TOOLS.map((tool) => (
          <section key={tool.id} id={tool.id} className="scroll-mt-20 space-y-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{tool.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(`tools.${tool.summaryKey}`)}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex justify-end">
                <CopyButton
                  text={tool.starter}
                  label={bot("copy")}
                  copiedLabel={bot("copied")}
                  ariaLabel={`${bot("copy")}: ${tool.name}`}
                  copyKind="install"
                  size="sm"
                />
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
                {tool.starter}
              </pre>
            </div>
            {tool.docs ? (
              <a
                href={tool.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {t("officialDocs", { tool: tool.name })} ↗
              </a>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
