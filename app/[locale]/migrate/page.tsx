import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MigrateWall } from "@/components/migrate-wall";
import { getAuthStatus } from "@/lib/env";
import { getServerSession } from "@/lib/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MigrateHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("migrate");
  const session = await getServerSession();
  const status = getAuthStatus();
  const signedIn = Boolean(session?.user);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("hubTitle")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("hubLead")}</p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        <li>{t("ruleMemory")}</li>
        <li>{t("ruleRoutines")}</li>
        <li>{t("ruleSecrets")}</li>
      </ul>

      {!signedIn ? (
        <MigrateWall
          canRunAuth={status.canRunAuth}
          providers={status.providers}
          missing={status.missing}
          callbackPath={`/${locale}/migrate`}
        />
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Link
            href="/migrate/hermes"
            className="rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <h2 className="font-semibold">{t("hermesTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("hermesLead")}</p>
          </Link>
          <Link
            href="/migrate/openclaw"
            className="rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <h2 className="font-semibold">{t("openclawTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("openclawLead")}</p>
          </Link>
        </div>
      )}
    </div>
  );
}
