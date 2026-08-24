import { SITE_HOST, SITE_ORIGIN } from "@/lib/site";

export const INDEXNOW_KEY = "00f0e543c1dabc92ecf9305de5cfcee5";
export const INDEXNOW_KEY_PATH = `/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_KEY_LOCATION = `${SITE_ORIGIN}${INDEXNOW_KEY_PATH}`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export const indexNowKeyBody = () => `${INDEXNOW_KEY}\n`;

export const isIndexNowAuthorized = (request: Request) => {
  const secret = process.env.CRON_SECRET || process.env.INDEXNOW_SUBMIT_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
};

export const submitIndexNow = async (urls: string[]) => {
  const unique = [...new Set(urls)].filter((url) => url.startsWith(SITE_ORIGIN));
  if (unique.length === 0) {
    return { ok: false, status: 400, body: "no urls" };
  }

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList: unique.slice(0, 10000),
    }),
  });

  return {
    ok: response.ok,
    status: response.status,
    body: await response.text(),
    count: unique.length,
  };
};
