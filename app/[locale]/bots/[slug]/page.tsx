import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { CategoryBadge, KindBadge, ScoreBadge } from "@/components/listing-badges";
import { JobCard } from "@/components/job-card";
import { ListingFace } from "@/components/listing-face";
import { PluginChipList } from "@/components/plugin-chip";
import { ShareButton } from "@/components/share-button";
import { ScorePanel } from "@/components/score-panel";
import { SetupBotReviews } from "@/components/setup-bot-reviews";
import { formatTeamCopy } from "@/lib/charter";
import { getPublishedBot, listRelatedBots } from "@/lib/bots";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, breadcrumbJsonLd, listingJsonLd, localePath, pageSeo } from "@/lib/seo";
import { scoreForSlug } from "@/lib/scores";
import { SITE_NAME } from "@/lib/site";
import { getVisitorStoreStatus, listSetupBotReviews } from "@/lib/visitor-posts";
import type { ListingLocale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const appLocale = toAppLocale(locale);
  const bot = await getPublishedBot(slug, appLocale);
  if (!bot) return { title: SITE_NAME };
  return pageSeo({
    locale: appLocale,
    path: `bots/${slug}`,
    title: bot.name,
    description: bot.summary,
  });
}

export default async function BotDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations();
  const bot = await getPublishedBot(slug, locale as ListingLocale);
  if (!bot) notFound();

  const related = await listRelatedBots(bot);
  const added = new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(bot.added_at),
  );
  const listingLocale = locale as ListingLocale;
  const appLocale = toAppLocale(locale);
  const shareUrl = absoluteUrl(localePath(appLocale, `bots/${bot.slug}`));
  const scored = scoreForSlug(bot.slug);
  const reviews = await listSetupBotReviews(bot.slug);
  const store = getVisitorStoreStatus();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={listingJsonLd({
          name: bot.name,
          summary: bot.summary,
          url: shareUrl,
          locale: appLocale,
          plugins: bot.integrations,
          author: bot.contributor_handle,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: bot.name, path: localePath(appLocale, `bots/${bot.slug}`) },
        ])}
      />
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("bot.back")}
      </Link>

      <article className="mt-8 overflow-hidden rounded-lg border bg-card">
        <div className="flex aspect-[16/10] items-center justify-center bg-muted p-8">
          <ListingFace slug={bot.slug} name={bot.name} size={128} motion />
        </div>
        <header className="space-y-4 p-5 sm:p-8">
          <p className="font-mono text-xs tracking-tight text-muted-foreground">
            {t("card.by", { handle: bot.contributor_handle })}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={bot.category} label={t(`category.${bot.category}`)} />
            <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
            {scored ? (
              <ScoreBadge
                score={scored.score}
                label={t("rank.scoreAria", { score: scored.score })}
              />
            ) : null}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">{bot.name}</h1>
          <p className="text-lg text-muted-foreground">{bot.summary}</p>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              text={bot.prompt}
              label={t("bot.copy")}
              copiedLabel={t("bot.copied")}
              ariaLabel={t("a11y.copyPrompt", { name: bot.name })}
              botId={bot.id}
              copyKind="listing"
            />
            {bot.kind === "team" ? (
              <CopyButton
                text={formatTeamCopy(bot)}
                label={t("bot.copyAll")}
                copiedLabel={t("bot.copied")}
                ariaLabel={t("a11y.copyAll", { name: bot.name })}
                botId={bot.id}
                copyKind="team"
                variant="ghost"
              />
            ) : null}
            <ShareButton title={bot.name} url={shareUrl} />
          </div>
          <p className="text-sm text-muted-foreground">{t("bot.copyHint")}</p>
          {bot.kind === "team" ? (
            <p className="text-sm text-muted-foreground">{t("bot.copyAllHint")}</p>
          ) : null}
          <p className="text-sm text-muted-foreground">{t("bot.pasteHint")}</p>
        </header>
      </article>

      {scored ? <ScorePanel entry={scored} /> : null}

      <section className="mt-12 space-y-3">
        <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("bot.integrations")}
        </h2>
        <PluginChipList items={bot.integrations} locale={listingLocale} />
      </section>

      <section className="mt-12 space-y-3">
        <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("bot.charter")}
        </h2>
        <pre className="overflow-x-auto rounded-lg border bg-card p-4 font-mono text-sm leading-6 whitespace-pre-wrap">
          {bot.prompt}
        </pre>
      </section>

      {bot.kind === "team" && bot.team_members.length > 0 ? (
        <section className="mt-12 space-y-4">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("bot.members")}
          </h2>
          <div className="space-y-4">
            {bot.team_members.map((member) => (
              <article key={member.name} className="rounded-lg border bg-card p-4">
                <div className="flex items-start gap-3">
                  <ListingFace slug={bot.slug} seed={member.name} name={member.name} size={40} decorative motion />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{member.charter}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <CopyButton
                        text={member.charter}
                        label={t("bot.copy")}
                        copiedLabel={t("bot.copied")}
                        ariaLabel={t("a11y.copyPrompt", { name: member.name })}
                        copyKind="member"
                        size="sm"
                      />
                      <p className="text-xs text-muted-foreground">{t("bot.memberCopyHint")}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <dl className="mt-12 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">{t("bot.contributor")}</dt>
          <dd className="font-mono">@{bot.contributor_handle}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("bot.added")}</dt>
          <dd>{added}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("bot.source")}</dt>
          <dd>
            {bot.source_url ? (
              <a
                href={bot.source_url}
                className="underline underline-offset-4"
                rel="noreferrer"
              >
                {bot.source_url}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>

      <SetupBotReviews
        slug={bot.slug}
        listingName={bot.name}
        reviews={reviews}
        canWrite={store.canWrite}
      />

      {related.length > 0 ? (
        <section className="mt-12 space-y-3">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("bot.related")}
          </h2>
          <div className="grid items-stretch gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <JobCard
                key={item.id}
                href={`/bots/${item.slug}`}
                title={item.name}
                byline={t("card.by", { handle: item.contributor_handle })}
                blurb={item.summary}
                slug={item.slug}
                name={item.name}
                openLabel={t("card.open")}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
