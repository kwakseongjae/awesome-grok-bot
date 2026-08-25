import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { FromLinkForm } from "@/components/from-link-form";
import { pageSeo } from "@/lib/seo";
import { SHOW_ACCOUNT_CHROME } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "fromLink" });
  return pageSeo({
    locale: appLocale,
    path: "from-link",
    title: t("title"),
    description: t("lead"),
    index: SHOW_ACCOUNT_CHROME,
  });
}

export default async function FromLinkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("fromLink");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
      <div className="mt-8">
        <FromLinkForm />
      </div>
    </div>
  );
}
