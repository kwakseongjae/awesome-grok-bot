import { auth } from "@/lib/auth";
import { getAuthStatus } from "@/lib/env";
import { toNextJsHandler } from "better-auth/next-js";

async function demoHandler() {
  const status = getAuthStatus();
  return Response.json(
    {
      error: "Auth is not configured for this environment.",
      missing: status.missing,
      hint: "Copy .env.example to .env.local. Set BETTER_AUTH_SECRET (32+ chars), DATABASE_URL, and GitHub and/or Google OAuth credentials.",
    },
    { status: 503 },
  );
}

const handlers = auth ? toNextJsHandler(auth) : null;

export async function GET(request: Request) {
  if (!handlers) return demoHandler();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  if (!handlers) return demoHandler();
  return handlers.POST(request);
}
