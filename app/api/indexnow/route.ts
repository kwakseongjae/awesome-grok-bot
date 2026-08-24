import { NextResponse } from "next/server";
import { listPublicUrls } from "@/lib/index-urls";
import {
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  isIndexNowAuthorized,
  submitIndexNow,
} from "@/lib/indexnow";
import { SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-dynamic";

const info = async () => {
  const urls = await listPublicUrls();
  return {
    host: SITE_ORIGIN,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    urlCount: urls.length,
  };
};

export const GET = async (request: Request) => {
  const wantsSubmit =
    new URL(request.url).searchParams.get("submit") === "1" ||
    request.headers.get("x-vercel-cron") === "1" ||
    Boolean(request.headers.get("authorization"));
  if (!wantsSubmit) {
    return NextResponse.json(await info());
  }
  if (!isIndexNowAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const urls = await listPublicUrls();
  const result = await submitIndexNow(urls);
  return NextResponse.json({ ...(await info()), result });
};

export const POST = async (request: Request) => {
  if (!isIndexNowAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const urls = await listPublicUrls();
  const result = await submitIndexNow(urls);
  return NextResponse.json({ ...(await info()), result });
};
