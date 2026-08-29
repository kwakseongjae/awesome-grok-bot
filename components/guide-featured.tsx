import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { buttonVariants } from "@/components/ui/button";
import type { CopyKind } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type AppHref = ComponentProps<typeof Link>["href"];

export type GuideFeaturedCopy = {
  text: string;
  label: string;
  copiedLabel: string;
  ariaLabel: string;
  botId?: string;
  copyKind?: CopyKind;
};

type Props = {
  kicker: string;
  title: string;
  dek: string;
  href: string;
  cta: string;
  name: string;
  heading?: "h1" | "h2";
  media: ReactNode;
  note?: ReactNode;
  copy?: GuideFeaturedCopy;
  external?: boolean;
};

export function GuideFeatured({
  kicker,
  title,
  dek,
  href,
  cta,
  name,
  media,
  note,
  copy,
  external = false,
  heading = "h2",
}: Props) {
  const Heading = heading;
  const ctaClass = cn(buttonVariants({ variant: "default", size: "sm" }), "cursor-pointer");
  const titleClass =
    "mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl";

  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{kicker}</p>
        <Heading className={titleClass}>
          {external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {title}
            </a>
          ) : (
            <Link
              href={href as AppHref}
              className="cursor-pointer underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {title}
            </Link>
          )}
        </Heading>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{dek}</p>
        {note ? (
          <div className="mt-4 font-mono text-[11px] leading-5 tracking-tight break-all text-muted-foreground">
            {note}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {copy ? (
            <CopyButton
              text={copy.text}
              label={copy.label}
              copiedLabel={copy.copiedLabel}
              ariaLabel={copy.ariaLabel}
              botId={copy.botId}
              copyKind={copy.copyKind ?? "starter"}
              size="sm"
            />
          ) : null}
          {external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClass}
              aria-label={`${cta}: ${name}`}
            >
              {cta}
              <ChevronRight />
            </a>
          ) : (
            <Link href={href as AppHref} className={ctaClass} aria-label={`${cta}: ${name}`}>
              {cta}
              <ChevronRight />
            </Link>
          )}
        </div>
      </div>
      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-lg bg-foreground">
        <div className="absolute inset-0 flex items-center justify-center opacity-50">{media}</div>
        <p
          className="relative z-10 max-w-[16ch] px-6 text-center text-2xl font-semibold tracking-tight text-balance text-background sm:text-3xl"
          aria-hidden
        >
          {title}
        </p>
      </div>
    </article>
  );
}
