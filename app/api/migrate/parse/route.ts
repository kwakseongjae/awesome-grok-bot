import { collectArchiveFiles } from "@/lib/migrate/archive";
import { buildHandoff } from "@/lib/migrate/parse";
import { getAuthStatus } from "@/lib/env";
import { getServerSession } from "@/lib/session";
import type { HandoffSource } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 4_000_000;
const MAX_FILES = 40;

function isSource(value: FormDataEntryValue | null): value is HandoffSource {
  return value === "hermes" || value === "openclaw";
}

function isLocale(value: FormDataEntryValue | null): value is ListingLocale {
  return value === "ko" || value === "en";
}

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    const status = getAuthStatus();
    return Response.json(
      {
        error: "Sign in required.",
        missing: status.missing,
      },
      { status: 401 },
    );
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const source = form.get("source");
  const locale = form.get("locale");
  if (!isSource(source) || !isLocale(locale)) {
    return Response.json({ error: "Invalid source or locale." }, { status: 400 });
  }

  const uploads = form.getAll("files").filter((entry): entry is File => entry instanceof File);
  if (uploads.length === 0) {
    return Response.json({ error: "No files." }, { status: 400 });
  }
  if (uploads.length > MAX_FILES) {
    return Response.json({ error: "Too many files." }, { status: 400 });
  }

  const total = uploads.reduce((sum, file) => sum + file.size, 0);
  if (total > MAX_UPLOAD_BYTES) {
    return Response.json({ error: "Upload too large." }, { status: 400 });
  }

  const inputs = await Promise.all(
    uploads.map(async (file) => ({
      name: file.name,
      bytes: new Uint8Array(await file.arrayBuffer()),
    })),
  );

  const collected = await collectArchiveFiles(inputs);
  const parsed = buildHandoff(collected.files, source, locale);
  return Response.json({
    ...parsed,
    skipped: collected.skipped,
    redactedCount: collected.redactedCount,
  });
}
