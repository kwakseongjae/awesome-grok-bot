import type { BotKind } from "@/lib/types";

/** 에디터 scores, 2026-08-27. Locked. Do not invent more. */
export const SCORE_RATER = "에디터";
export const SCORE_DATE = "2026-08-27";
export const SCORE_OUT_OF = 10;

export const SCORE_CRITERIA = [
  "paste-ready (job, bar, never-do, first task)",
  "safe on day one (no send, no pay, no prod)",
  "useful as bot #1",
  "no second stack",
] as const;

export const SCORE_DISCLAIMER =
  "Scores are 에디터's, 2026-08-27. Not a user survey. Not app telemetry.";

export type ScoredSlug =
  | "inbox-chief"
  | "run-orchestrator"
  | "chief-of-staff"
  | "floor-nexus"
  | "content-crew";

export type ScoredEntry = {
  rank: 1 | 2 | 3 | 4 | 5;
  slug: ScoredSlug;
  score: 9 | 8 | 7 | 6 | 5;
  why: string;
};

export const SCORE_FALLBACK_NAMES: Record<ScoredSlug, string> = {
  "inbox-chief": "Inbox Chief",
  "run-orchestrator": "Run Orchestrator",
  "chief-of-staff": "Chief of Staff",
  "floor-nexus": "Floor Nexus",
  "content-crew": "Content Crew",
};

export const SCORED_RANKING: readonly ScoredEntry[] = [
  {
    rank: 1,
    slug: "inbox-chief",
    score: 9,
    why: "Paste-ready inbox job. Safe on day one. Useful as bot #1.",
  },
  {
    rank: 2,
    slug: "run-orchestrator",
    score: 8,
    why: "Paste-ready sequencer. Safe on day one. Useful as bot #1.",
  },
  {
    rank: 3,
    slug: "chief-of-staff",
    score: 7,
    why: "Paste-ready digest. Safe on day one. Not the inbox front door.",
  },
  {
    rank: 4,
    slug: "floor-nexus",
    score: 6,
    why: "Bot #2 / router. Does not do the work.",
  },
  {
    rank: 5,
    slug: "content-crew",
    score: 5,
    why: "A team, not one bot. Too much for day one.",
  },
];

const SCORE_BY_SLUG = new Map(SCORED_RANKING.map((entry) => [entry.slug, entry]));

export const scoreForSlug = (slug: string) => SCORE_BY_SLUG.get(slug as ScoredSlug);

export type RankingRow = ScoredEntry & {
  name: string;
  kind?: BotKind;
};

export const rankingRows = (
  listings: { slug: string; name: string; kind: BotKind }[],
): RankingRow[] => {
  const bySlug = new Map(listings.map((listing) => [listing.slug, listing]));
  return SCORED_RANKING.map((entry) => {
    const listing = bySlug.get(entry.slug);
    return {
      ...entry,
      name: listing?.name ?? SCORE_FALLBACK_NAMES[entry.slug],
      kind: listing?.kind,
    };
  });
};
