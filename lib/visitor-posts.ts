import { getPublishedBot, getSeedBot } from "@/lib/bots";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/env";
import {
  POST_LIMITS,
  VISITOR_POSTS_MIGRATION,
  clipText,
  collapseText,
  parseOptionalHttpsUrl,
  parseScore,
  parseXHandle,
} from "@/lib/post-limits";
import { createAdminClient, createAnonClient } from "@/lib/supabase";

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
  created_at: string;
};

type MarkRow = {
  id: string;
  name: string;
  line: string;
  link: string | null;
  created_at: string;
};

export const getVisitorStoreStatus = (): VisitorStoreStatus => {
  const canWrite = isSupabaseAdminConfigured();
  const canRead = isSupabaseConfigured() || canWrite;
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!canWrite) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return {
    canRead,
    canWrite,
    missing: [...new Set(missing)],
    migration: VISITOR_POSTS_MIGRATION,
  };
};

const reader = () => createAdminClient() ?? createAnonClient();

const isMissingRelation = (message: string | undefined) =>
  Boolean(message && /does not exist|schema cache|could not find the table/i.test(message));

const mapReview = (row: ReviewRow): SetupBotReview => ({
  id: row.id,
  botSlug: row.bot_slug,
  displayName: row.display_name,
  score: row.score,
  body: row.body,
  xHandle: row.x_handle,
  source: REVIEW_SOURCE,
  createdAt: row.created_at,
});

const mapMark = (row: MarkRow): VisitorMark => ({
  id: row.id,
  name: row.name,
  line: row.line,
  link: row.link,
  createdAt: row.created_at,
});

export const isKnownListingSlug = async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80) return false;
  if (getSeedBot(slug, "en")) return true;
  return Boolean(await getPublishedBot(slug, "en"));
};

export const listSetupBotReviews = async (botSlug: string): Promise<SetupBotReview[]> => {
  const client = reader();
  if (!client) return [];
  const { data, error } = await client
    .from("setup_bot_reviews")
    .select("id, bot_slug, display_name, score, body, x_handle, source, created_at")
    .eq("bot_slug", botSlug)
    .eq("source", REVIEW_SOURCE)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error || !data) return [];
  return (data as ReviewRow[]).map(mapReview);
};

export const listVisitorMarks = async (): Promise<VisitorMark[]> => {
  const client = reader();
  if (!client) return [];
  const { data, error } = await client
    .from("visitor_marks")
    .select("id, name, line, link, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return (data as MarkRow[]).map(mapMark);
};

const recentCount = async (table: "setup_bot_reviews" | "visitor_marks", ipHash: string) => {
  const admin = createAdminClient();
  if (!admin) return 0;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await admin
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if (error) return 0;
  return count ?? 0;
};

const tooSoon = async (table: "setup_bot_reviews" | "visitor_marks", ipHash: string) => {
  const admin = createAdminClient();
  if (!admin) return false;
  const { data, error } = await admin
    .from(table)
    .select("created_at")
    .eq("ip_hash", ipHash)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data?.created_at) return false;
  return Date.now() - new Date(data.created_at).getTime() < POST_LIMITS.minIntervalMs;
};

export const createSetupBotReview = async (input: {
  botSlug: string;
  displayName: unknown;
  score: unknown;
  body: unknown;
  xHandle: unknown;
  ipHash: string;
}): Promise<{ review: SetupBotReview } | { error: StoreWriteError }> => {
  const admin = createAdminClient();
  if (!admin) return { error: "STORE_UNAVAILABLE" };

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

  const { data, error } = await admin
    .from("setup_bot_reviews")
    .insert({
      bot_slug: botSlug,
      display_name: displayName,
      score,
      body,
      x_handle: xHandle,
      source: REVIEW_SOURCE,
      ip_hash: input.ipHash,
    })
    .select("id, bot_slug, display_name, score, body, x_handle, source, created_at")
    .single();

  if (error || !data) {
    if (isMissingRelation(error?.message)) return { error: "STORE_UNAVAILABLE" };
    return { error: "INVALID" };
  }
  return { review: mapReview(data as ReviewRow) };
};

export const createVisitorMark = async (input: {
  name: unknown;
  line: unknown;
  link: unknown;
  ipHash: string;
}): Promise<{ mark: VisitorMark } | { error: StoreWriteError }> => {
  const admin = createAdminClient();
  if (!admin) return { error: "STORE_UNAVAILABLE" };

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

  const { data, error } = await admin
    .from("visitor_marks")
    .insert({
      name,
      line,
      link,
      ip_hash: input.ipHash,
    })
    .select("id, name, line, link, created_at")
    .single();

  if (error || !data) {
    if (isMissingRelation(error?.message)) return { error: "STORE_UNAVAILABLE" };
    return { error: "INVALID" };
  }
  return { mark: mapMark(data as MarkRow) };
};
