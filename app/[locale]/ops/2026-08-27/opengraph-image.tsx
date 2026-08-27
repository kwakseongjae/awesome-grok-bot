import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DAY_ONE_RECEIPT } from "@/lib/ops";

export const alt = DAY_ONE_RECEIPT.headline;
export const size = {
  width: DAY_ONE_RECEIPT.image.width,
  height: DAY_ONE_RECEIPT.image.height,
};
export const contentType = "image/png";
export const runtime = "nodejs";

export default async function OpenGraphImage() {
  const body = await readFile(join(process.cwd(), "public/ops/2026-08-27.png"));
  return new Response(body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
