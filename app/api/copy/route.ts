import { incrementCopyCount } from "@/lib/bots";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { botId?: string } | null;
  if (!body?.botId) {
    return Response.json({ ok: false }, { status: 400 });
  }
  await incrementCopyCount(body.botId);
  return Response.json({ ok: true });
}
