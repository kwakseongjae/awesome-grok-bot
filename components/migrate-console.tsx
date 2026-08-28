"use client";

import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { HandoffQueue } from "@/components/handoff-queue";
import { MigrateHandoverAppendix } from "@/components/migrate-handover-appendix";
import { MigrateInventory } from "@/components/migrate-inventory";
import { MigrateUpload } from "@/components/migrate-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handoverPrompt } from "@/lib/migrate/handover-prompt";
import { phasePrompt } from "@/lib/migrate/phase-prompts";
import {
  PHASE_CHECK_KEYS,
  PHASE_IDS,
  patchSource,
  phaseChecksComplete,
  type PhaseId,
  type SkillPort,
} from "@/lib/migrate/playbook";
import { sourceLabel } from "@/lib/migrate/source";
import { usePlaybook } from "@/lib/migrate/use-playbook";
import type { HandoffSource, ParseResult } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  source: HandoffSource;
  phase: PhaseId;
};

const PORTS: SkillPort[] = ["portable", "needs-connector", "wont-port"];

export function MigrateConsole({ source, phase }: Props) {
  const t = useTranslations("migrate");
  const locale = useLocale() as ListingLocale;
  const router = useRouter();
  const { state, ready, save } = usePlaybook();
  const progress = state[source];
  const checks = PHASE_CHECK_KEYS[phase];
  const checked = phaseChecksComplete(progress, phase);
  const label = sourceLabel(source);

  const skillPackets = useMemo(
    () => progress.parse?.packets.filter((packet) => packet.kind === "skill") ?? [],
    [progress.parse],
  );
  const routinePackets = useMemo(
    () => progress.parse?.packets.filter((packet) => packet.kind === "routine") ?? [],
    [progress.parse],
  );

  const prompts = phasePrompt({
    source,
    phase,
    locale,
    goldNames: state.goldTasks.map((task) => task.name).filter(Boolean),
    skillTitles: skillPackets.map((packet) => packet.title),
  });

  useEffect(() => {
    if (!ready || state.lastSource === source) return;
    save((prev) => ({ ...prev, lastSource: source }));
  }, [ready, save, source, state.lastSource]);

  const handleCheck = (key: string, value: boolean) => {
    save((prev) =>
      patchSource(prev, source, (current) => ({
        ...current,
        checks: {
          ...current.checks,
          [phase]: { ...current.checks[phase], [key]: value },
        },
      })),
    );
  };

  const handleParsed = (parse: ParseResult) => {
    save((prev) => patchSource(prev, source, { parse }));
  };

  const handlePort = (id: string, port: SkillPort) => {
    save((prev) =>
      patchSource(prev, source, (current) => ({
        ...current,
        skillPorts: { ...current.skillPorts, [id]: port },
      })),
    );
  };

  const handleRoutineMap = (id: string, skill: string) => {
    save((prev) =>
      patchSource(prev, source, (current) => ({
        ...current,
        routineMap: { ...current.routineMap, [id]: skill },
      })),
    );
  };

  const handleLeftovers = (value: string) => {
    save((prev) =>
      patchSource(prev, source, {
        leftovers: value.split("\n").map((line) => line.trim()).filter(Boolean),
      }),
    );
  };

  const handleComplete = () => {
    if (!checked) {
      toast.error(t("playbook.completeNeed"));
      return;
    }

    const wontPort = skillPackets
      .filter((packet) => progress.skillPorts[packet.id] === "wont-port")
      .map((packet) => `won't-port: ${packet.title}`);

    save((prev) =>
      patchSource(prev, source, (current) => ({
        ...current,
        completedThrough: Math.max(current.completedThrough, phase),
        leftovers: [...new Set([...current.leftovers, ...wontPort])],
      })),
    );

    if (phase === 6) {
      toast.success(t("playbook.finished"));
      return;
    }
    router.push(`/migrate/${source}/${phase + 1}`);
  };

  if (!ready) {
    return <p className="text-sm text-muted-foreground">{t("playbook.loading")}</p>;
  }

  return (
    <div className="space-y-8">
      <p className="rounded-lg border bg-card px-4 py-3 text-sm leading-6">{t("desk.runbookBanner")}</p>

      <p className="text-sm">
        <Link href={`/migrate/${source}`} className="underline-offset-4 hover:underline">
          {t("desk.backSkill")}
        </Link>
      </p>

      <nav aria-label={t("playbook.phaseNav")}>
        <ol className="flex flex-wrap gap-2">
          {PHASE_IDS.map((id) => (
            <li key={id}>
              <Link
                href={`/migrate/${source}/${id}`}
                aria-current={id === phase ? "step" : undefined}
                className={cn(
                  "inline-flex h-8 items-center rounded-md border px-2.5 text-sm hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50",
                  id === phase ? "border-foreground bg-foreground text-background" : "",
                )}
              >
                {id} {t(`playbook.phases.${id}.title`)}
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      <header className="space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("playbook.phaseOf", { phase, source: label })}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{t(`playbook.phases.${phase}.title`)}</h1>
        <p className="text-sm leading-6">
          <span className="font-medium">{t("playbook.actor")}</span>{" "}
          {t(`playbook.phases.${phase}.actor`, { source: label })}
        </p>
        <p className="text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">{t("playbook.fail")}</span>{" "}
          {t(`playbook.phases.${phase}.fail`)}
        </p>
      </header>

      <>
          {phase === 0 ? (
            <section className="space-y-3">
              <p className="text-sm leading-6 text-muted-foreground">{t(`accept.${source}`)}</p>
              {source === "openclaw" ? (
                <p className="text-sm leading-6 text-muted-foreground">{t("playbook.tidyOpenclaw")}</p>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">{t("playbook.inventoryHermes")}</p>
              )}
              <MigrateUpload source={source} onParsed={handleParsed} showQueue={false} />
              {progress.parse?.inventory ? <MigrateInventory inventory={progress.parse.inventory} /> : null}
              {progress.parse ? (
                <HandoffQueue
                  source={progress.parse.source}
                  packets={progress.parse.packets}
                  listingDraft={progress.parse.listingDraft}
                  skipped={progress.parse.skipped}
                  redactedCount={progress.parse.redactedCount}
                />
              ) : null}
            </section>
          ) : null}

          <section className="space-y-3 rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold tracking-tight">{t("playbook.copyA", { source: label })}</h2>
              <CopyButton
                text={prompts.source}
                label={t("copy")}
                copiedLabel={t("copied")}
                ariaLabel={t("playbook.copyAAria", { source: label })}
                size="sm"
              />
            </div>
            <pre className="max-h-80 overflow-auto text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
              {prompts.source}
            </pre>
          </section>

          {prompts.chief ? (
            <section className="space-y-3 rounded-lg border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-tight">{t("playbook.copyB")}</h2>
                <CopyButton
                  text={prompts.chief}
                  label={t("copy")}
                  copiedLabel={t("copied")}
                  ariaLabel={t("playbook.copyBAria")}
                  size="sm"
                />
              </div>
              <pre className="max-h-80 overflow-auto text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
                {prompts.chief}
              </pre>
            </section>
          ) : (
            <p className="text-sm text-muted-foreground">{t("playbook.noChiefYet")}</p>
          )}

          {phase === 2 ? <p className="text-sm leading-6 text-muted-foreground">{t("playbook.factsNote")}</p> : null}

          {phase === 3 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold tracking-tight">{t("playbook.skillsTitle")}</h2>
              {skillPackets.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("playbook.needParse")}</p>
              ) : (
                <ul className="space-y-3">
                  {skillPackets.map((packet) => (
                    <li key={packet.id} className="flex flex-col gap-2 rounded-lg border bg-card p-3 sm:flex-row sm:items-center">
                      <p className="min-w-0 flex-1 text-sm">{packet.title}</p>
                      <Select
                        value={progress.skillPorts[packet.id] ?? "portable"}
                        onValueChange={(value) => handlePort(packet.id, value as SkillPort)}
                      >
                        <SelectTrigger className="sm:w-56" aria-label={t("playbook.portLabel", { name: packet.title })}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper" align="start">
                          {PORTS.map((port) => (
                            <SelectItem key={port} value={port}>
                              {t(`playbook.port.${port}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ) : null}

          {phase === 4 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold tracking-tight">{t("playbook.routinesTitle")}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{t("playbook.routinesLead")}</p>
              {routinePackets.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("playbook.needParse")}</p>
              ) : (
                <ul className="space-y-3">
                  {routinePackets.map((packet) => {
                    const id = `routine-map-${packet.id}`;
                    return (
                      <li key={packet.id} className="space-y-1.5 rounded-lg border bg-card p-3">
                        <Label htmlFor={id}>{packet.title}</Label>
                        <Input
                          id={id}
                          value={progress.routineMap[packet.id] ?? ""}
                          onChange={(event) => handleRoutineMap(packet.id, event.target.value)}
                          placeholder={t("playbook.mapTo")}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ) : null}

          {phase === 5 || phase === 6 ? (
            <section className="space-y-2">
              <h2 className="text-sm font-semibold tracking-tight">{t("playbook.goldOnConsole")}</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                {state.goldTasks
                  .filter((task) => task.name.trim())
                  .map((task) => (
                    <li key={task.id}>
                      {task.name}
                      {task.plugins ? ` · ${task.plugins}` : ""}
                    </li>
                  ))}
              </ul>
            </section>
          ) : null}

          {phase === 6 ? (
            <section className="space-y-1.5">
              <Label htmlFor="leftovers">{t("playbook.leftoverTitle")}</Label>
              <p className="text-sm leading-6 text-muted-foreground">{t("playbook.leftoverLead")}</p>
              <Textarea
                id="leftovers"
                rows={5}
                value={progress.leftovers.join("\n")}
                onChange={(event) => handleLeftovers(event.target.value)}
              />
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-sm font-semibold tracking-tight">{t("playbook.done")}</h2>
            <ul className="space-y-2">
              {checks.map((key) => {
                const id = `check-${phase}-${key}`;
                return (
                  <li key={key} className="flex items-start gap-2">
                    <Checkbox
                      id={id}
                      checked={progress.checks[phase]?.[key] === true}
                      onCheckedChange={(value) => handleCheck(key, value === true)}
                    />
                    <Label htmlFor={id} className="leading-6 font-normal">
                      {t(`playbook.checks.${phase}.${key}` as "playbook.checks.0.backup")}
                    </Label>
                  </li>
                );
              })}
            </ul>
          </section>

          <Button type="button" onClick={handleComplete} aria-label={t("playbook.complete")}>
            {phase === 6 ? t("playbook.finish") : t("playbook.complete")}
          </Button>
      </>

      <details className="rounded-lg border bg-card p-4">
        <summary className="cursor-pointer text-sm font-medium focus-visible:ring-3 focus-visible:ring-ring/50">
          {t("playbook.appendix")}
        </summary>
        <div className="mt-4">
          <MigrateHandoverAppendix source={source} prompt={handoverPrompt(source, locale)} />
        </div>
      </details>
    </div>
  );
}
