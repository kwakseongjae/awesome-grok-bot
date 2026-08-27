import { getTranslations } from "next-intl/server";
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
      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("label")}
        </p>
        <h2 id="reviews-heading" className="text-base font-semibold tracking-tight">
          {t("title")}
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">{t("lead")}</p>
      </div>
      <SetupBotReviewComposer slug={slug} listingName={listingName} canWrite={canWrite} />
      <SetupBotReviewList reviews={reviews} />
    </section>
  );
};
