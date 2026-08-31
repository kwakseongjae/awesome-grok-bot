"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GrokBotMascot } from "@/components/grok-bot-mascot";
import { ListingFace } from "@/components/listing-face";
import { cn } from "@/lib/utils";

export type HuddleListing = {
  slug: string;
  name: string;
};

type Props = {
  listings: HuddleListing[];
  className?: string;
};

export function HeroHuddle({ listings, className }: Props) {
  const t = useTranslations("home");
  const a11y = useTranslations("a11y");
  const labelId = useId();
  const mascotName = t("mascotName");
  const count = Math.max(listings.length, 1);

  return (
    <div
      className={cn("huddle relative mx-auto aspect-square w-full max-w-[min(100%,34rem)]", className)}
      role="group"
      aria-labelledby={labelId}
    >
      <p id={labelId} className="sr-only">
        {a11y("huddle")}
      </p>
      <div className="huddle-orbit absolute inset-0">
        {listings.map((listing, index) => {
          const angle = (index / count) * 360;
          return (
            <Link
              key={listing.slug}
              href={`/bots/${listing.slug}`}
              className={cn("huddle-slot", "focus-visible:ring-3 focus-visible:ring-ring/50")}
              style={{
                zIndex: 10,
                ["--huddle-a" as string]: `${angle}deg`,
                ["--blob-delay" as string]: `${(index * 0.37).toFixed(2)}s`,
              }}
              aria-label={listing.name}
              tabIndex={0}
            >
              <span className="huddle-orbit-face flex size-full items-center justify-center">
                <ListingFace
                  slug={listing.slug}
                  name={listing.name}
                  decorative
                  play
                  phase={index * 0.73}
                  className="size-full"
                />
              </span>
            </Link>
          );
        })}
      </div>
      <div className="huddle-mascot">
        <GrokBotMascot name={mascotName} decorative className="size-full" />
      </div>
    </div>
  );
}
