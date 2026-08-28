import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { MigrateConsole } from "@/components/migrate-console";
import { MigrateLockup } from "@/components/migrate-lockup";
import { PHASE_IDS, parsePhaseParam } from "@/lib/migrate/playbook";
import { HANDOFF_SOURCES, isHandoffSource } from "@/lib/migrate/source";
import { pageSeo } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  return HANDOFF_SOURCES.flatMap((source) =>
    PHASE_IDS.map((phase) => ({ source, phase: String(phase) })),
  );
}

type Props = {
  params: Promise<{ locale: string; source: string; phase: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, source, phase } = await params;
  if (!isHandoffSource(source)) return {};
  const phaseId = parsePhaseParam(phase);
  if (phaseId === null) return {};
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "migrate" });
  return pageSeo({
    locale: appLocale,
    path: `migrate/${source}/${phase}`,
    title: `${t(`playbook.phases.${phaseId}.title`)} · ${source === "hermes" ? "Hermes" : "OpenClaw"}`,
    description: t(source === "hermes" ? "hermesPageLead" : "openclawPageLead"),
    index: false,
  });
}

export default async function MigratePhasePage({ params }: Props) {
  const { locale, source, phase } = await params;
  setRequestLocale(toAppLocale(locale));
  if (!isHandoffSource(source)) notFound();
  const phaseId = parsePhaseParam(phase);
  if (phaseId === null) notFound();
  const t = await getTranslations("migrate");

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
      <div className="mt-8">
        <MigrateConsole source={source} phase={phaseId} />
      </div>
    </div>
  );
}
