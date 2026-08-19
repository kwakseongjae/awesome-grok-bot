import { IntegrationMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";
import { resolveIntegration } from "@/lib/integrations";
import type { ListingLocale } from "@/lib/types";

type ChipProps = {
  name: string;
  locale: ListingLocale;
  className?: string;
};

export function PluginChip({ name, locale, className }: ChipProps) {
  const integration = resolveIntegration(name);
  const label = integration.labels[locale];

  return (
    <span
      title={integration.raw}
      className={cn(
        "inline-flex h-6 max-w-full items-center gap-1.5 rounded-md border border-border bg-background px-1.5 text-xs text-foreground",
        className,
      )}
    >
      {integration.known ? (
        <IntegrationMark mark={integration.mark} className="size-3.5 shrink-0" />
      ) : (
        <span
          aria-hidden
          className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm bg-muted font-mono text-[9px] leading-none text-muted-foreground"
        >
          {integration.monogram}
        </span>
      )}
      <span className="truncate">{label}</span>
    </span>
  );
}

export function PluginChipList({
  items,
  locale,
  max,
}: {
  items: string[];
  locale: ListingLocale;
  max?: number;
}) {
  if (items.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  const visible = typeof max === "number" ? items.slice(0, max) : items;
  const rest = items.length - visible.length;

  return (
    <ul className="flex flex-wrap gap-1">
      {visible.map((item) => (
        <li key={item}>
          <PluginChip name={item} locale={locale} />
        </li>
      ))}
      {rest > 0 ? (
        <li>
          <span className="inline-flex h-6 items-center rounded-md border border-border px-1.5 font-mono text-xs text-muted-foreground">
            +{rest}
          </span>
        </li>
      ) : null}
    </ul>
  );
}
