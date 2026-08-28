import type { ListingLocale } from "@/lib/types";

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
  locale: ListingLocale;
  summary: string;
  prompt: string;
  integrations: string[];
  source_url: null;
  status: "draft";
  team_members: [];
};

export type InventoryIdentityFile = {
  name: string;
  present: boolean;
};

export type InventorySkill = {
  name: string;
  path: string;
};

export type InventoryRoutine = {
  name: string;
  schedule: string | null;
  source: string;
};

export type InventoryTool = {
  name: string;
  state: "configured";
};

export type InventoryMemory = {
  standingFiles: string[];
  standingEntries: number;
  dailyNotes: string[];
  dreams: string[];
  heartbeat: boolean;
};

export type Phase0Inventory = {
  source: HandoffSource;
  identity: InventoryIdentityFile[];
  memory: InventoryMemory;
  skills: InventorySkill[];
  routines: InventoryRoutine[];
  tools: InventoryTool[];
  skippedSecrets: string[];
  skippedOther: string[];
  goldTasksPrompt: string;
  grokTouched: false;
  table: string;
};

export type ParseResult = {
  source: HandoffSource;
  packets: HandoffPacket[];
  listingDraft: HandoffListingDraft;
  skipped: string[];
  redactedCount: number;
  inventory?: Phase0Inventory;
};

export type TextFileInput = {
  name: string;
  bytes: Uint8Array;
};
