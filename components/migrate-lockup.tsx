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

function SourceMark({ source }: { source: HandoffSource }) {
  const src = MIGRATE_MARKS[source];

  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted sm:size-12">
      {source === "openclaw" ? (
        // Pixel mark from OpenClaw; next/image SVG needs extra config.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={36}
          height={36}
          className="size-8 sm:size-10"
          style={{ imageRendering: "pixelated" }}
        />
      ) : (
        <Image src={src} alt="" width={48} height={48} className="size-10 object-cover sm:size-12" />
      )}
    </span>
  );
}

export function MigrateLockup({ source, className }: Props) {
  const t = useTranslations("migrate.home");
  const brand = useTranslations("brand");
  const sourceLabel = source === "hermes" ? t("hermesMark") : t("openclawMark");
  const destLabel = brand("name");

  return (
    <div className={cn("flex min-w-0 items-center gap-2 sm:gap-3", className)}>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <SourceMark source={source} />
        <span className="truncate text-sm font-medium">{sourceLabel}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="relative size-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted sm:size-12">
          <Image
            src={BRAND.mark}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
            style={{ objectPosition: "50% 45%" }}
          />
        </span>
        <span className="truncate text-sm font-medium">{destLabel}</span>
      </span>
    </div>
  );
}
