"use client";

import { useTranslations } from "next-intl";
import { CopyButton } from "@/components/copy-button";
import type { HandoffSource } from "@/lib/migrate/types";

type Props = {
  source: HandoffSource;
  prompt: string;
};

export function MigrateHandoverAppendix({ source, prompt }: Props) {
  const t = useTranslations("migrate");

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted-foreground">{t("playbook.appendixLead", { source: source === "hermes" ? "Hermes" : "OpenClaw" })}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-tight">{t("handover.promptTitle")}</p>
        <CopyButton
          text={prompt}
          label={t("copy")}
          copiedLabel={t("copied")}
          ariaLabel={t("handover.copyAria")}
          size="sm"
        />
      </div>
      <pre className="max-h-72 overflow-auto text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
        {prompt}
      </pre>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
        <li>{t("handover.gatePassword")}</li>
        <li>{t("handover.gateSso")}</li>
        <li>{t("handover.gateOauth")}</li>
        <li>{t("handover.gateSecond")}</li>
        <li>{t("handover.gateShare")}</li>
      </ul>
    </div>
  );
}
