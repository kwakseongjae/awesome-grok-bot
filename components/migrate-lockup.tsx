import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { MIGRATE_MARKS } from "@/lib/faces";
import { cn } from "@/lib/utils";
import type { HandoffSource } from "@/lib/migrate/types";

type Props = {
  source: HandoffSource;
  className?: string;
};

function SourceMark({ source }: { source: HandoffSource }) {
  const src = source === "hermes" ? MIGRATE_MARKS.hermes : MIGRATE_MARKS.openclaw;

  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted sm:size-12">
      {source === "openclaw" ? (
        // Official OpenClaw SVG; next/image needs extra config for SVG.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" width={40} height={40} className="size-8 object-contain sm:size-10" />
      ) : (
        <Image src={src} alt="" width={48} height={48} className="size-10 object-contain sm:size-12" />
      )}
    </span>
  );
}

function GrokDestMark() {
  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background sm:size-12">
      {/* Official xAI Grok logomarks, unaltered. Dark = black on paper; Light = white on ink. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MIGRATE_MARKS.grokDark}
        alt=""
        width={40}
        height={40}
        className="size-7 object-contain sm:size-8 dark:hidden"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MIGRATE_MARKS.grokLight}
        alt=""
        width={40}
        height={40}
        className="hidden size-7 object-contain sm:size-8 dark:block"
      />
    </span>
  );
}

export function MigrateLockup({ source, className }: Props) {
  const t = useTranslations("migrate.home");
  const sourceLabel = source === "hermes" ? t("hermesMark") : t("openclawMark");
  const destLabel = t("destMark");

  return (
    <div
      className={cn("grid w-full min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3", className)}
    >
      <span className="flex min-w-0 items-center justify-start gap-2">
        <SourceMark source={source} />
        <span className="min-w-0 text-xs leading-tight font-medium sm:text-sm">{sourceLabel}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="flex min-w-0 items-center justify-end gap-2">
        <GrokDestMark />
        <span className="min-w-0 text-xs leading-tight font-medium sm:text-sm">{destLabel}</span>
      </span>
    </div>
  );
}
