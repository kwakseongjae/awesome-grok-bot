import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyPlaybook,
  getServerPlaybook,
  readPlaybook,
  writePlaybook,
} from "@/lib/migrate/playbook";

test("playbook getSnapshot is referentially stable", () => {
  assert.equal(getServerPlaybook(), getServerPlaybook());
  assert.equal(readPlaybook(), readPlaybook());
  assert.equal(readPlaybook(), getServerPlaybook());
});

test("readPlaybook caches writes so useSyncExternalStore cannot loop", () => {
  const mem = new Map<string, string>();
  const previous = (globalThis as { window?: unknown }).window;
  (globalThis as { window: object }).window = {
    localStorage: {
      getItem: (key: string) => mem.get(key) ?? null,
      setItem: (key: string, value: string) => {
        mem.set(key, value);
      },
    },
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  try {
    const first = readPlaybook();
    assert.equal(readPlaybook(), first);
    const next = { ...emptyPlaybook(), lastSource: "hermes" as const };
    writePlaybook(next);
    assert.equal(readPlaybook(), next);
    assert.equal(readPlaybook(), readPlaybook());
  } finally {
    if (previous === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window: unknown }).window = previous;
    }
  }
});
