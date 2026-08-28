import type { BotListing } from "@/lib/types";
import {
  listAllSetupBotReviews,
  listVisitorMarks,
  type SetupBotReview,
  type VisitorMark,
} from "@/lib/visitor-posts";

export type ReturningHook =
  | { kind: "mark"; mark: VisitorMark }
  | { kind: "review"; review: SetupBotReview }
  | { kind: "paste"; date: string; listing: BotListing };

export const utcDayStamp = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const pickTodaysPaste = (listings: BotListing[], date: Date) => {
  if (listings.length === 0) return null;
  const stamp = utcDayStamp(date);
  const sorted = [...listings].sort((a, b) => a.slug.localeCompare(b.slug, "en"));
  const [year, month, day] = stamp.split("-").map(Number) as [number, number, number];
  const epochDay = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
  const listing = sorted[epochDay % sorted.length];
  if (!listing) return null;
  return { date: stamp, listing };
};

export const getReturningHook = async (
  listings: BotListing[],
  date = new Date(),
): Promise<ReturningHook | null> => {
  const [marks, reviews] = await Promise.all([listVisitorMarks(), listAllSetupBotReviews()]);
  const mark = marks[0];
  if (mark) return { kind: "mark", mark };
  const review = reviews[0];
  if (review) return { kind: "review", review };
  const paste = pickTodaysPaste(listings, date);
  if (paste) return { kind: "paste", date: paste.date, listing: paste.listing };
  return null;
};
