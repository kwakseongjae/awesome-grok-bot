import { getLocale, getTranslations } from "next-intl/server";
import { READING } from "@/lib/reading";
import type { ListingLocale } from "@/lib/types";

export async function HomeReading() {
  const t = await getTranslations("reading");
  const locale = (await getLocale()) as ListingLocale;

  return (
    <section className="space-y-5">
      <div className="max-w-2xl space-y-2">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
        <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{t("lead")}</p>
      </div>
      <ul className="divide-y rounded-lg border">
        {READING.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 px-4 py-4 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="min-w-0 space-y-1">
                <span className="block text-sm font-semibold tracking-tight">{item.title[locale]}</span>
                <span className="block text-sm leading-6 text-muted-foreground">{item.note[locale]}</span>
              </span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {item.source} · {item.date}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
