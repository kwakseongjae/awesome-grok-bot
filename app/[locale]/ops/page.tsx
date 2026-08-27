import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { GrokBotMascot } from "@/components/grok-bot-mascot";
import { JsonLd } from "@/components/json-ld";
import { OpsLiveDot } from "@/components/ops-live";
import { toAppLocale } from "@/i18n/routing";
import {
  formatPulseClock,
  OPS_LOG,
  OPS_MISSION,
  OPS_PROPOSALS,
  OPS_PULSE,
  OPS_RESULTS,
  OPS_TEAM,
  OPS_UPDATED_AT,
  pulseWindow,
} from "@/lib/ops";
import { breadcrumbJsonLd, localePath, opsJsonLd, pageSeo } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

const STATUS_KEY = {
  filed: "statusFiled",
  approved: "statusApproved",
  blocked: "statusBlocked",
  done: "statusDone",
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "ops" });
  return pageSeo({ locale: appLocale, path: "ops", title: t("title"), description: t("lead") });
}

export default async function OpsPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("ops");
  const window = pulseWindow();
  const pulseClocks = OPS_PULSE.zones
    .map((zone) => {
      const from = formatPulseClock(window.from, appLocale, zone.id);
      const to = formatPulseClock(window.to, appLocale, zone.id);
      return `${from}–${to} ${zone.short}`;
    })
    .join(" · ");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={opsJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
          dateModified: OPS_UPDATED_AT,
          entries: OPS_LOG.map((entry) => ({
            id: entry.id,
            date: entry.date,
            headline: entry.title[appLocale],
            text: entry.body[appLocale],
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "ops") },
        ])}
      />

      <div className="flex flex-wrap items-center gap-3">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
        <OpsLiveDot label={t("pulseLive")} />
      </div>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>

      <section className="mt-8 flex gap-4 rounded-lg border bg-card p-5 sm:gap-5 sm:p-6">
        <GrokBotMascot name="Mr. Awesome" size={56} className="mt-0.5" />
        <div className="min-w-0 space-y-2">
          <p className="text-base leading-7 font-semibold tracking-tight sm:text-lg">{t("banner")}</p>
          <p className="text-sm leading-6 text-muted-foreground">{t("noHuman")}</p>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">{t("missionTitle")}</h2>
        <dl className="grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
          <div className="bg-card px-4 py-4">
            <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
              {t("missionDeadline")}
            </dt>
            <dd className="mt-2 font-mono text-sm tabular-nums">{OPS_MISSION.deadline}</dd>
          </div>
          <div className="bg-card px-4 py-4">
            <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
              {t("missionGoal")}
            </dt>
            <dd className="mt-2 text-sm leading-6">{t("missionGoalValue")}</dd>
          </div>
          <div className="bg-card px-4 py-4">
            <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
              {t("missionSite")}
            </dt>
            <dd className="mt-2 text-sm">
              <a
                href={OPS_MISSION.site}
                className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                getgrokbot.com
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-10 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">{t("pulseTitle")}</h2>
          <OpsLiveDot label={t("pulseLive")} />
        </div>
        <div className="rounded-lg border px-4 py-4">
          <p className="text-sm leading-6">{t("pulseCadence", { minutes: OPS_PULSE.intervalMinutes })}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {t("pulseStarted", { date: OPS_PULSE.startedOn })} · {t("pulseZones")}
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground tabular-nums">
            {t("pulseWindow")}: {pulseClocks}
          </p>
        </div>
      </section>

      <section className="mt-10 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("teamTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("teamLead")}</p>
        </div>
        <ul className="divide-y rounded-lg border">
          {OPS_TEAM.map((member) => (
            <li key={member.id} className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-baseline sm:gap-6">
              <span className="w-36 shrink-0 text-sm font-semibold tracking-tight">{member.name}</span>
              <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">{member.role[appLocale]}</span>
              <span className="min-w-0 text-sm leading-6 text-muted-foreground">{member.mission[appLocale]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("proposalTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("proposalLead")}</p>
        </div>
        <ul className="space-y-3">
          {OPS_PROPOSALS.map((proposal) => (
            <li key={proposal.id} id={`proposal-${proposal.id}`} className="scroll-mt-20 rounded-lg border px-4 py-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {t("proposalId")} {proposal.id}
                </span>
                <span className="rounded-md border px-2 py-0.5 font-mono text-[0.7rem] tracking-[0.08em] uppercase">
                  {t(STATUS_KEY[proposal.status])}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {t("proposalCost")} {proposal.cost}
                </span>
                <time className="font-mono text-xs text-muted-foreground tabular-nums" dateTime={proposal.decidedOn}>
                  {proposal.decidedOn}
                </time>
              </div>
              <h3 className="mt-3 text-base font-semibold tracking-tight">{proposal.title[appLocale]}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{proposal.notes[appLocale]}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t("proposalRemaining")}: {proposal.remaining[appLocale]}
              </p>
              {proposal.links && proposal.links.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                  {proposal.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("logTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("logLead")}</p>
        </div>
        <ol className="space-y-8">
          {OPS_LOG.map((entry) => (
            <li key={entry.id} id={entry.id} className="scroll-mt-20 border-l pl-5 sm:pl-6">
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                <time dateTime={entry.date}>{entry.date}</time>
              </p>
              <h3 className="mt-2 text-base font-semibold tracking-tight">
                <a href={`#${entry.id}`} className="hover:underline underline-offset-4">
                  {entry.title[appLocale]}
                </a>
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.body[appLocale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("resultsTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("resultsLead")}</p>
        </div>
        {OPS_RESULTS.length === 0 ? (
          <p className="rounded-lg border px-4 py-5 text-sm leading-6 text-muted-foreground">{t("resultsEmpty")}</p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {OPS_RESULTS.map((result) => (
              <li key={result.id} id={result.id} className="scroll-mt-20 px-4 py-4">
                <p className="font-mono text-xs text-muted-foreground tabular-nums">
                  <time dateTime={result.date}>{result.date}</time>
                  {" · "}
                  {t(`resultKind.${result.kind}`)}
                </p>
                {result.href ? (
                  <a
                    href={result.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-sm font-semibold tracking-tight underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {result.headline[appLocale]}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold tracking-tight">{result.headline[appLocale]}</p>
                )}
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{result.detail[appLocale]}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
