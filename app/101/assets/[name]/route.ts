import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ name: string }> };

const TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
};

export async function GET(_req: Request, { params }: Props) {
  const { name } = await params;
  if (!/^[A-Za-z0-9._-]+$/.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const type = TYPE[ext];
  if (!type) return new NextResponse("Not found", { status: 404 });
  try {
    const buf = readFileSync(join(process.cwd(), "content/101/assets", name));
    return new NextResponse(buf, { headers: { "Content-Type": type } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
