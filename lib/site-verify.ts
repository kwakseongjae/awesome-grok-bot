import type { Metadata } from "next";

export const googleVerification = () =>
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() ||
  "GqlV2VN7Al81ZNxIfyQufE7pOyflde0HNsSnARnGxg0";

export const naverVerification = () =>
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION?.trim() ||
  "500189af2f2284f15f65fb54616363319b3ea32d";

export const bingVerification = () =>
  process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim() || "";

export const siteVerification = (): Metadata["verification"] => {
  const google = googleVerification();
  const naver = naverVerification();
  const bing = bingVerification();
  const other: Record<string, string> = {};
  if (naver) other["naver-site-verification"] = naver;
  if (bing) other["msvalidate.01"] = bing;
  if (!google && Object.keys(other).length === 0) return undefined;
  return {
    ...(google ? { google } : {}),
    ...(Object.keys(other).length > 0 ? { other } : {}),
  };
};

export const verificationFileBody = (file: string) => {
  const name = file.replace(/\.html$/i, "").toLowerCase();
  const google = googleVerification().toLowerCase();
  const naver = naverVerification().toLowerCase();

  if (google && (name === `google${google}` || name === google)) {
    return {
      body: `google-site-verification: ${googleVerification()}\n`,
      type: "text/html; charset=utf-8",
    };
  }

  if (naver && (name === `naver${naver}` || name === naver)) {
    const token = naverVerification();
    return {
      body: `<!doctype html><html><head><meta name="naver-site-verification" content="${token}"></head><body>naver-site-verification: ${token}</body></html>\n`,
      type: "text/html; charset=utf-8",
    };
  }

  return null;
};
