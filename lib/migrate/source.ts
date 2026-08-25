import type { HandoffSource } from "@/lib/migrate/types";

export const HANDOFF_SOURCES = ["hermes", "openclaw"] as const;

export const isHandoffSource = (value: string): value is HandoffSource =>
  (HANDOFF_SOURCES as readonly string[]).includes(value);

export const sourceLabel = (source: HandoffSource) =>
  source === "hermes" ? "Hermes" : "OpenClaw";
