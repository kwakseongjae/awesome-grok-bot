import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MigrateUpload } from "@/components/migrate-upload";
import { MigrateWall } from "@/components/migrate-wall";
import { getAuthStatus } from "@/lib/env";
import { getServerSession } from "@/lib/session";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HermesMigratePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("migrate");
  const session = await getServerSession();
  const status = getAuthStatus();
  const signedIn = Boolean(session?.user);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/migrate" className="text-sm text-muted-foreground hover:text-foreground">
        ← {t("backHub")}
      </Link>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight">{t("hermesTitle")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("hermesPageLead")}</p>
      {!signedIn ? (
        <MigrateWall
          canRunAuth={status.canRunAuth}
          providers={status.providers}
          missing={status.missing}
          callbackPath={`/${locale}/migrate/hermes`}
        />
      ) : (
        <div className="mt-8">
          <MigrateUpload source="hermes" canSave={status.canPersistListings} />
        </div>
      )}
    </div>
  );
}
