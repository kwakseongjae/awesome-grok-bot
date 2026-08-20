"use client";

import { sendGTMEvent } from "@next/third-parties/google";

function canTrack() {
  return Boolean(process.env.NEXT_PUBLIC_GTM_ID?.startsWith("GTM-"));
}

export function trackCopy(args: { action: "copy" | "copy_all"; kind: "bot" | "team" }) {
  if (!canTrack()) return;
  sendGTMEvent({
    event: "agb_copy",
    action: args.action,
    kind: args.kind,
  });
}

export function trackSignIn(args: { provider: "github" | "google" }) {
  if (!canTrack()) return;
  sendGTMEvent({
    event: "agb_sign_in",
    method: args.provider,
  });
}
