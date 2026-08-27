import { SCORED_RANKING } from "@/lib/scores";
import type { PlayGuest, PlayNote, PlayReaction, PlayReactionKind } from "@/lib/community-types";
import { PLAY_JOB_MAX, PLAY_NAME_MAX, PLAY_NOTE_MAX } from "@/lib/play";
import { publishedSlugSet } from "@/lib/review-parse";
import { oneLine, todayStamp } from "@/lib/text-line";

export const isPlayReaction = (value: unknown): value is PlayReactionKind =>
  value === "used" || value === "keep" || value === "skip";

export const playSetupSlugs = () => SCORED_RANKING.map((row) => row.slug);

export const buildPlayGuest = (input: {
  name: unknown;
  job: unknown;
}): { ok: true; guest: PlayGuest } | { ok: false; error: string } => {
  const name = oneLine(input.name, PLAY_NAME_MAX);
  const job = oneLine(input.job, PLAY_JOB_MAX);
  if (!name || !job) return { ok: false, error: "invalid" };
  return {
    ok: true,
    guest: {
      id: crypto.randomUUID(),
      name,
      job,
      date: todayStamp(),
    },
  };
};

export const buildPlayNote = (input: {
  who: unknown;
  body: unknown;
}): { ok: true; note: PlayNote } | { ok: false; error: string } => {
  const who = oneLine(input.who, PLAY_NAME_MAX);
  const body = oneLine(input.body, PLAY_NOTE_MAX);
  if (!who || !body) return { ok: false, error: "invalid" };
  return {
    ok: true,
    note: {
      id: crypto.randomUUID(),
      who,
      body,
      date: todayStamp(),
    },
  };
};

export const buildPlayReaction = async (input: {
  who: unknown;
  listingSlug: unknown;
  reaction: unknown;
}): Promise<{ ok: true; reaction: PlayReaction } | { ok: false; error: string }> => {
  const who = oneLine(input.who, PLAY_NAME_MAX);
  const listingSlug = oneLine(input.listingSlug, 80);
  if (!who || !listingSlug || !isPlayReaction(input.reaction)) {
    return { ok: false, error: "invalid" };
  }
  const allowed = new Set<string>(playSetupSlugs());
  const published = await publishedSlugSet();
  if (!allowed.has(listingSlug) || !published.has(listingSlug)) {
    return { ok: false, error: "listing" };
  }
  return {
    ok: true,
    reaction: {
      id: crypto.randomUUID(),
      who,
      listingSlug,
      reaction: input.reaction,
      date: todayStamp(),
    },
  };
};
