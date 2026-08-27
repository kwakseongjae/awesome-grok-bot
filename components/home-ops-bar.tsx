import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { OpsLiveDot } from "@/components/ops-live";

export async function HomeOpsBar() {
  const t = await getTranslations("ops");

  return (
    <aside className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b pb-5">
      <OpsLiveDot label={t("pulseLive")} />
      <p className="min-w-0 flex-1 text-sm leading-6 text-muted-foreground">{t("homeBar")}</p>
      <Link
        href="/ops"
        className="text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {t("homeBarCta")} →
      </Link>
    </aside>
  );
}
