import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { clientIp, hashIp, takeMemoryRateLimit } from "@/lib/abuse";
import { LOCALES } from "@/lib/locales";
import { honeypotFilled } from "@/lib/post-limits";
import { createSetupBotReview, getVisitorStoreStatus } from "@/lib/visitor-posts";

type Body = {
  botSlug?: unknown;
  displayName?: unknown;
  score?: unknown;
  body?: unknown;
  xHandle?: unknown;
  website?: unknown;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as Body | null;
  if (!payload) {
    return NextResponse.json({ error: "INVALID" }, { status: 400 });
  }
  if (honeypotFilled(payload.website)) {
    return NextResponse.json({ ok: true });
  }

  const status = getVisitorStoreStatus();
  if (!status.canWrite) {
    return NextResponse.json(
      { error: "STORE_UNAVAILABLE", missing: status.missing, migration: status.migration },
      { status: 503 },
    );
  }

  const ip = await clientIp();
  const ipHash = hashIp(ip);
  if (!takeMemoryRateLimit(`review:${ipHash}`)) {
    return NextResponse.json({ error: "RATE_LIMIT" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  const result = await createSetupBotReview({
    botSlug: typeof payload.botSlug === "string" ? payload.botSlug : "",
    displayName: payload.displayName,
    score: payload.score,
    body: payload.body,
    xHandle: payload.xHandle,
    ipHash,
  });

  if ("error" in result) {
    const statusCode =
      result.error === "STORE_UNAVAILABLE" ? 503 : result.error === "RATE_LIMIT" ? 429 : 400;
    return NextResponse.json(
      {
        error: result.error,
        missing: result.error === "STORE_UNAVAILABLE" ? status.missing : undefined,
        migration: result.error === "STORE_UNAVAILABLE" ? status.migration : undefined,
      },
      { status: statusCode, headers: result.error === "RATE_LIMIT" ? { "Retry-After": "60" } : undefined },
    );
  }

  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/bots/${result.review.botSlug}`);
    revalidatePath(`/${locale}/reviews`);
  }
  return NextResponse.json({ review: result.review });
}
