import type { AppLocale } from "@/lib/locales";

export const CATEGORIES = [
  "productivity",
  "sales",
  "marketing",
  "ops",
  "success",
  "personal",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type BotKind = "bot" | "team";
export type BotStatus = "draft" | "published";
export type ListingLocale = AppLocale;

export type TeamMember = {
  name: string;
  role: string;
  charter: string;
};

export type BotListing = {
  id: string;
  slug: string;
  name: string;
  kind: BotKind;
  category: Category;
  locale: ListingLocale;
  summary: string;
  prompt: string;
  integrations: string[];
  source_url: string | null;
  /** Official public template: https://x.ai/bot/{token}. Null = Copy into Edit Profile. */
  share_url: string | null;
  contributor_handle: string;
  status: BotStatus;
  created_by: string | null;
  added_at: string;
  copy_count: number;
  team_members: TeamMember[];
};

export type BotFilters = {
  query?: string;
  category?: Category | "all";
  integration?: string | "all";
  locale?: ListingLocale | "all";
  kind?: BotKind | "all";
};

export type BotDraftInput = {
  slug: string;
  name: string;
  kind: BotKind;
  category: Category;
  locale: ListingLocale;
  summary: string;
  prompt: string;
  integrations: string[];
  source_url?: string | null;
  share_url?: string | null;
  status: BotStatus;
  team_members: TeamMember[];
};
