import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND, MIGRATE_MARKS } from "@/lib/faces";
import { cn } from "@/lib/utils";
import type { HandoffSource } from "@/lib/migrate/types";

type Props = {
  source: HandoffSource;
  className?: string;
};

export function MigrateLockup({ source, className }: Props) {
  const t = useTranslations("migrate.home");
  const brand = useTranslations("brand");
  const sourceLabel = source === "hermes" ? t("hermesMark") : t("openclawMark");
  const sourceSrc = MIGRATE_MARKS[source];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
          {source === "openclaw" ? (
            // Pixel mark from OpenClaw; next/image SVG needs extra config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sourceSrc}
              alt={sourceLabel}
              width={40}
              height={40}
              className="size-10"
              style={{ imageRendering: "pixelated" }}
            />
          ) : (
            <Image
              src={sourceSrc}
              alt={sourceLabel}
              width={48}
              height={48}
              className="size-12 object-cover"
            />
          )}
        </span>
        <span className="truncate text-xs font-medium text-muted-foreground">{sourceLabel}</span>
      </span>
      <span className="flex min-w-8 shrink-0 items-center gap-1" aria-hidden="true">
        <span className="h-px w-6 bg-border sm:w-10" />
        <ArrowRight className="size-4 text-muted-foreground" />
      </span>
      <span className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span className="truncate text-right text-xs font-semibold">{brand("name")}</span>
        <span className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          <Image
            src={BRAND.mark}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
        </span>
      </span>
    </div>
  );
}
