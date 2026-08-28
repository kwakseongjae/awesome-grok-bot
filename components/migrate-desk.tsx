import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { MigrateLockup } from "@/components/migrate-lockup";
import { HANDOFF_SOURCES, sourceLabel } from "@/lib/migrate/source";
import type { HandoffSource } from "@/lib/migrate/types";

type Props = {
  source: HandoffSource;
  starter: string;
};

const AFTER_KEYS = ["afterSkill", "afterGold", "afterGate"] as const;

export function MigrateDesk({ source, starter }: Props) {
  const t = useTranslations("migrate");
  const label = sourceLabel(source);

  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-muted-foreground">{t("desk.pasteOnce")}</p>
      <section className="space-y-3 rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-tight">{t("desk.copyStarter", { source: label })}</h2>
          <CopyButton
            text={starter}
            label={t("copy")}
            copiedLabel={t("copied")}
            ariaLabel={t("desk.copyStarterAria", { source: label })}
            copyKind="starter"
            size="sm"
          />
        </div>
        <pre className="max-h-48 overflow-auto text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
          {starter}
        </pre>
      </section>
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        {AFTER_KEYS.map((key) => (
          <li key={key}>{t(`desk.${key}`)}</li>
        ))}
      </ol>
      <p className="text-sm">
        <Link
          href={`/migrate/${source}/0`}
          className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("desk.runbookLink")}
        </Link>
      </p>
    </div>
  );
}

export function MigrateHubDesks() {
  const t = useTranslations("migrate");

  return (
    <div className="space-y-8">
      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        <li>{t("ruleMemory")}</li>
        <li>{t("ruleRoutines")}</li>
        <li>{t("ruleSecrets")}</li>
      </ul>
      <div className="grid items-stretch gap-4 sm:grid-cols-2">
        {HANDOFF_SOURCES.map((source) => (
          <Link
            key={source}
            href={`/migrate/${source}`}
            className="flex h-full flex-col gap-4 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <MigrateLockup source={source} />
            <p className="text-sm leading-6 text-muted-foreground">{t(`desk.cardLead.${source}`)}</p>
            <ul className="flex-1 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
              <li>{t(`desk.cardReads.${source}`)}</li>
              <li>{t("desk.cardChief")}</li>
              <li>{t("desk.cardSecrets")}</li>
            </ul>
            <span className="mt-auto text-sm font-medium">
              {source === "hermes" ? t("desk.openHermes") : t("desk.openOpenclaw")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
