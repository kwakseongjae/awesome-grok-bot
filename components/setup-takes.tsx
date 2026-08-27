"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ListingFace } from "@/components/listing-face";
import { ScoreBadge } from "@/components/listing-badges";
import type { SetupReview } from "@/lib/community-types";
import { REVIEW_ADDED_EVENT, listingNameFor } from "@/lib/reviews";
import { SCORE_FALLBACK_NAMES } from "@/lib/scores";
import { cn } from "@/lib/utils";

type Props = {
  reviews: SetupReview[];
  names: Record<string, string>;
  variant?: "home" | "rank" | "listing";
  listingSlug?: string;
};

export function SetupTakes({
  reviews: initial,
  names,
  variant = "home",
  listingSlug,
}: Props) {
  const t = useTranslations("reviews");
  const [reviews, setReviews] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setReviews(initial);
  }

  useEffect(() => {
    const handleAdded = (event: Event) => {
      const review = (event as CustomEvent<SetupReview>).detail;
      if (!review?.id) return;
      if (listingSlug && review.listingSlug !== listingSlug) return;
      setReviews((current) => [review, ...current.filter((item) => item.id !== review.id)]);
    };
    window.addEventListener(REVIEW_ADDED_EVENT, handleAdded);
    return () => window.removeEventListener(REVIEW_ADDED_EVENT, handleAdded);
  }, [listingSlug]);

  const visible = useMemo(() => {
    const rows = listingSlug
      ? reviews.filter((item) => item.listingSlug === listingSlug)
      : reviews;
    if (variant === "home") return rows.slice(0, 5);
    return rows;
  }, [reviews, listingSlug, variant]);

  return (
    <section id="takes" className="space-y-5" aria-labelledby="takes-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <h2 id="takes-heading" className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("lead")}</p>
        </div>
        {variant === "home" ? (
          <Link
            href="/rank#takes"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("open")} →
          </Link>
        ) : null}
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{t("disclaimer")}</p>

      {visible.length === 0 ? (
        <p className="rounded-lg border px-4 py-5 text-sm leading-6 text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <ul className="divide-y rounded-lg border bg-card">
          {visible.map((review) => {
            const name = listingNameFor(
              review.listingSlug,
              names,
              SCORE_FALLBACK_NAMES[review.listingSlug as keyof typeof SCORE_FALLBACK_NAMES] ??
                review.listingSlug,
            );
            const inner = (
              <>
                <ListingFace
                  slug={review.listingSlug}
                  seed={review.who}
                  name={review.who}
                  size={40}
                  decorative
                  motion
                />
                <span className="min-w-0 flex-1 space-y-1">
                  <span className="flex min-w-0 flex-wrap items-center gap-2">
                    {variant === "listing" ? (
                      <span className="font-medium tracking-tight">{review.who}</span>
                    ) : (
                      <span className="font-medium tracking-tight">{name}</span>
                    )}
                    <span className="rounded-md border px-2 py-0.5 font-mono text-[0.7rem] tracking-[0.08em] uppercase text-muted-foreground">
                      {t(review.kind === "human" ? "kindHuman" : "kindBot")}
                    </span>
                  </span>
                  <span className="block text-sm leading-6">{review.take}</span>
                  <span className="block font-mono text-xs text-muted-foreground">
                    {variant === "listing"
                      ? t("meta", { who: review.who, kind: t(review.kind === "human" ? "kindHuman" : "kindBot"), date: review.date })
                      : `${review.who} · ${review.date}`}
                  </span>
                </span>
                <ScoreBadge
                  score={review.score}
                  label={t("scoreAria", { score: review.score })}
                  className="mt-0.5 shrink-0 sm:mt-0"
                />
              </>
            );

            if (variant === "listing") {
              return (
                <li key={review.id} className="flex gap-3 px-4 py-4 sm:items-center sm:gap-4">
                  {inner}
                </li>
              );
            }

            return (
              <li key={review.id}>
                <Link
                  href={`/bots/${review.listingSlug}`}
                  className="flex gap-3 px-4 py-4 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:items-center sm:gap-4"
                  aria-label={t("listingAria", { name })}
                >
                  {inner}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export const HoneyPot = ({ className }: { className?: string }) => {
  const id = useId();
  return (
    <div className={cn("absolute -left-[9999px] h-0 w-0 overflow-hidden", className)} aria-hidden="true">
      <label htmlFor={id}>Company</label>
      <input id={id} name="company" tabIndex={-1} autoComplete="off" />
    </div>
  );
};
