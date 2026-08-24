import type { MetadataRoute } from "next";
import { SHOW_ACCOUNT_CHROME, SITE_ORIGIN } from "@/lib/site";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
  "BraveBot",
  "Yeti",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: SHOW_ACCOUNT_CHROME
          ? ["/api/auth", "/*/sign-in"]
          : ["/api/auth", "/*/sign-in", "/*/submit", "/*/from-link"],
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
      })),
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
