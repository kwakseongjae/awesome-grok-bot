import type { HandoffSource, ParseResult } from "./types";

export const PLAYBOOK_STORAGE_KEY = "grok-bot-migrate-playbook";
export const PHASE_IDS = [0, 1, 2, 3, 4, 5, 6] as const;
export type PhaseId = (typeof PHASE_IDS)[number];

export const MIN_GOLD_TASKS = 3;
export const MAX_GOLD_TASKS = 5;

export type SkillPort = "portable" | "needs-connector" | "wont-port";

export type GoldTask = {
  id: string;
  name: string;
  input: string;
  expect: string;
  plugins: string;
  never: string;
};

export type SourceProgress = {
  completedThrough: number;
  checks: Partial<Record<PhaseId, Record<string, boolean>>>;
  parse: ParseResult | null;
  skillPorts: Record<string, SkillPort>;
  routineMap: Record<string, string>;
  leftovers: string[];
};

export type PlaybookState = {
  lastSource: HandoffSource | null;
  goldTasks: GoldTask[];
  hermes: SourceProgress;
  openclaw: SourceProgress;
};

export const PHASE_CHECK_KEYS: Record<PhaseId, readonly string[]> = {
  0: ["backup", "secretsZero", "listOk"],
  1: ["chiefCreated", "neverDo"],
  2: ["factsFile", "citesFile"],
  3: ["ranOnce", "inSlash", "wontPortListed"],
  4: ["testRun", "sourceCronOff", "underFifty"],
  5: ["pluginsLinked", "allowlistOnly"],
  6: ["goldPassed", "leftoverSigned", "sourceArchived"],
};

export const emptyProgress = (): SourceProgress => ({
  completedThrough: -1,
  checks: {},
  parse: null,
  skillPorts: {},
  routineMap: {},
  leftovers: [],
});

export const emptyPlaybook = (): PlaybookState => ({
  lastSource: null,
  goldTasks: [],
  hermes: emptyProgress(),
  openclaw: emptyProgress(),
});

export const isPhaseId = (value: unknown): value is PhaseId =>
  typeof value === "number" && (PHASE_IDS as readonly number[]).includes(value);

export const parsePhaseParam = (value: string): PhaseId | null => {
  if (!/^[0-6]$/.test(value)) return null;
  return Number(value) as PhaseId;
};

export const canEnterPhase = (progress: SourceProgress, phase: PhaseId) =>
  progress.completedThrough >= phase - 1;

export const goldTasksReady = (tasks: GoldTask[]) => {
  const filled = tasks.filter((task) => task.name.trim() && task.input.trim() && task.expect.trim());
  return filled.length >= MIN_GOLD_TASKS && filled.length <= MAX_GOLD_TASKS;
};

export const GOLD_TASKS_MISSING = "gold-tasks-missing" as const;

/** Phase 1 does not start without 3–5 gold tasks. Do not invent them. */
export const phase1StopReason = (tasks: GoldTask[] = []) =>
  goldTasksReady(tasks) ? null : GOLD_TASKS_MISSING;

export const phaseChecksComplete = (progress: SourceProgress, phase: PhaseId) =>
  PHASE_CHECK_KEYS[phase].every((key) => progress.checks[phase]?.[key] === true);

export const makeGoldTask = (): GoldTask => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `gold-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  name: "",
  input: "",
  expect: "",
  plugins: "",
  never: "",
});

const asProgress = (value: unknown): SourceProgress => {
  const parsed = (value ?? {}) as Partial<SourceProgress>;
  return {
    ...emptyProgress(),
    ...parsed,
    checks: parsed.checks ?? {},
    skillPorts: parsed.skillPorts ?? {},
    routineMap: parsed.routineMap ?? {},
    leftovers: parsed.leftovers ?? [],
    completedThrough:
      typeof parsed.completedThrough === "number" ? parsed.completedThrough : -1,
  };
};

export const readPlaybook = (): PlaybookState => {
  if (typeof window === "undefined") return emptyPlaybook();
  try {
    const raw = window.localStorage.getItem(PLAYBOOK_STORAGE_KEY);
    if (!raw) return emptyPlaybook();
    const parsed = JSON.parse(raw) as Partial<PlaybookState> & {
      source?: HandoffSource | null;
      completedThrough?: number;
      checks?: SourceProgress["checks"];
      parse?: ParseResult | null;
      skillPorts?: Record<string, SkillPort>;
      routineMap?: Record<string, string>;
      leftovers?: string[];
    };
    const base = emptyPlaybook();
    if (parsed.hermes || parsed.openclaw) {
      return {
        lastSource: parsed.lastSource ?? parsed.source ?? null,
        goldTasks: Array.isArray(parsed.goldTasks) ? parsed.goldTasks : [],
        hermes: asProgress(parsed.hermes),
        openclaw: asProgress(parsed.openclaw),
      };
    }
    const legacy = asProgress(parsed);
    const source = parsed.source ?? parsed.lastSource ?? null;
    return {
      ...base,
      lastSource: source,
      goldTasks: Array.isArray(parsed.goldTasks) ? parsed.goldTasks : [],
      hermes: source === "hermes" ? legacy : base.hermes,
      openclaw: source === "openclaw" ? legacy : base.openclaw,
    };
  } catch {
    return emptyPlaybook();
  }
};

export const writePlaybook = (state: PlaybookState) => {
  window.localStorage.setItem(PLAYBOOK_STORAGE_KEY, JSON.stringify(state));
};

export const exportPlaybook = (state: PlaybookState) =>
  JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2);

export const patchSource = (
  state: PlaybookState,
  source: HandoffSource,
  patch: Partial<SourceProgress> | ((current: SourceProgress) => SourceProgress),
): PlaybookState => {
  const current = state[source];
  const next = typeof patch === "function" ? patch(current) : { ...current, ...patch };
  return { ...state, lastSource: source, [source]: next };
};
