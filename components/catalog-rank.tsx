import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { KindBadge, ScoreBadge } from "@/components/listing-badges";
import { ListingFace } from "@/components/listing-face";
import {
  SCORE_CRITERIA,
  SCORE_DATE,
  SCORE_DISCLAIMER,
  SCORE_OUT_OF,
  SCORE_RATER,
  type RankingRow,
} from "@/lib/scores";
import { cn } from "@/lib/utils";

type Props = {
  rows: RankingRow[];
  variant?: "home" | "page";
};

export async function CatalogRank({ rows, variant = "home" }: Props) {
  const t = await getTranslations("rank");
  const kind = await getTranslations("kind");
  const Heading = variant === "page" ? "h1" : "h2";
  const headingClass =
    variant === "page"
      ? "text-4xl font-semibold tracking-tight"
      : "text-2xl font-semibold tracking-tight";

  return (
    <section id="rank" className="space-y-5" aria-labelledby="rank-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <Heading id="rank-heading" className={headingClass}>
            {t("title")}
          </Heading>
          <p className="text-sm leading-6 text-muted-foreground">{t("lead")}</p>
        </div>
        {variant === "home" ? (
          <Link
            href="/rank"
            className="text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("open")} →
          </Link>
        ) : null}
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{SCORE_DISCLAIMER}</p>

      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("criteriaTitle")}
        </p>
        <ScoreCriteriaList />
      </div>

      <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">{t("rater")}</dt>
          <dd>{SCORE_RATER}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">{t("date")}</dt>
          <dd>
            <time dateTime={SCORE_DATE} className="font-mono tabular-nums">
              {SCORE_DATE}
            </time>
          </dd>
        </div>
      </dl>

      <ol className="divide-y rounded-lg border bg-card">
        {rows.map((row) => (
          <li key={row.slug}>
            <Link
              href={`/bots/${row.slug}`}
              className="flex gap-3 px-4 py-4 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:items-center sm:gap-4"
              aria-label={t("listingLink", { name: row.name, rank: row.rank, score: row.score })}
            >
              <span className="w-6 shrink-0 font-mono text-sm tabular-nums text-muted-foreground">
                {row.rank}
              </span>
              <ListingFace slug={row.slug} name={row.name} size={40} decorative motion />
              <span className="min-w-0 flex-1 space-y-1">
                <span className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="font-medium tracking-tight">{row.name}</span>
                  {row.kind ? (
                    <KindBadge kind={row.kind} label={kind(row.kind)} />
                  ) : null}
                </span>
                <span className="block text-sm leading-6 text-muted-foreground">{row.why}</span>
              </span>
              <ScoreBadge
                score={row.score}
                outOf={SCORE_OUT_OF}
                label={t("scoreAria", { score: row.score })}
                className="mt-0.5 shrink-0 sm:mt-0"
              />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export const ScoreCriteriaList = ({ className }: { className?: string }) => (
  <ul className={cn("flex flex-wrap gap-2", className)}>
    {SCORE_CRITERIA.map((item) => (
      <li key={item}>
        <span className="inline-flex h-auto max-w-full rounded-md border border-border px-2 py-1 text-xs leading-5 font-normal wrap-break-word">
          {item}
        </span>
      </li>
    ))}
  </ul>
);
