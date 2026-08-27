import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SetupBotReviewComposer } from "@/components/setup-bot-review-composer";
import { SetupBotReviewList } from "@/components/setup-bot-review-list";
import type { SetupBotReview, VisitorStoreStatus } from "@/lib/visitor-posts";

type Props = {
  slug: string;
  listingName: string;
  reviews: SetupBotReview[];
  canWrite: VisitorStoreStatus["canWrite"];
};

export const SetupBotReviews = async ({ slug, listingName, reviews, canWrite }: Props) => {
  const t = await getTranslations("reviews");

  return (
    <section id="reviews" className="mt-12 space-y-6" aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("label")}
          </p>
          <h2 id="reviews-heading" className="text-base font-semibold tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("lead")}</p>
        </div>
        <Link
          href="/reviews"
          className="cursor-pointer text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("open")} →
        </Link>
      </div>
      <SetupBotReviewComposer slug={slug} listingName={listingName} canWrite={canWrite} />
      <SetupBotReviewList reviews={reviews} />
    </section>
  );
};
