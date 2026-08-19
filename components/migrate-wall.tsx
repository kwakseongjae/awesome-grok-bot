import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SignInActions } from "@/components/sign-in-actions";

type Props = {
  canRunAuth: boolean;
  providers: string[];
  missing: string[];
  callbackPath: string;
};

export async function MigrateWall({ canRunAuth, providers, missing, callbackPath }: Props) {
  const t = await getTranslations("migrate");

  return (
    <div className="mt-8 space-y-6 rounded-lg border bg-card p-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold tracking-tight">{t("wallTitle")}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{t("wallLead")}</p>
      </div>
      {!canRunAuth ? (
        <p className="text-sm text-muted-foreground">{t("demoWall")}</p>
      ) : null}
      <SignInActions
        canRunAuth={canRunAuth}
        providers={providers}
        missing={missing}
        callbackPath={callbackPath}
      />
      <p className="text-sm">
        <Link href="/sign-in" className="underline underline-offset-4">
          {t("toSignIn")}
        </Link>
      </p>
    </div>
  );
}
