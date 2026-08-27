const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 8;

type GlobalHits = typeof globalThis & { __agbRate?: Map<string, number[]> };

const hits = () => {
  const g = globalThis as GlobalHits;
  if (!g.__agbRate) g.__agbRate = new Map();
  return g.__agbRate;
};

export const allowRequest = (key: string) => {
  const now = Date.now();
  const bucket = hits();
  const recent = (bucket.get(key) ?? []).filter((stamp) => now - stamp < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    bucket.set(key, recent);
    return false;
  }
  recent.push(now);
  bucket.set(key, recent);
  return true;
};

export const clientKey = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
};
