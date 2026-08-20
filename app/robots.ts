import type { MetadataRoute } from "next";
import { getAppHost, getAppUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const origin = getAppUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${origin}/sitemap.xml`,
    host: getAppHost(),
  };
}
