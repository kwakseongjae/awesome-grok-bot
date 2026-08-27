import { getPublishedBot, getSeedBot } from "@/lib/bots";
import { getPool, isUndefinedTableError, query, toIsoString } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import {
  POST_LIMITS,
  VISITOR_POSTS_MIGRATION,
  clipText,
  collapseText,
  parseOptionalHttpsUrl,
  parseScore,
  parseXHandle,
} from "@/lib/post-limits";

export const REVIEW_SOURCE = "setup-bot" as const;

export type SetupBotReview = {
  id: string;
  botSlug: string;
  displayName: string;
  score: number;
  body: string;
  xHandle: string | null;
  source: typeof REVIEW_SOURCE;
  createdAt: string;
};

export type VisitorMark = {
  id: string;
  name: string;
  line: string;
  link: string | null;
  createdAt: string;
};

export type VisitorStoreStatus = {
  canRead: boolean;
  canWrite: boolean;
  missing: string[];
  migration: string;
};

export type StoreWriteError = "STORE_UNAVAILABLE" | "RATE_LIMIT" | "INVALID" | "UNKNOWN_BOT";

type ReviewRow = {
  id: string;
  bot_slug: string;
  display_name: string;
  score: number;
  body: string;
  x_handle: string | null;
  source: string;
  created_at: Date | string;
};

type MarkRow = {
  id: string;
  name: string;
  line: string;
  link: string | null;
  created_at: Date | string;
};

export const getVisitorStoreStatus = (): VisitorStoreStatus => {
  const configured = isDatabaseConfigured();
  return {
    canRead: configured,
    canWrite: configured,
    missing: configured ? [] : ["DATABASE_URL"],
    migration: VISITOR_POSTS_MIGRATION,
  };
};

const mapReview = (row: ReviewRow): SetupBotReview => ({
  id: row.id,
  botSlug: row.bot_slug,
  displayName: row.display_name,
  score: row.score,
  body: row.body,
  xHandle: row.x_handle,
  source: REVIEW_SOURCE,
  createdAt: toIsoString(row.created_at),
});

const mapMark = (row: MarkRow): VisitorMark => ({
  id: row.id,
  name: row.name,
  line: row.line,
  link: row.link,
  createdAt: toIsoString(row.created_at),
});

export const isKnownListingSlug = async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) return false;
  if (getSeedBot(slug, "en")) return true;
  return Boolean(await getPublishedBot(slug, "en"));
};

export const listSetupBotReviews = async (botSlug: string): Promise<SetupBotReview[]> => {
  try {
    const result = await query<ReviewRow>(
      `select id, bot_slug, display_name, score, body, x_handle, source, created_at
       from public.setup_bot_reviews
       where bot_slug = $1 and source = $2
       order by created_at desc
       limit 50`,
      [botSlug, REVIEW_SOURCE],
    );
    if (!result) return [];
    return result.rows.map(mapReview);
  } catch (error) {
    if (isUndefinedTableError(error)) return [];
    return [];
  }
};

export const listVisitorMarks = async (): Promise<VisitorMark[]> => {
  try {
    const result = await query<MarkRow>(
      `select id, name, line, link, created_at
       from public.visitor_marks
       order by created_at desc
       limit 100`,
    );
    if (!result) return [];
    return result.rows.map(mapMark);
  } catch (error) {
    if (isUndefinedTableError(error)) return [];
    return [];
  }
};

const recentCount = async (table: "setup_bot_reviews" | "visitor_marks", ipHash: string) => {
  const db = getPool();
  if (!db) return 0;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  try {
    const result = await db.query<{ count: number }>(
      `select count(*)::int as count
       from public.${table}
       where ip_hash = $1 and created_at >= $2`,
      [ipHash, since],
    );
    return result.rows[0]?.count ?? 0;
  } catch {
    return 0;
  }
};

