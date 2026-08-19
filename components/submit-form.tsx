"use client";

import { useSyncExternalStore } from "react";
import { BotForm } from "@/components/bot-form";
import { MIGRATE_DRAFT_KEY } from "@/lib/migrate/types";
import type { BotDraftInput } from "@/lib/types";

type Props = {
  fallback: Partial<BotDraftInput>;
};

function subscribe() {
  return () => undefined;
}

function readDraft() {
  try {
    const raw = sessionStorage.getItem(MIGRATE_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<BotDraftInput>;
  } catch {
    return null;
  }
}

export function SubmitForm({ fallback }: Props) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const draft = mounted ? readDraft() : null;
  const initial = draft ?? fallback;

  return (
    <BotForm
      key={`${initial.slug ?? ""}-${initial.prompt?.slice(0, 24) ?? ""}`}
      initial={initial}
    />
  );
}
