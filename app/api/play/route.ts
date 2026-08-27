import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { addPlayGuest, addPlayNote, addPlayReaction, listPlayBoard } from "@/lib/community-store";
import { buildPlayGuest, buildPlayNote, buildPlayReaction } from "@/lib/play-parse";
import { allowRequest, clientKey } from "@/lib/rate-limit";
import { isHoneypotFilled } from "@/lib/text-line";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const board = await listPlayBoard();
  return NextResponse.json(board);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (isHoneypotFilled(body.company)) {
    return NextResponse.json({ ok: true });
  }
  if (!allowRequest(`play:${clientKey(request)}`)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  const action = body.action;
  if (action === "invite") {
    const parsed = buildPlayGuest({ name: body.name, job: body.job });
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    const guest = await addPlayGuest(parsed.guest);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, guest });
  }
  if (action === "note") {
    const parsed = buildPlayNote({ who: body.who, body: body.body });
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    const note = await addPlayNote(parsed.note);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, note });
  }
  if (action === "react") {
    const parsed = await buildPlayReaction({
      who: body.who,
      listingSlug: body.listingSlug,
      reaction: body.reaction,
    });
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    const reaction = await addPlayReaction(parsed.reaction);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, reaction });
  }

  return NextResponse.json({ ok: false, error: "action" }, { status: 400 });
}
