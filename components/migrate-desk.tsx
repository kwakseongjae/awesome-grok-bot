import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { MigrateLockup } from "@/components/migrate-lockup";
import { ShareButton } from "@/components/share-button";
import { HANDOFF_SOURCES, sourceLabel } from "@/lib/migrate/source";
import type { HandoffSource } from "@/lib/migrate/types";

type Props = {
  source: HandoffSource;
  starter: string;
  skillMarkdown: string;
  shareUrl: string;
};

const AFTER_KEYS = ["afterSkill", "afterGold", "afterGate"] as const;

export async function MigrateDesk({ source, starter, skillMarkdown, shareUrl }: Props) {
  const t = await getTranslations("migrate");
  const bot = await getTranslations("bot");
  const label = sourceLabel(source);
  const other = source === "hermes" ? "openclaw" : "hermes";
  const title = source === "hermes" ? t("hermesTitle") : t("openclawTitle");
  const otherTitle = other === "hermes" ? t("hermesTitle") : t("openclawTitle");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <CopyButton
          text={starter}
          label={t("copy")}
          copiedLabel={t("copied")}
          ariaLabel={t("desk.copyStarterAria", { source: label })}
          copyKind="starter"
        />
        <CopyButton
          text={skillMarkdown}
          label={t("desk.copySkill")}
          copiedLabel={t("copied")}
          ariaLabel={t("desk.copySkillAria")}
          variant="outline"
        />
        <ShareButton title={title} url={shareUrl} />
      </div>
      <p>
        <span className="sr-only">{bot("share")}: </span>
        <a
          href={shareUrl}
          className="cursor-pointer font-mono text-xs tracking-tight text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {shareUrl}
        </a>
      </p>
      <p className="text-sm leading-6 text-muted-foreground">{t("desk.pasteOnce")}</p>
      <p className="text-sm leading-6 text-muted-foreground">{t("desk.notMagic")}</p>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold tracking-tight">{t("desk.copyStarter", { source: label })}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{t(`desk.installHint.${source}`)}</p>
        <pre className="max-h-48 overflow-auto font-mono text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
          {starter}
        </pre>
      </section>

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold tracking-tight">{t("desk.copySkill")}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{t("desk.skillHint")}</p>
        <pre className="max-h-[min(32rem,70vh)] overflow-auto font-mono text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
          {skillMarkdown}
        </pre>
      </section>

      <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        {AFTER_KEYS.map((key) => (
          <li key={key}>{t(`desk.${key}`)}</li>
        ))}
      </ol>

      <section className="space-y-3">
        <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("desk.moreTitle")}
        </h2>
        <ul className="space-y-2 text-sm leading-6">
          <li>
            <Link
              href="/templates"
              className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("desk.moreIndex")}
            </Link>
            <span className="text-muted-foreground"> · {t("desk.moreDirectoryLead")}</span>
          </li>
          <li>
            <Link
              href={`/migrate/${other}`}
              className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {otherTitle}
            </Link>
          </li>
        </ul>
      </section>

      <p className="text-sm text-muted-foreground">
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

export async function MigrateHubDesks() {
  const t = await getTranslations("migrate");

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
