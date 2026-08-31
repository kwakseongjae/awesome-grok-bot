import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { JsonLd } from "@/components/json-ld";
import { DocView } from "@/components/doc-view";
import { isDocLang, loadDoc, type DocLang } from "@/lib/doc-md";
import { breadcrumbJsonLd, localePath, pageSeo } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

const docLangFor = (locale: string): DocLang => (locale === "ko" ? "ko" : "en");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const lang = docLangFor(appLocale);
  const { meta } = loadDoc(lang);
  return pageSeo({
    locale: appLocale,
    path: "101",
    title: meta.title,
    description:
      lang === "ko"
        ? "Grok Bot 현장 바이블. X 템플릿, Portato, Grok Build, Cursor. Markdown과 PDF로 가져갈 수 있습니다."
        : "Field bible for Grok Bot. X templates, Portato, Grok Build, Cursor. Download as Markdown or PDF.",
  });
}

export default async function BiblePage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("bible");
  const lang = isDocLang(appLocale) ? appLocale : docLangFor(appLocale);
  const { meta } = loadDoc(lang);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: meta.title, path: localePath(appLocale, "101") },
        ])}
      />
      <DocView lang={lang} otherLabel={lang === "en" ? t("otherKo") : t("otherEn")} />
    </div>
  );
}
