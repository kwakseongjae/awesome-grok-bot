"use client";

import { useCallback, useEffect, useState } from "react";
import {
  emptyPlaybook,
  readPlaybook,
  writePlaybook,
  type PlaybookState,
} from "@/lib/migrate/playbook";

export const usePlaybook = () => {
  const [state, setState] = useState<PlaybookState>(emptyPlaybook);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readPlaybook());
    setReady(true);
  }, []);

  const save = useCallback((next: PlaybookState | ((prev: PlaybookState) => PlaybookState)) => {
    setState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      writePlaybook(value);
      return value;
    });
  }, []);

  return { state, ready, save };
};
