import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { GrokBotMascot } from "@/components/grok-bot-mascot";
import { JsonLd } from "@/components/json-ld";
import { PlayDesk } from "@/components/play-desk";
import { listPublishedBots } from "@/lib/bots";
import { listPlayBoard } from "@/lib/community-store";
import { MASCOT } from "@/lib/mascot";
import { listingNames } from "@/lib/review-parse";
import { rankingRows } from "@/lib/scores";
import { PLAY_UPDATED_AT } from "@/lib/community-types";
import { breadcrumbJsonLd, localePath, pageSeo, playJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "play" });
  return pageSeo({
    locale: appLocale,
    path: "play",
    title: t("title"),
    description: t("lead"),
  });
}

export default async function PlayPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("play");
  const bots = await listPublishedBots({ locale: appLocale });
  const rows = rankingRows(bots);
  const board = await listPlayBoard();
  const names = listingNames(bots);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={playJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
          dateModified: PLAY_UPDATED_AT,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "play") },
        ])}
      />
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("back")}
      </Link>

      <p className="mt-8 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>

      <section className="mt-8 flex gap-4 rounded-lg border bg-card p-5 sm:gap-5 sm:p-6">
        <GrokBotMascot name={MASCOT.hostName} size={56} className="mt-0.5" />
        <div className="min-w-0 space-y-2">
          <p className="text-base leading-7 font-semibold tracking-tight sm:text-lg">{t("host")}</p>
          <p className="text-sm leading-6 text-muted-foreground">{t("noAccount")}</p>
        </div>
      </section>

      <div className="mt-10">
        <PlayDesk initial={board} rows={rows} names={names} />
      </div>
    </div>
  );
}
