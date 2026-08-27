import { getLocale, getTranslations } from "next-intl/server";
import { ScoreBadge } from "@/components/listing-badges";
import { Link } from "@/i18n/navigation";
import type { SetupBotReview } from "@/lib/visitor-posts";

type Props = {
  reviews: SetupBotReview[];
  listingNames?: Record<string, string>;
};

export const SetupBotReviewList = async ({ reviews, listingNames }: Props) => {
  const t = await getTranslations("reviews");
  const locale = await getLocale();

  if (reviews.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="divide-y rounded-lg border bg-card">
      {reviews.map((review) => (
        <li key={review.id} className="space-y-2 px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium tracking-tight">{review.displayName}</p>
            <ScoreBadge score={review.score} label={`${review.score}/10`} />
            <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {t("label")}
            </span>
            {listingNames ? (
              <Link
                href={`/bots/${review.botSlug}#reviews`}
                className="cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {listingNames[review.botSlug] ?? review.botSlug}
              </Link>
            ) : null}
          </div>
          <p className="text-sm leading-6">{review.body}</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
            <time dateTime={review.createdAt}>
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(review.createdAt),
              )}
            </time>
            {review.xHandle ? (
              <a
                href={`https://x.com/${review.xHandle}`}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                @{review.xHandle}
              </a>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
};
