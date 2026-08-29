import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AppHref = ComponentProps<typeof Link>["href"];

type Props = {
  href: string;
  category: string;
  title: string;
  dek: string;
  heading?: "h2" | "h3";
};

export const useCaseGridClass = "grid items-start gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3";

export function UseCaseCard({ href, category, title, dek, heading = "h3" }: Props) {
  const Heading = heading;

  return (
    <Link
      href={href as AppHref}
      className="group block cursor-pointer rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={title}
    >
      <p className="flex items-center gap-2 text-xs tracking-tight text-muted-foreground">
        <span className="size-1.5 rounded-full bg-foreground" aria-hidden />
        {category}
      </p>
      <Heading className="mt-2 text-lg font-semibold tracking-tight group-hover:opacity-80">
        {title}
      </Heading>
      <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{dek}</p>
    </Link>
  );
}
