import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { latestChangelog } from "@/lib/changelog";
import type { ListingLocale } from "@/lib/types";

export async function HomeChangelog() {
  const t = await getTranslations("changelog");
  const locale = (await getLocale()) as ListingLocale;
  const entries = latestChangelog(3);

  if (entries.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
          <h2 className="text-2xl font-semibold tracking-tight">{t("homeTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("homeLead")}</p>
        </div>
        <Link
          href="/changelog"
          className="text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("viewAll")} →
        </Link>
      </div>
      <ul className="divide-y rounded-lg border">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/changelog#${entry.id}`}
              className="flex flex-col gap-1 px-4 py-4 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="min-w-0 space-y-1">
                <span className="block text-sm font-semibold tracking-tight">{entry.title[locale]}</span>
                <span className="block text-sm leading-6 text-muted-foreground">{entry.body[locale]}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {entry.source} · {entry.date}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
