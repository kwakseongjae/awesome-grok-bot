import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SignInActions } from "@/components/sign-in-actions";
import { pageSeo } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "signIn" });
  return pageSeo({
    locale: appLocale,
    path: "sign-in",
    title: t("title"),
    description: t("lead"),
    index: false,
  });
}

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("signIn");

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("lead")}</p>
      <div className="mt-8">
        <SignInActions callbackPath={`/${locale}`} />
      </div>
      <p className="mt-8 text-sm">
        <Link href="/" className="underline underline-offset-4">
          {t("back")}
        </Link>
      </p>
    </div>
  );
}
