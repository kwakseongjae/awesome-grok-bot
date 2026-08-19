import { createBotListing, ensureProfile } from "@/lib/bots";
import { ensureListingSlug } from "@/lib/charter";
import { getAuthStatus } from "@/lib/env";
import { getServerSession } from "@/lib/session";
import { CATEGORIES, type BotDraftInput, type BotKind, type Category, type ListingLocale } from "@/lib/types";

function isKind(value: unknown): value is BotKind {
  return value === "bot" || value === "team";
}

function isCategory(value: unknown): value is Category {
  return CATEGORIES.includes(value as Category);
}

function isLocale(value: unknown): value is ListingLocale {
  return value === "ko" || value === "en";
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const status = getAuthStatus();
  if (!status.canPersistListings) {
    return Response.json(
      {
        error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as Partial<BotDraftInput> | null;
  if (!body) {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.name?.trim() || !body.summary?.trim() || !body.prompt?.trim()) {
    return Response.json({ error: "Name, summary, and charter are required." }, { status: 400 });
  }
  if (!isKind(body.kind) || !isCategory(body.category) || !isLocale(body.locale)) {
    return Response.json({ error: "Invalid kind, category, or locale." }, { status: 400 });
  }

  const profile = await ensureProfile({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  });

  try {
    const listing = await createBotListing(
      {
        name: body.name.trim(),
        slug: ensureListingSlug(body.name, body.slug),
        kind: body.kind,
        category: body.category,
        locale: body.locale,
        summary: body.summary.trim(),
        prompt: body.prompt.trim(),
        integrations: Array.isArray(body.integrations) ? body.integrations.map(String) : [],
        source_url: body.source_url || null,
        status: body.status === "published" ? "published" : "draft",
        team_members: Array.isArray(body.team_members) ? body.team_members : [],
      },
      { id: session.user.id, handle: profile.handle },
    );
    return Response.json({ listing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save.";
    return Response.json({ error: message }, { status: 400 });
  }
}
