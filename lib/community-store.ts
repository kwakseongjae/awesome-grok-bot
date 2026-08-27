import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import seedReviewsFile from "@/data/setup-reviews.json";
import seedPlayFile from "@/data/play-board.json";
import type {
  CommunityExtras,
  PlayGuest,
  PlayNote,
  PlayReaction,
  SetupReview,
} from "@/lib/community-types";

type SeedReviewsFile = { reviews: SetupReview[] };
type SeedPlayFile = {
  guests: PlayGuest[];
  notes: PlayNote[];
  reactions: PlayReaction[];
};

const emptyExtras = (): CommunityExtras => ({
  reviews: [],
  guests: [],
  notes: [],
  reactions: [],
});

type GlobalStore = typeof globalThis & { __agbCommunity?: CommunityExtras };

const storeGlobal = globalThis as GlobalStore;

const MAX_EXTRAS = 120;
const FILE_CANDIDATES = [
  path.join(process.cwd(), ".data", "community.json"),
  path.join("/tmp", "agb-community.json"),
];

const seedReviews = (seedReviewsFile as SeedReviewsFile).reviews;
const seedPlay = seedPlayFile as SeedPlayFile;

const seedReviewIds = new Set(seedReviews.map((item) => item.id));
const seedGuestIds = new Set(seedPlay.guests.map((item) => item.id));
const seedNoteIds = new Set(seedPlay.notes.map((item) => item.id));
const seedReactionIds = new Set(seedPlay.reactions.map((item) => item.id));

let hydrated = false;
let hydratePromise: Promise<void> | null = null;

const cap = <T,>(items: T[]) => (items.length > MAX_EXTRAS ? items.slice(0, MAX_EXTRAS) : items);

const extras = () => {
  if (!storeGlobal.__agbCommunity) {
    storeGlobal.__agbCommunity = emptyExtras();
  }
  return storeGlobal.__agbCommunity;
};

const readExtrasFile = async (filePath: string) => {
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as Partial<CommunityExtras>;
  return {
    reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
    guests: Array.isArray(parsed.guests) ? parsed.guests : [],
    notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    reactions: Array.isArray(parsed.reactions) ? parsed.reactions : [],
  } satisfies CommunityExtras;
};

const hydrate = async () => {
  if (hydrated) return;
  if (hydratePromise) {
    await hydratePromise;
    return;
  }
  hydratePromise = (async () => {
    for (const filePath of FILE_CANDIDATES) {
      try {
        const file = await readExtrasFile(filePath);
        const current = extras();
        current.reviews = mergeById(file.reviews, current.reviews, seedReviewIds);
        current.guests = mergeById(file.guests, current.guests, seedGuestIds);
        current.notes = mergeById(file.notes, current.notes, seedNoteIds);
        current.reactions = mergeById(file.reactions, current.reactions, seedReactionIds);
        hydrated = true;
        return;
      } catch {
        // try the next writable/readable candidate
      }
    }
    hydrated = true;
  })();
  await hydratePromise;
};

const mergeById = <T extends { id: string; date: string }>(incoming: T[], existing: T[], seedIds: Set<string>) => {
  const map = new Map<string, T>();
  for (const item of [...incoming, ...existing]) {
    if (!item?.id || seedIds.has(item.id)) continue;
    map.set(item.id, item);
  }
  return cap([...map.values()].sort((a, b) => compareDateId(b, a)));
};

const compareDateId = (a: { date: string; id: string }, b: { date: string; id: string }) => {
  if (a.date !== b.date) return a.date.localeCompare(b.date);
  return a.id.localeCompare(b.id);
};

const persist = async () => {
  const payload = `${JSON.stringify(extras(), null, 2)}\n`;
  for (const filePath of FILE_CANDIDATES) {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, payload, "utf8");
      return;
    } catch {
      // serverless filesystems are often read-only; memory still holds the row
    }
  }
};

const uniqueById = <T extends { id: string; date: string }>(items: T[]) => {
  const map = new Map<string, T>();
  for (const item of items) {
    if (!item?.id || map.has(item.id)) continue;
    map.set(item.id, item);
  }
  return [...map.values()].sort((a, b) => compareDateId(b, a));
};

export const listSetupReviews = async (listingSlug?: string) => {
  await hydrate();
  const list = uniqueById([
    ...extras().reviews.filter((item) => !seedReviewIds.has(item.id)),
    ...seedReviews,
  ]);
  if (!listingSlug) return list;
  return list.filter((item) => item.listingSlug === listingSlug);
};

export const addSetupReview = async (review: SetupReview) => {
  await hydrate();
  const current = extras();
  current.reviews = cap([review, ...current.reviews.filter((row) => row.id !== review.id)]);
  await persist();
  return review;
};

export const listPlayBoard = async () => {
  await hydrate();
  const extra = extras();
  return {
    guests: uniqueById([
      ...extra.guests.filter((item) => !seedGuestIds.has(item.id)),
      ...seedPlay.guests,
    ]),
    notes: uniqueById([
      ...extra.notes.filter((item) => !seedNoteIds.has(item.id)),
      ...seedPlay.notes,
    ]),
    reactions: uniqueById([
      ...extra.reactions.filter((item) => !seedReactionIds.has(item.id)),
      ...seedPlay.reactions,
    ]),
  };
};

export const addPlayGuest = async (guest: PlayGuest) => {
  await hydrate();
  const current = extras();
  current.guests = cap([guest, ...current.guests.filter((row) => row.id !== guest.id)]);
  await persist();
  return guest;
};

export const addPlayNote = async (note: PlayNote) => {
  await hydrate();
  const current = extras();
  current.notes = cap([note, ...current.notes.filter((row) => row.id !== note.id)]);
  await persist();
  return note;
};

export const addPlayReaction = async (reaction: PlayReaction) => {
  await hydrate();
  const current = extras();
  current.reactions = cap([reaction, ...current.reactions.filter((row) => row.id !== reaction.id)]);
  await persist();
  return reaction;
};
