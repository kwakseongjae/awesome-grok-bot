import { countBucket, event, lenBucket } from "@/lib/gtag";

export type CopyKind = "listing" | "team" | "member" | "starter" | "install" | "template";

export const trackAddToGrok = (args: { source: "listing" | "community" }) => {
  event("agb_add_to_grok", {
    content_type: args.source,
  });
};

export const trackBiblePrint = () => {
  event("agb_bible_print", { content_type: "101" });
};

export const trackListingCopy = (args: { kind: CopyKind; has_bot_id: boolean }) => {
  event("agb_copy", {
    copy_kind: args.kind,
    has_bot_id: args.has_bot_id,
  });
};

export const trackDirectorySearch = (args: {
  queryLen: number;
  resultCount: number;
  category: string;
  integration: string;
  kind: string;
}) => {
  event("search", {
    search_term_len_bucket: lenBucket(args.queryLen),
    result_count_bucket: countBucket(args.resultCount),
    category: args.category,
    has_integration_filter: args.integration !== "all",
    kind_filter: args.kind,
  });
};

export const trackShare = (args: { method: "web_share" | "clipboard" }) => {
  event("share", {
    method: args.method,
    content_type: "listing",
  });
};
