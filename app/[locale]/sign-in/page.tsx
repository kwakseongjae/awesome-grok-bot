import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { SignInActions } from "@/components/sign-in-actions";
import { getAuthStatus } from "@/lib/env";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SignInPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("signIn");
  const status = getAuthStatus();

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 text-muted-foreground">{t("lead")}</p>
      <div className="mt-8">
        <SignInActions
          canRunAuth={status.canRunAuth}
          providers={status.providers}
          missing={status.missing}
          callbackPath={`/${locale}`}
        />
      </div>
      <p className="mt-8 text-sm">
        <Link href="/" className="underline underline-offset-4">
          {t("back")}
        </Link>
      </p>
    </div>
  );
}
