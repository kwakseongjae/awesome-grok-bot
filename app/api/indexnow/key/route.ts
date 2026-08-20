import { getIndexNowKey } from "@/lib/env";

export function GET() {
  const key = getIndexNowKey();
  if (!key) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(key, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
