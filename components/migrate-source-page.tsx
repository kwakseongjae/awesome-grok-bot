import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MigrateLockup } from "@/components/migrate-lockup";
import { MigrateUpload } from "@/components/migrate-upload";
import type { HandoffSource } from "@/lib/migrate/types";

type Props = {
  source: HandoffSource;
};

export async function MigrateSourcePage({ source }: Props) {
  const t = await getTranslations("migrate");
  const titleKey = source === "hermes" ? "hermesTitle" : "openclawTitle";
  const leadKey = source === "hermes" ? "hermesPageLead" : "openclawPageLead";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href="/migrate"
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("backHub")}
      </Link>
      <div className="mt-8 rounded-lg border bg-card p-5">
        <MigrateLockup source={source} />
      </div>
      <h1 className="mt-8 text-4xl font-semibold tracking-tight">{t(titleKey)}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t(leadKey)}</p>
      <div className="mt-8">
        <MigrateUpload source={source} />
      </div>
    </div>
  );
}
