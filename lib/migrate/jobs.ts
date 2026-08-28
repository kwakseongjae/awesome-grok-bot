export const jsonValue = (text: string) => {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
};

export const asJobList = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
  }
  if (value && typeof value === "object") {
    const root = value as Record<string, unknown>;
    const jobs = root.jobs ?? root.cron ?? root.automations;
    if (Array.isArray(jobs)) {
      return jobs.filter((item) => item && typeof item === "object") as Record<string, unknown>[];
    }
    if (typeof root.name === "string" || typeof root.prompt === "string" || typeof root.schedule === "string") {
      return [root];
    }
  }
  return [];
};

export const jobSchedule = (job: Record<string, unknown>) => {
  const schedule = job.schedule;
  if (typeof schedule === "string") return schedule;
  if (schedule && typeof schedule === "object") {
    const spec = schedule as Record<string, unknown>;
    if (typeof spec.expr === "string") return spec.expr;
    if (typeof spec.cron === "string") return spec.cron;
    if (typeof spec.every === "string") return `every ${spec.every}`;
    if (typeof spec.kind === "string" && spec.kind === "every" && spec.everyMs) {
      return `every ${spec.everyMs}ms`;
    }
    if (typeof spec.kind === "string") return spec.kind;
  }
  if (typeof job.cron === "string") return job.cron;
  if (typeof job.every === "string") return `every ${job.every}`;
  return undefined;
};

export const jobPrompt = (job: Record<string, unknown>) => {
  const payload = job.payload;
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;
    if (typeof body.message === "string") return body.message;
    if (typeof body.prompt === "string") return body.prompt;
    if (typeof body.text === "string") return body.text;
  }
  if (typeof job.prompt === "string") return job.prompt;
  if (typeof job.message === "string") return job.message;
  if (typeof job.task === "string") return job.task;
  return "";
};

export const jobName = (job: Record<string, unknown>, index: number) => {
  if (typeof job.name === "string" && job.name.trim()) return job.name.trim();
  if (typeof job.id === "string" && job.id.trim()) return job.id.trim();
  return `job-${index + 1}`;
};

export const jobSkill = (job: Record<string, unknown>) => {
  if (typeof job.skill === "string") return job.skill;
  if (Array.isArray(job.skills) && typeof job.skills[0] === "string") return job.skills[0];
  return undefined;
};
