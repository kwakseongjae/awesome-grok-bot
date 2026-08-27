import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ScoreBadge } from "@/components/listing-badges";
import { ScoreCriteriaList } from "@/components/catalog-rank";
import {
  SCORE_DATE,
  SCORE_DISCLAIMER,
  SCORE_OUT_OF,
  SCORE_RATER,
  type ScoredEntry,
} from "@/lib/scores";

type Props = {
  entry: ScoredEntry;
};

export async function ScorePanel({ entry }: Props) {
  const t = await getTranslations("rank");

  return (
    <aside
      className="mt-12 space-y-4 rounded-lg border bg-card p-4"
      aria-labelledby="score-panel-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <h2 id="score-panel-heading" className="text-base font-semibold tracking-tight">
            {t("panelTitle")}
          </h2>
        </div>
        <ScoreBadge
          score={entry.score}
          outOf={SCORE_OUT_OF}
          label={t("scoreAria", { score: entry.score })}
        />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        {t("place", { rank: entry.rank, total: 5 })}
      </p>

      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{t("rater")}</dt>
          <dd>{SCORE_RATER}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("date")}</dt>
          <dd>
            <time dateTime={SCORE_DATE} className="font-mono tabular-nums">
              {SCORE_DATE}
            </time>
          </dd>
        </div>
      </dl>

      <div className="space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("criteriaTitle")}
        </p>
        <ScoreCriteriaList />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">{SCORE_DISCLAIMER}</p>

      <Link
        href="/rank"
        className="inline-flex text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {t("open")} →
      </Link>
    </aside>
  );
}
