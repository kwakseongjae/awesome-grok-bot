"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MAX_GOLD_TASKS,
  MIN_GOLD_TASKS,
  makeGoldTask,
  type GoldTask,
} from "@/lib/migrate/playbook";

type Props = {
  tasks: GoldTask[];
  onChange: (tasks: GoldTask[]) => void;
};

const FIELDS = ["name", "input", "expect", "plugins", "never"] as const;
const FIELD_KEYS = {
  name: "goldName",
  input: "goldInput",
  expect: "goldExpect",
  plugins: "goldPlugins",
  never: "goldNever",
} as const;

export const MigrateGoldTasks = ({ tasks, onChange }: Props) => {
  const t = useTranslations("migrate.playbook");

  const handleField = (id: string, field: (typeof FIELDS)[number], value: string) => {
    onChange(tasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)));
  };

  const handleAdd = () => {
    if (tasks.length >= MAX_GOLD_TASKS) return;
    onChange([...tasks, makeGoldTask()]);
  };

  const handleRemove = (id: string) => {
    onChange(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold tracking-tight">{t("goldTitle")}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("goldLead")}</p>
      </div>

      <ol className="space-y-4">
        {tasks.map((task, index) => (
          <li key={task.id} className="space-y-3 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs text-muted-foreground tabular-nums">{index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(task.id)}
                aria-label={t("goldRemove")}
              >
                {t("goldRemove")}
              </Button>
            </div>
            {FIELDS.map((field) => {
              const id = `${task.id}-${field}`;
              const isLong = field === "input" || field === "expect" || field === "never";
              return (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={id}>{t(FIELD_KEYS[field])}</Label>
                  {isLong ? (
                    <Textarea
                      id={id}
                      value={task[field]}
                      onChange={(event) => handleField(task.id, field, event.target.value)}
                      rows={2}
                    />
                  ) : (
                    <Input
                      id={id}
                      value={task[field]}
                      onChange={(event) => handleField(task.id, field, event.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </li>
        ))}
      </ol>

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        disabled={tasks.length >= MAX_GOLD_TASKS}
        aria-label={t("goldAdd")}
      >
        {t("goldAdd")}
      </Button>
      <p className="text-xs text-muted-foreground">
        {t("goldRange", { min: MIN_GOLD_TASKS, max: MAX_GOLD_TASKS, count: tasks.length })}
      </p>
    </div>
  );
};
