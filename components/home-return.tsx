import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { KindBadge, ScoreBadge } from "@/components/listing-badges";
import { ListingFace } from "@/components/listing-face";
import { getReturningHook } from "@/lib/returning";
import type { BotListing } from "@/lib/types";

type Props = {
  bots: BotListing[];
};

export const HomeReturn = async ({ bots }: Props) => {
  const t = await getTranslations("home");
  const kind = await getTranslations("kind");
  const locale = await getLocale();
  const hook = await getReturningHook(bots);

  if (!hook) return null;

  if (hook.kind === "mark") {
    const { mark } = hook;
    return (
      <section className="space-y-5" aria-labelledby="return-heading">
        <ReturnHeader
          eyebrow={t("returnEyebrowMark")}
          title={t("returnTitleMark")}
          lead={t("returnLeadMark")}
          href="/visitors"
          cta={t("returnOpenVisitors")}
        />
        <article className="space-y-2 rounded-lg border bg-card px-4 py-4">
          <h3 className="font-medium tracking-tight">{mark.name}</h3>
          <p className="text-sm leading-6">{mark.line}</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
            <time dateTime={mark.createdAt}>
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(mark.createdAt),
              )}
            </time>
            {mark.link ? (
              <a
                href={mark.link}
                target="_blank"
                rel="noreferrer"
                className="max-w-full cursor-pointer truncate underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {mark.link.replace(/^https:\/\//, "")}
              </a>
            ) : null}
          </p>
        </article>
      </section>
    );
  }

  if (hook.kind === "review") {
    const { review } = hook;
    const listingName =
      bots.find((bot) => bot.slug === review.botSlug)?.name ?? review.botSlug;
    return (
      <section className="space-y-5" aria-labelledby="return-heading">
        <ReturnHeader
          eyebrow={t("returnEyebrowReview")}
          title={t("returnTitleReview")}
          lead={t("returnLeadReview")}
          href="/reviews"
          cta={t("returnOpenReviews")}
        />
        <article className="space-y-2 rounded-lg border bg-card px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium tracking-tight">{review.displayName}</h3>
            <ScoreBadge score={review.score} label={`${review.score}/10`} />
            <Link
              href={`/bots/${review.botSlug}#reviews`}
              className="cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {listingName}
            </Link>
          </div>
          <p className="text-sm leading-6">{review.body}</p>
          <p className="font-mono text-xs text-muted-foreground">
            <time dateTime={review.createdAt}>
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(review.createdAt),
              )}
            </time>
          </p>
        </article>
      </section>
    );
  }

  const { listing, date } = hook;
  return (
    <section className="space-y-5" aria-labelledby="return-heading">
      <ReturnHeader
        eyebrow={t("returnEyebrowPaste")}
        title={t("returnTitlePaste")}
        lead={t("returnLeadPaste", { date })}
        href={`/bots/${listing.slug}`}
        cta={t("returnOpenListing")}
      />
      <Link
        href={`/bots/${listing.slug}`}
        className="flex cursor-pointer gap-3 rounded-lg border bg-card px-4 py-4 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:items-center sm:gap-4"
        aria-label={`${listing.name}. ${t("returnOpenListing")}`}
      >
        <ListingFace slug={listing.slug} name={listing.name} size={40} decorative motion />
        <span className="min-w-0 flex-1 space-y-1">
          <span className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="font-medium tracking-tight">{listing.name}</span>
            <KindBadge kind={listing.kind} label={kind(listing.kind)} />
            <time dateTime={date} className="font-mono text-xs text-muted-foreground">
              {date}
            </time>
          </span>
          <span className="block text-sm leading-6 text-muted-foreground">{listing.summary}</span>
        </span>
      </Link>
    </section>
  );
};

const ReturnHeader = ({
  eyebrow,
  title,
  lead,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  href: "/visitors" | "/reviews" | `/bots/${string}`;
  cta: string;
}) => (
  <div className="flex flex-wrap items-end justify-between gap-3">
    <div className="max-w-2xl space-y-2">
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <h2 id="return-heading" className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-sm leading-6 text-muted-foreground">{lead}</p>
    </div>
    <Link
      href={href}
      className="cursor-pointer text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {cta} →
    </Link>
  </div>
);
