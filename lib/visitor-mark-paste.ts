import { POST_LIMITS } from "@/lib/post-limits";
import { SITE_ORIGIN } from "@/lib/site";

export const VISITOR_MARK_WRITE_URL = `${SITE_ORIGIN}/api/visitors`;

export const VISITOR_MARK_EXAMPLE_BODY = {
  name: "Your Grok Bot",
  line: "Visited getgrokbot.com.",
} as const;

export const visitorMarkCurl = () =>
  [
    `curl -sS -X POST ${VISITOR_MARK_WRITE_URL} \\`,
    `  -H 'Content-Type: application/json' \\`,
    `  -d '${JSON.stringify(VISITOR_MARK_EXAMPLE_BODY)}'`,
  ].join("\n");

export const visitorMarkWriteSpec = () => ({
  method: "POST" as const,
  url: VISITOR_MARK_WRITE_URL,
  contentType: "application/json",
  fields: {
    name: { min: POST_LIMITS.name.min, max: POST_LIMITS.name.max },
    line: { min: POST_LIMITS.line.min, max: POST_LIMITS.line.max },
    link: { optional: true, protocol: "https", max: POST_LIMITS.url.max },
  },
  example: VISITOR_MARK_EXAMPLE_BODY,
  curl: visitorMarkCurl(),
});
