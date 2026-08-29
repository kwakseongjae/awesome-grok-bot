import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { GrainThumb } from "@/components/grain-thumb";
import { GuideCard } from "@/components/guide-card";
import { JsonLd } from "@/components/json-ld";
import { SetupGuide } from "@/components/setup-guide";
import { SiteFaq } from "@/components/site-faq";
import { listPublishedBots } from "@/lib/bots";
import { breadcrumbJsonLd, HOW_TO_STEP_KEYS, howToJsonLd, localePath, pageSeo } from "@/lib/seo";
import { GROK_BOT, SITE_NAME } from "@/lib/site";
import {
  FEATURED_GUIDE_AT,
  MIGRATE_TEMPLATE_AT,
  formatGuideDate,
  grainSeed,
  grainToneForSlug,
  pickListingsBySlug,
} from "@/lib/templates";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "howTo" });
  return pageSeo({ locale: appLocale, path: "how-to", title: t("title"), description: t("lead") });
}

const STEP_KEYS = HOW_TO_STEP_KEYS;

type ExternalLinkKey =
  | "linkGetStarted"
  | "linkPricing"
  | "linkPlans"
  | "linkCursorPricing"
  | "linkMac"
  | "linkIos"
  | "linkComputer"
  | "linkSkills";

type StepLink =
  | { href: string; key: ExternalLinkKey }
  | {
      href: "/" | "/bots/floor-nexus" | "/bots/run-orchestrator";
      key: "linkDirectory" | "linkNexus" | "linkOrchestrator";
      internal: true;
    };

const STEP_LINKS: Partial<Record<(typeof STEP_KEYS)[number], StepLink[]>> = {
  access: [
    { href: GROK_BOT.getStarted, key: "linkGetStarted" },
    { href: GROK_BOT.product, key: "linkPricing" },
    { href: GROK_BOT.pricingCursor, key: "linkCursorPricing" },
  ],
  install: [
    { href: GROK_BOT.installMac, key: "linkMac" },
    { href: GROK_BOT.installIos, key: "linkIos" },
  ],
  setup: [{ href: "/", key: "linkDirectory", internal: true }],
  login: [{ href: GROK_BOT.computer, key: "linkComputer" }],
  skill: [{ href: GROK_BOT.skills, key: "linkSkills" }],
  team: [
    { href: "/bots/floor-nexus", key: "linkNexus", internal: true },
    { href: "/bots/run-orchestrator", key: "linkOrchestrator", internal: true },
  ],
};

export default async function HowToPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("howTo");
  const templates = await getTranslations("templates");
  const migrate = await getTranslations("migrate.home");
  const appLocale = toAppLocale(locale);
  const bots = await listPublishedBots({ locale: appLocale });
  const related = pickListingsBySlug(bots, ["inbox-chief", "one-machine"]);
  const migrateDate = formatGuideDate(MIGRATE_TEMPLATE_AT, appLocale);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-16">
      <JsonLd
        data={howToJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
          steps: STEP_KEYS.map((key) => ({
            name: t(`steps.${key}Title`),
            text: t(`steps.${key}Body`),
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "how-to") },
        ])}
      />
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
      <p className="mt-3 text-xs text-muted-foreground">{formatGuideDate(FEATURED_GUIDE_AT, appLocale)}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{templates("featuredLead")}</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border/80">
        <GrainThumb
          title={templates("featuredTitle")}
          tone="dusk"
          seed={grainSeed("how-we-run")}
          size="hero"
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {t("download")}{" "}
        <a
          href={GROK_BOT.installMac}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("downloadCta")}
        </a>
      </p>

      <figure className="mt-8 overflow-hidden rounded-lg border bg-card">
        <Image
          src="/how-to/introducing-grok-bot.png"
          alt={t("figureLaunchAlt")}
          width={1920}
          height={1080}
          className="h-auto w-full"
          priority
        />
        <figcaption className="border-t px-4 py-3 text-xs leading-5 text-muted-foreground">
          {t("figureLaunchCaption")}{" "}
          <a
            href="https://x.ai/news/introducing-grok-bot"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            x.ai/news/introducing-grok-bot
          </a>
        </figcaption>
      </figure>

      <ol className="mt-10 max-w-3xl space-y-8">
        {STEP_KEYS.map((key, index) => {
          const links = STEP_LINKS[key] ?? [];
          return (
            <li key={key} className="flex gap-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">{index + 1}</span>
              <div className="min-w-0 space-y-2">
                <h2 className="text-lg font-semibold tracking-tight">{t(`steps.${key}Title`)}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{t(`steps.${key}Body`)}</p>
                {links.length > 0 ? (
                  <ul className="flex flex-col gap-1.5 pt-1 text-sm">
                    {links.map((item) => (
                      <li key={item.href}>
                        {"internal" in item ? (
                          <Link
                            href={item.href}
                            className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            {t(item.key)}
                          </Link>
                        ) : (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                          >
                            {t(item.key)}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mt-14 space-y-3 border-t pt-10">
        <h2 className="text-lg font-semibold tracking-tight">{t("refsTitle")}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{t("refsLead")}</p>
        <ul className="flex flex-col gap-1.5 text-sm">
          {(
            [
              { href: GROK_BOT.getStarted, key: "refGetStarted" },
              { href: GROK_BOT.skills, key: "refSkills" },
              { href: GROK_BOT.computer, key: "refComputer" },
              { href: GROK_BOT.launch, key: "refLaunch" },
              { href: GROK_BOT.installMac, key: "refOnboarding" },
              { href: GROK_BOT.xAccount, key: "refXAccount" },
              { href: "https://www.youtube.com/watch?v=PQBYZQqan2g", key: "refVideo" },
            ] as const
          ).map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">{templates("setupsTitle")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <GuideCard
              key={item.id}
              href={`/bots/${item.slug}`}
              title={item.name}
              date={formatGuideDate(item.added_at, appLocale)}
              tone={grainToneForSlug(item.slug)}
              seed={grainSeed(item.slug)}
            />
          ))}
          <GuideCard
            href="/migrate/hermes"
            title={migrate("hermes")}
            date={migrateDate}
            tone={grainToneForSlug("hermes")}
            seed={grainSeed("hermes")}
          />
          <GuideCard
            href="/migrate/openclaw"
            title={migrate("openclaw")}
            date={migrateDate}
            tone={grainToneForSlug("openclaw")}
            seed={grainSeed("openclaw")}
          />
        </div>
        <p className="text-sm">
          <Link
            href="/templates"
            className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {templates("allTemplates")}
          </Link>
        </p>
      </section>

      <div className="mt-14">
        <SetupGuide />
      </div>

      <div className="mt-14">
        <SiteFaq />
      </div>
    </div>
  );
}
