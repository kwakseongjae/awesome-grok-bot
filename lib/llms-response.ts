import { NextResponse } from "next/server";
import { renderLlmsDocument } from "@/lib/llms";

export const llmsResponse = async (segments: string[], full = false) => {
  const body = await renderLlmsDocument(segments, full);
  if (!body) {
    return new NextResponse("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
