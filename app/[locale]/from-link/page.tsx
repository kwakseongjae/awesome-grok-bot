import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { FromLinkForm } from "@/components/from-link-form";

type Props = {
  params: Promise<{ locale: string }>;
};

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
