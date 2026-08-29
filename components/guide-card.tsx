import type { ComponentProps, ReactNode } from "react";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { GrainThumb } from "@/components/grain-thumb";
import type { GrainTone } from "@/lib/templates";

type GuideHref = ComponentProps<typeof Link>["href"];

type CardProps = {
  href: GuideHref;
  title: string;
  date: string;
  tone: GrainTone;
  seed?: number;
  children?: ReactNode;
};

export function GuideCard({ href, title, date, tone, seed, children }: CardProps) {
  return (
    <Link
      href={href}
      className="group/card block cursor-pointer rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card transition-colors duration-150 group-hover/card:bg-muted/40">
        <GrainThumb title={title} tone={tone} seed={seed} size="card" />
      </div>
      <div className="mt-3">
        <p className="text-[11px] text-muted-foreground transition-colors duration-150 group-hover/card:text-foreground/70">
          {date}
        </p>
        <h3 className="mt-1 text-sm leading-snug font-medium tracking-tight transition-colors duration-150 group-hover/card:text-foreground">
          {title}
        </h3>
        {children}
      </div>
    </Link>
  );
}

type HeroProps = {
  href: GuideHref;
  title: string;
  lead: string;
  date: string;
  tone: GrainTone;
  seed?: number;
  readMore: string;
  titleAs?: "h1" | "h2";
};

export function GuideHero({
  href,
  title,
  lead,
  date,
  tone,
  seed,
  readMore,
  titleAs = "h1",
}: HeroProps) {
  const TitleTag = titleAs;

  return (
    <Link
      href={href}
      className="group/card block cursor-pointer rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 lg:grid lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:gap-12"
    >
      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card transition-colors duration-150 group-hover/card:bg-muted/40 lg:order-2 lg:rounded-2xl">
        <GrainThumb title={title} tone={tone} seed={seed} size="hero" />
      </div>
      <div className="mt-4 lg:order-1 lg:mt-0">
        <p className="text-[11px] text-muted-foreground lg:text-xs">{date}</p>
        <TitleTag className="mt-1 text-sm leading-snug font-medium tracking-tight lg:mt-5 lg:text-5xl lg:leading-[1.1] lg:font-semibold">
          {title}
        </TitleTag>
        <p className="mt-4 hidden max-w-md text-sm leading-relaxed text-muted-foreground lg:block">{lead}</p>
        <span className="mt-6 hidden items-center gap-1 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground lg:inline-flex">
          {readMore}
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
