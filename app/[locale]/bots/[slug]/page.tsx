import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { CategoryBadge, KindBadge } from "@/components/listing-badges";
import { Badge } from "@/components/ui/badge";
import { formatTeamCopy } from "@/lib/charter";
import { getPublishedBot, listRelatedBots } from "@/lib/bots";
import type { ListingLocale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const bot = await getPublishedBot(slug, locale as ListingLocale);
  if (!bot) return { title: "Grok Bot" };
  return {
    title: bot.name,
    description: bot.summary,
  };
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

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← {t("bot.back")}
      </Link>

      <header className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={bot.category} label={t(`category.${bot.category}`)} />
          <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
          <Badge variant="outline">{bot.locale === "ko" ? "한국어" : "English"}</Badge>
        </div>
        <h1 className="font-display text-4xl tracking-tight">{bot.name}</h1>
        <p className="text-lg text-muted-foreground">{bot.summary}</p>
        <div className="flex flex-wrap gap-2">
          <CopyButton
            text={bot.prompt}
            label={t("bot.copy")}
            copiedLabel={t("bot.copied")}
            ariaLabel={t("a11y.copyPrompt", { name: bot.name })}
            botId={bot.id}
          />
          {bot.kind === "team" ? (
            <CopyButton
              text={formatTeamCopy(bot)}
              label={t("bot.copyAll")}
              copiedLabel={t("bot.copied")}
              ariaLabel={t("a11y.copyAll", { name: bot.name })}
              botId={bot.id}
              variant="outline"
            />
          ) : null}
        </div>
        <p className="text-sm text-muted-foreground">{t("bot.pasteHint")}</p>
      </header>

      <section className="mt-10 space-y-3">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {t("bot.integrations")}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {bot.integrations.length === 0 ? (
            <span className="text-sm text-muted-foreground">—</span>
          ) : (
            bot.integrations.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))
          )}
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {t("bot.charter")}
        </h2>
        <pre className="overflow-x-auto rounded-xl border bg-card p-4 font-mono text-sm leading-6 whitespace-pre-wrap">
          {bot.prompt}
        </pre>
      </section>

      {bot.kind === "team" && bot.team_members.length > 0 ? (
        <section className="mt-10 space-y-4">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {t("bot.members")}
          </h2>
          <div className="space-y-4">
            {bot.team_members.map((member) => (
              <article key={member.name} className="rounded-xl border bg-card p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{member.charter}</p>
                <div className="mt-3">
                  <CopyButton
                    text={member.charter}
                    label={t("bot.copy")}
                    copiedLabel={t("bot.copied")}
                    ariaLabel={t("a11y.copyPrompt", { name: member.name })}
                    size="sm"
                    variant="outline"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <dl className="mt-10 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">{t("bot.contributor")}</dt>
          <dd>@{bot.contributor_handle}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("bot.added")}</dt>
          <dd>{added}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("bot.source")}</dt>
          <dd>
            {bot.source_url ? (
              <a href={bot.source_url} className="underline" rel="noreferrer">
                {bot.source_url}
              </a>
            ) : (
              "—"
            )}
          </dd>
        </div>
      </dl>

      {related.length > 0 ? (
        <section className="mt-12 space-y-3">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {t("bot.related")}
          </h2>
          <ul className="space-y-2">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/bots/${item.slug}`} className="hover:underline">
                  {item.name}
                </Link>
                <span className="text-muted-foreground"> · {item.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
