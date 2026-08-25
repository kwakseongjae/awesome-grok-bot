import { indexNowKeyBody } from "@/lib/indexnow";

export const GET = () =>
  new Response(indexNowKeyBody(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
