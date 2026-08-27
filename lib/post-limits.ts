export const VISITOR_POSTS_MIGRATION = "db/migrations/20260827000001_visitor_posts.sql";

export const POST_LIMITS = {
  name: { min: 2, max: 40 },
  review: { min: 8, max: 280 },
  line: { min: 4, max: 120 },
  handle: { max: 15 },
  url: { max: 200 },
  postsPerHour: 5,
  minIntervalMs: 20_000,
} as const;

export const collapseText = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
};

export const clipText = (value: unknown, max: number) => collapseText(value).slice(0, max);

export const parseScore = (value: unknown): number | null => {
  const n = typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);
  if (!Number.isInteger(n) || n < 1 || n > 10) return null;
  return n;
};

export const parseXHandle = (value: unknown): string | null => {
  const raw = collapseText(value).replace(/^@/, "");
  if (!raw) return null;
  if (!/^[A-Za-z0-9_]{1,15}$/.test(raw)) return null;
  return raw;
};

export const parseOptionalHttpsUrl = (value: unknown): string | null => {
  const raw = collapseText(value);
  if (!raw) return null;
  if (raw.length > POST_LIMITS.url.max) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.hostname === "localhost" || url.hostname.endsWith(".local")) return null;
  return url.toString();
};

export const honeypotFilled = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;
