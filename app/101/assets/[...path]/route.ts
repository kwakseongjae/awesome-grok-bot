import { readFileSync } from "node:fs";
import { join, normalize } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ path: string[] }> };

const TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
};

export async function GET(_req: Request, { params }: Props) {
  const { path } = await params;
  const rel = path.join("/");
  if (path.some((part) => part === ".." || part === "")) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!/^[A-Za-z0-9._/-]+$/.test(rel)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const ext = rel.split(".").pop()?.toLowerCase() ?? "";
  const type = TYPE[ext];
  if (!type) return new NextResponse("Not found", { status: 404 });
  const root = join(process.cwd(), "content/101/assets");
  const file = join(root, rel);
  if (!normalize(file).startsWith(normalize(root))) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const buf = readFileSync(file);
    return new NextResponse(buf, { headers: { "Content-Type": type } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
