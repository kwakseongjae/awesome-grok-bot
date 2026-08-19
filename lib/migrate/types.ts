export const MIGRATE_DRAFT_KEY = "grok-bot-migrate-draft";

export type HandoffSource = "hermes" | "openclaw";

export type PacketKind = "profile" | "memory" | "skill" | "routine";

export type HandoffPacket = {
  id: string;
  kind: PacketKind;
  title: string;
  source: string;
  body: string;
  optional?: boolean;
};

export type ArchiveFile = {
  path: string;
  text: string;
};

export type HandoffListingDraft = {
  name: string;
  slug: string;
  kind: "bot";
  category: "productivity";
  locale: "ko" | "en";
  summary: string;
  prompt: string;
  integrations: string[];
  source_url: null;
  status: "draft";
  team_members: [];
};

export type ParseResult = {
  source: HandoffSource;
  packets: HandoffPacket[];
  listingDraft: HandoffListingDraft;
  skipped: string[];
  redactedCount: number;
};

export type TextFileInput = {
  name: string;
  bytes: Uint8Array;
};