const tooSoon = async (table: "setup_bot_reviews" | "visitor_marks", ipHash: string) => {
  const db = getPool();
  if (!db) return false;
  try {
    const result = await db.query<{ created_at: Date | string }>(
      `select created_at
       from public.${table}
       where ip_hash = $1
       order by created_at desc
       limit 1`,
      [ipHash],
    );
    const createdAt = result.rows[0]?.created_at;
    if (!createdAt) return false;
    return Date.now() - new Date(createdAt).getTime() < POST_LIMITS.minIntervalMs;
  } catch {
    return false;
  }
};

export const createSetupBotReview = async (input: {
  botSlug: string;
  displayName: unknown;
  score: unknown;
  body: unknown;
  xHandle: unknown;
  ipHash: string;
}): Promise<{ review: SetupBotReview } | { error: StoreWriteError }> => {
  const db = getPool();
  if (!db) return { error: "STORE_UNAVAILABLE" };

  const botSlug = collapseText(input.botSlug);
  if (!(await isKnownListingSlug(botSlug))) return { error: "UNKNOWN_BOT" };

  const displayName = clipText(input.displayName, POST_LIMITS.name.max);
  const body = clipText(input.body, POST_LIMITS.review.max);
  const score = parseScore(input.score);
  const xHandle = parseXHandle(input.xHandle);
  if (typeof input.xHandle === "string" && collapseText(input.xHandle) && !xHandle) {
    return { error: "INVALID" };
  }
  if (
    displayName.length < POST_LIMITS.name.min ||
    body.length < POST_LIMITS.review.min ||
    score === null
  ) {
    return { error: "INVALID" };
  }

  if (
    (await recentCount("setup_bot_reviews", input.ipHash)) >= POST_LIMITS.postsPerHour ||
    (await tooSoon("setup_bot_reviews", input.ipHash))
  ) {
    return { error: "RATE_LIMIT" };
  }

  try {
    const result = await db.query<ReviewRow>(
      `insert into public.setup_bot_reviews (
         bot_slug, display_name, score, body, x_handle, source, ip_hash
       ) values ($1, $2, $3, $4, $5, $6, $7)
       returning id, bot_slug, display_name, score, body, x_handle, source, created_at`,
      [botSlug, displayName, score, body, xHandle, REVIEW_SOURCE, input.ipHash],
    );
    const row = result.rows[0];
    if (!row) return { error: "INVALID" };
    return { review: mapReview(row) };
  } catch (error) {
    if (isUndefinedTableError(error)) return { error: "STORE_UNAVAILABLE" };
    return { error: "INVALID" };
  }
};

export const createVisitorMark = async (input: {
  name: unknown;
  line: unknown;
  link: unknown;
  ipHash: string;
}): Promise<{ mark: VisitorMark } | { error: StoreWriteError }> => {
  const db = getPool();
  if (!db) return { error: "STORE_UNAVAILABLE" };

  const name = clipText(input.name, POST_LIMITS.name.max);
  const line = clipText(input.line, POST_LIMITS.line.max);
  const hasLink = Boolean(collapseText(input.link));
  const link = parseOptionalHttpsUrl(input.link);
  if (hasLink && !link) return { error: "INVALID" };
  if (name.length < POST_LIMITS.name.min || line.length < POST_LIMITS.line.min) {
    return { error: "INVALID" };
  }

  if (
    (await recentCount("visitor_marks", input.ipHash)) >= POST_LIMITS.postsPerHour ||
    (await tooSoon("visitor_marks", input.ipHash))
  ) {
    return { error: "RATE_LIMIT" };
  }

  try {
    const result = await db.query<MarkRow>(
      `insert into public.visitor_marks (name, line, link, ip_hash)
       values ($1, $2, $3, $4)
       returning id, name, line, link, created_at`,
      [name, line, link, input.ipHash],
    );
    const row = result.rows[0];
    if (!row) return { error: "INVALID" };
    return { mark: mapMark(row) };
  } catch (error) {
    if (isUndefinedTableError(error)) return { error: "STORE_UNAVAILABLE" };
    return { error: "INVALID" };
  }
};
