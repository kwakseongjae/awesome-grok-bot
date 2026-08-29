import type { ReactNode } from "react";
import { ListingFace } from "@/components/listing-face";
import { COLORS, skinForFace } from "@/lib/grok-bot-blob";

type Props = {
  name: string;
  slug: string;
  byline: string;
  dek: string;
  children: ReactNode;
};

export function ShareCard({ name, slug, byline, dek, children }: Props) {
  const skin = skinForFace(slug);
  const fill = COLORS[skin?.color ?? "encre"];

  return (
    <article className="overflow-hidden rounded-2xl border bg-card">
      <div
        className="flex aspect-[16/10] items-center justify-center"
        style={{ backgroundColor: fill }}
      >
        <span className="flex size-20 items-center justify-center rounded-full bg-background">
          <ListingFace slug={slug} name={name} size={64} motion />
        </span>
      </div>
      <div className="space-y-3 px-8 py-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{name}</h1>
        <p className="text-sm text-muted-foreground">{byline}</p>
        <p className="text-sm leading-6 text-muted-foreground">{dek}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 border-t pt-5">{children}</div>
      </div>
    </article>
  );
}
