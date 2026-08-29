import type { ComponentProps, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ListingFace } from "@/components/listing-face";
import { cn } from "@/lib/utils";

type AppHref = ComponentProps<typeof Link>["href"];

type Props = {
  title: string;
  kicker: string;
  dek: string;
  href: string;
  name: string;
  slug?: string;
  heading?: "h2" | "h3";
  external?: boolean;
  media?: ReactNode;
};

const tileClass =
  "group block cursor-pointer rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50";

export function GuideTile({
  title,
  kicker,
  dek,
  href,
  name,
  slug,
  heading = "h3",
  external = false,
  media,
}: Props) {
  const Heading = heading;
  const body = (
    <>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-foreground">
        <div className="absolute inset-0 flex items-center justify-center opacity-40 transition-opacity duration-150 group-hover:opacity-30">
          {media ?? <ListingFace slug={slug} name={name} size={128} decorative motion />}
        </div>
        <p
          className="relative z-10 max-w-[16ch] px-4 text-center text-xl font-semibold tracking-tight text-balance text-background sm:text-2xl"
          aria-hidden
        >
          {title}
        </p>
      </div>
      <p className="mt-3 font-mono text-xs tracking-tight text-muted-foreground">{kicker}</p>
      <Heading className="mt-1 text-base font-semibold tracking-tight">{title}</Heading>
      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{dek}</p>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={tileClass}
        aria-label={title}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href as AppHref} className={tileClass} aria-label={title}>
      {body}
    </Link>
  );
}

export const guideTileGridClass = cn(
  "grid items-start gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4",
);
