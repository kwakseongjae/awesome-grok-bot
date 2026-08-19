import { extractPublicPage } from "@/lib/extract-page";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: string } | null;
  if (!body?.url) {
    return Response.json({ error: "URL is required." }, { status: 400 });
  }

  try {
    const page = await extractPublicPage(body.url);
    return Response.json(page);
  } catch (error) {
    const code = error instanceof Error ? error.message : "FETCH_FAILED";
    return Response.json(
      { error: code, hint: "Could not fetch that public page. Fill the form yourself." },
      { status: 422 },
    );
  }
}
