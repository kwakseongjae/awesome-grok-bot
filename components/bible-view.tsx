"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  BIBLE_CHAPTERS,
  BIBLE_LEAD,
  BIBLE_TITLE,
  BIBLE_UPDATED_AT,
  BIBLE_VERSION,
  type BibleBlock,
} from "@/lib/bible";
import { trackBiblePrint } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui/button";
import type { ListingLocale } from "@/lib/types";
import { cn } from "@/lib/utils";

const text = (locale: ListingLocale, record: Record<ListingLocale, string>) =>
  record[locale] ?? record.en;

function Block({ block, locale }: { block: BibleBlock; locale: ListingLocale }) {
  if (block.type === "p") {
    return <p className="text-sm leading-7 text-muted-foreground">{text(locale, block.text)}</p>;
  }
  if (block.type === "h3") {
    return <h3 className="pt-2 text-base font-semibold tracking-tight">{text(locale, block.text)}</h3>;
  }
  if (block.type === "quote") {
    return (
      <blockquote className="border-l pl-4 text-sm leading-7 text-muted-foreground">
        {text(locale, block.text)}
      </blockquote>
    );
  }
  const Tag = block.type === "ol" ? "ol" : "ul";
  return (
    <Tag className={`${block.type === "ol" ? "list-decimal" : "list-disc"} space-y-1.5 pl-5 text-sm leading-7 text-muted-foreground`}>
      {block.items.map((item, index) => (
        <li key={index}>{text(locale, item)}</li>
      ))}
    </Tag>
  );
}

export function BibleView() {
  const t = useTranslations("bible");
  const locale = useLocale() as ListingLocale;
  const updated = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "Asia/Seoul" }).format(
    new Date(BIBLE_UPDATED_AT),
  );

  return (
    <article className="bible-print space-y-10">
      <header className="space-y-4">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{text(locale, BIBLE_TITLE)}</h1>
        <p className="max-w-2xl text-muted-foreground">{text(locale, BIBLE_LEAD)}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {t("meta", { version: BIBLE_VERSION, date: updated })}
        </p>
        <div className="flex flex-wrap gap-2" data-print-hide>
          <button
            type="button"
            className={cn(buttonVariants())}
            onClick={() => {
              trackBiblePrint();
              window.print();
            }}
          >
            {t("print")}
          </button>
        </div>
      </header>

      <nav aria-label={t("toc")} className="space-y-2 border-y py-6">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("toc")}</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {BIBLE_CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {text(locale, chapter.title)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {BIBLE_CHAPTERS.map((chapter) => (
        <section key={chapter.id} id={chapter.id} className="scroll-mt-20 space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">{text(locale, chapter.title)}</h2>
          {chapter.blocks.map((block, index) => (
            <Block key={`${chapter.id}-${index}`} block={block} locale={locale} />
          ))}
        </section>
      ))}
    </article>
  );
}
