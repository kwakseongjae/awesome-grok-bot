import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { KindBadge } from "@/components/listing-badges";
import type { BotKind } from "@/lib/types";

type AppHref = ComponentProps<typeof Link>["href"];

type Props = {
  href: string;
  category: string;
  title: string;
  dek: string;
  heading?: "h2" | "h3";
  kind?: BotKind;
  kindLabel?: string;
};

export const useCaseGridClass = "grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-4";

export function UseCaseCard({
  href,
  category,
  title,
  dek,
  heading = "h3",
  kind,
  kindLabel,
}: Props) {
  const Heading = heading;

  return (
    <Link
      href={href as AppHref}
      className="group flex h-full cursor-pointer flex-col rounded-lg border border-border bg-card p-5 transition-opacity duration-150 focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
      aria-label={title}
    >
      <p className="inline-flex w-fit rounded-md border border-border px-2 py-0.5 text-xs tracking-tight text-muted-foreground">
        {category}
      </p>
      <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
        <Heading className="text-base font-semibold tracking-tight group-hover:opacity-80">{title}</Heading>
        {kind && kindLabel ? <KindBadge kind={kind} label={kindLabel} /> : null}
      </div>
      <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-muted-foreground">{dek}</p>
    </Link>
  );
}
