import { getAppHost, getAppUrl, getIndexNowKey } from "@/lib/env";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export function listingUrl(locale: string, slug: string) {
  return `${getAppUrl()}/${locale}/bots/${slug}`;
}

export async function notifyIndexNow(urls: string[]) {
  const key = getIndexNowKey();
  if (!key || urls.length === 0) return;

  const unique = [...new Set(urls)].slice(0, 10_000);
  await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: getAppHost(),
      key,
      urlList: unique,
    }),
  }).catch(() => {
    // IndexNow is best-effort; listing writes should not fail on ping errors.
  });
}
