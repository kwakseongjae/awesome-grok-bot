"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MIGRATE_DRAFT_KEY, type HandoffListingDraft, type HandoffPacket, type HandoffSource, type PacketKind } from "@/lib/migrate/types";
import { cn } from "@/lib/utils";

type Props = {
  source: HandoffSource;
  packets: HandoffPacket[];
  listingDraft: HandoffListingDraft;
  skipped: string[];
  redactedCount: number;
  canSave: boolean;
};

const KINDS: PacketKind[] = ["profile", "memory", "skill", "routine"];

export function HandoffQueue({ source, packets, listingDraft, skipped, redactedCount, canSave }: Props) {
  const t = useTranslations("migrate");
  const router = useRouter();
  const [includeOptional, setIncludeOptional] = useState(false);
  const [index, setIndex] = useState(0);
  const [profileCopied, setProfileCopied] = useState(false);

  const visible = useMemo(
    () => packets.filter((packet) => includeOptional || !packet.optional),
    [includeOptional, packets],
  );
  const current = visible[Math.min(index, Math.max(visible.length - 1, 0))] ?? null;
  const counts = {
    profile: visible.filter((packet) => packet.kind === "profile").length,
    memory: visible.filter((packet) => packet.kind === "memory").length,
    skill: visible.filter((packet) => packet.kind === "skill").length,
    routine: visible.filter((packet) => packet.kind === "routine").length,
  };
  const optionalCount = packets.filter((packet) => packet.optional).length;
  const currentKindIndex = current ? KINDS.indexOf(current.kind) : 0;

  const handleSaveListing = () => {
    sessionStorage.setItem(MIGRATE_DRAFT_KEY, JSON.stringify(listingDraft));
    toast.success(t("draftReady"));
    router.push("/submit");
  };

  if (!current) {
    return <p className="text-sm text-muted-foreground">{t("emptyQueue")}</p>;
  }

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap gap-2 text-sm">
        {KINDS.map((kind, step) => (
          <li
            key={kind}
            className={cn(
              "rounded-md border px-2 py-1",
              step === currentKindIndex ? "border-foreground bg-foreground text-background" : "text-muted-foreground",
            )}
          >
            {t(`step.${kind}`)} · {counts[kind]}
          </li>
        ))}
      </ol>

      <p className="text-sm text-muted-foreground">{t("honesty", { source: source === "hermes" ? "Hermes" : "OpenClaw" })}</p>

      {optionalCount > 0 ? (
        <label className="flex items-start gap-2 text-sm">
          <Checkbox
            checked={includeOptional}
            onCheckedChange={(value) => {
              setIncludeOptional(value === true);
              setIndex(0);
            }}
          />
          <span>{t("includeOptional", { count: optionalCount })}</span>
        </label>
      ) : null}

      {redactedCount > 0 || skipped.length > 0 ? (
        <div className="rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground">
          <p>{t("stripped", { redacted: redactedCount, skipped: skipped.length })}</p>
          {skipped.length > 0 ? (
            <p className="mt-1 font-mono">{skipped.slice(0, 8).join(" · ")}{skipped.length > 8 ? "…" : ""}</p>
          ) : null}
        </div>
      ) : null}

      <section className="space-y-3 rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold">{current.title}</h2>
          <p className="font-mono text-xs text-muted-foreground">{current.source}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          {index + 1} / {visible.length} · {t(`kind.${current.kind}`)}
        </p>
        <pre className="max-h-80 overflow-auto rounded-md border bg-background p-3 font-mono text-sm leading-6 whitespace-pre-wrap">
          {current.body}
        </pre>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton
            text={current.body}
            label={t("copy")}
            copiedLabel={t("copied")}
            ariaLabel={t("copyPacket", { title: current.title })}
            onCopied={() => {
              if (current.kind === "profile") setProfileCopied(true);
            }}
          />
          <Button
            type="button"
            variant="outline"
            disabled={index <= 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
          >
            {t("prev")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={index >= visible.length - 1}
            onClick={() => setIndex((value) => Math.min(visible.length - 1, value + 1))}
          >
            {t("next")}
          </Button>
        </div>
        {current.kind === "profile" && profileCopied ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button type="button" variant="outline" onClick={handleSaveListing} disabled={!canSave}>
              {t("saveListing")}
            </Button>
            <p className="text-xs text-muted-foreground">{canSave ? t("saveListingHint") : t("saveNeedsAuth")}</p>
          </div>
        ) : null}
      </section>

      <section className="space-y-2">
        <h3 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("remaining")}
        </h3>
        <ol className="space-y-1">
          {visible.map((packet, packetIndex) => (
            <li key={packet.id}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm focus-visible:ring-3 focus-visible:ring-ring/50",
                  packetIndex === index ? "bg-muted" : "hover:bg-muted/60",
                )}
                onClick={() => setIndex(packetIndex)}
              >
                <span className="font-mono text-xs text-muted-foreground">{packetIndex + 1}</span>
                <span className="ml-2">{packet.title}</span>
                <span className="ml-2 text-xs text-muted-foreground">{t(`kind.${packet.kind}`)}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
