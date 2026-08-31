/** Official Grok Bot public template links: https://x.ai/bot/{token} */

const SHARE_PATH = /^\/bot\/([A-Za-z0-9_-]{8,64})\/?$/;

export const grokShareUrl = (token: string) => `https://x.ai/bot/${token}`;

export const parseGrokShareUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "x.ai") return null;
    const match = SHARE_PATH.exec(url.pathname);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
};

export const isGrokShareUrl = (value: string | null | undefined): value is string =>
  Boolean(value && parseGrokShareUrl(value));

export const canonicalGrokShareUrl = (value: string) => {
  const token = parseGrokShareUrl(value);
  return token ? grokShareUrl(token) : null;
};
