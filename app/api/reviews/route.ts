import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { addSetupReview, listSetupReviews } from "@/lib/community-store";
import { allowRequest, clientKey } from "@/lib/rate-limit";
import { buildSetupReview } from "@/lib/review-parse";
import { isHoneypotFilled } from "@/lib/text-line";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug") ?? undefined;
  const reviews = await listSetupReviews(slug || undefined);
  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (isHoneypotFilled(body.company)) {
    return NextResponse.json({ ok: true });
  }
  if (!allowRequest(`review:${clientKey(request)}`)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }
  const parsed = await buildSetupReview({
    listingSlug: body.listingSlug,
    score: body.score,
    take: body.take,
    who: body.who,
    kind: body.kind,
  });
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const review = await addSetupReview(parsed.review);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, review });
}
