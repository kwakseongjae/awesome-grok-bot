import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const indexNowKey = process.env.INDEXNOW_KEY?.trim();
const indexNowRewrite =
  indexNowKey && /^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)
    ? [{ source: `/${indexNowKey}.txt`, destination: "/api/indexnow/key" }]
    : [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return indexNowRewrite;
  },
};

export default withNextIntl(nextConfig);
