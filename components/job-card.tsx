import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { ListingFace } from "@/components/listing-face";
import { buttonVariants } from "@/components/ui/button";
import type { CopyKind } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type AppHref = ComponentProps<typeof Link>["href"];

export type JobCardCopy = {
  text: string;
  label: string;
  copiedLabel: string;
  ariaLabel: string;
  botId?: string;
  copyKind?: CopyKind;
};

type Props = {
  title: string;
  byline: string;
  blurb: string;
  href: string;
  openLabel: string;
  name: string;
  slug?: string;
  heading?: "h2" | "h3";
  external?: boolean;
  media?: ReactNode;
  note?: ReactNode;
  copy?: JobCardCopy;
};

export function JobCard({
  title,
  byline,
  blurb,
  href,
  openLabel,
  name,
  slug,
  heading = "h3",
  external = false,
  media,
  note,
  copy,
}: Props) {
  const Heading = heading;
  const openClass = cn(
    buttonVariants({ variant: copy ? "outline" : "default", size: "sm" }),
    "cursor-pointer",
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
      <div className="flex aspect-[4/3] items-center justify-center bg-muted p-6">
        {media ?? <ListingFace slug={slug} name={name} size={96} decorative motion />}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <Heading className="text-lg font-semibold tracking-tight">
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
          <p className="font-mono text-xs tracking-tight text-muted-foreground">{byline}</p>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{blurb}</p>
        {note ? (
          <div className="font-mono text-[11px] leading-5 tracking-tight break-all text-muted-foreground">
            {note}
          </div>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          {copy ? (
            <CopyButton
              text={copy.text}
              label={copy.label}
              copiedLabel={copy.copiedLabel}
              ariaLabel={copy.ariaLabel}
              botId={copy.botId}
              copyKind={copy.copyKind ?? "listing"}
              size="sm"
            />
          ) : null}
          {external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={openClass}
              aria-label={`${openLabel}: ${name}`}
            >
              {openLabel}
            </a>
          ) : (
            <Link href={href as AppHref} className={openClass} aria-label={`${openLabel}: ${name}`}>
              {openLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
