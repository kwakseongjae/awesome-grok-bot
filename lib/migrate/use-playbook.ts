"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  emptyPlaybook,
  readPlaybook,
  subscribePlaybook,
  writePlaybook,
  type PlaybookState,
} from "@/lib/migrate/playbook";

export const usePlaybook = () => {
  const state = useSyncExternalStore(subscribePlaybook, readPlaybook, emptyPlaybook);

  const save = useCallback((next: PlaybookState | ((prev: PlaybookState) => PlaybookState)) => {
    const current = readPlaybook();
    writePlaybook(typeof next === "function" ? next(current) : next);
  }, []);

  return { state, ready: true, save };
};
