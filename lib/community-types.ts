export type ReviewKind = "bot" | "human";
export type PlayReactionKind = "used" | "keep" | "skip";

export type SetupReview = {
  id: string;
  listingSlug: string;
  score: number;
  take: string;
  who: string;
  kind: ReviewKind;
  date: string;
};

export type PlayGuest = {
  id: string;
  name: string;
  job: string;
  date: string;
};

export type PlayNote = {
  id: string;
  who: string;
  body: string;
  date: string;
};

export type PlayReaction = {
  id: string;
  who: string;
  listingSlug: string;
  reaction: PlayReactionKind;
  date: string;
};

export type CommunityExtras = {
  reviews: SetupReview[];
  guests: PlayGuest[];
  notes: PlayNote[];
  reactions: PlayReaction[];
};

export const PLAY_ADDED_EVENT = "agb:play-added";
export const PLAY_UPDATED_AT = "2026-08-27";
