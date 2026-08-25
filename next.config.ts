import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  async rewrites() {
    return [
      { source: "/:locale/llms.txt", destination: "/api/llms/:locale" },
      { source: "/:locale/:path+/llms.txt", destination: "/api/llms/:locale/:path+" },
      { source: "/:file(google[A-Za-z0-9]+).html", destination: "/api/site-verify/:file" },
      { source: "/:file(naver[A-Za-z0-9]+).html", destination: "/api/site-verify/:file" },
    ];
  },
};

export default withNextIntl(nextConfig);
