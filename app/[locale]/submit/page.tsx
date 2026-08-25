import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { SubmitForm } from "@/components/submit-form";
import { pageSeo } from "@/lib/seo";
import { SHOW_ACCOUNT_CHROME } from "@/lib/site";
import type { ListingLocale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "submit" });
  return pageSeo({
    locale: appLocale,
    path: "submit",
    title: t("title"),
    description: t("lead"),
    index: SHOW_ACCOUNT_CHROME,
  });
}

export default async function SubmitPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("submit");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
      <div className="mt-8">
        <SubmitForm
          fallback={{ locale: locale as ListingLocale, status: "published", kind: "bot", category: "productivity", team_members: [], integrations: [], name: "", slug: "", summary: "", prompt: "" }}
        />
      </div>
    </div>
  );
}
