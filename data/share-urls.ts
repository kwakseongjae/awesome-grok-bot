import { canonicalGrokShareUrl } from "@/lib/share-link";

/**
 * Public Grok Bot template links. Issued only inside the Grok Bot app
 * (Share as template → publish → copy https://x.ai/bot/{token}).
 * This site stores the URL. It cannot mint one.
 *
 * Paste tokens here, then the listing grows an Add to Grok button.
 */
const RAW: Record<string, string> = {
  // "porter-hermes": "https://x.ai/bot/…",
  // "porter-openclaw": "https://x.ai/bot/…",
};

export const SHARE_URLS: Record<string, string> = Object.fromEntries(
  Object.entries(RAW).flatMap(([slug, url]) => {
    const canonical = canonicalGrokShareUrl(url);
    return canonical ? [[slug, canonical] as const] : [];
  }),
);
