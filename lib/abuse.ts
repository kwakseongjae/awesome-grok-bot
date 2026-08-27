import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { POST_LIMITS } from "@/lib/post-limits";
import { SITE_HOST } from "@/lib/site";

type Bucket = { timestamps: number[] };
const memoryBuckets = new Map<string, Bucket>();

export const takeMemoryRateLimit = (key: string) => {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const bucket = memoryBuckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((stamp) => stamp > hourAgo);
  const last = bucket.timestamps.at(-1);
  if (last && now - last < POST_LIMITS.minIntervalMs) return false;
  if (bucket.timestamps.length >= POST_LIMITS.postsPerHour) return false;
  bucket.timestamps.push(now);
  memoryBuckets.set(key, bucket);
  return true;
};

export const clientIp = async () => {
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headerList.get("x-real-ip") || headerList.get("cf-connecting-ip") || "unknown";
};

export const hashIp = (ip: string) => {
  const salt = process.env.BETTER_AUTH_SECRET || SITE_HOST;
  return createHash("sha256").update(`${salt}|${ip}`).digest("hex");
};
