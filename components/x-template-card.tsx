"use client";

import { useTranslations } from "next-intl";
import { AddToGrokButton } from "@/components/add-to-grok-button";
import { ListingFace } from "@/components/listing-face";
import { GROK_BOT } from "@/lib/site";
import type { XTemplate } from "@/lib/templates";

export function XTemplateCard({ item, compact = false }: { item: XTemplate; compact?: boolean }) {
  const t = useTranslations("templates");

  return (
    <article
      className={
        compact
          ? "flex h-full flex-col items-center rounded-lg border bg-card px-5 py-5 text-center"
          : "flex h-full flex-col items-center rounded-lg border bg-card px-6 py-8 text-center sm:px-8"
      }
    >
      <ListingFace
        slug={item.id}
        seed={item.id}
        name={item.name}
        size={compact ? 48 : 72}
        decorative
        motion
      />
      <h3
        title={item.name}
        className={
          compact
            ? "mt-3 line-clamp-2 w-full min-w-0 text-lg font-normal tracking-tight break-words"
            : "mt-4 line-clamp-2 w-full min-w-0 text-2xl font-normal tracking-tight break-words"
        }
      >
        {item.name}
      </h3>
      <p className="text-sm text-muted-foreground">{t("byAuthor", { name: item.author })}</p>
      <p
        title={item.description}
        className={
          compact
            ? "mt-2 line-clamp-2 w-full min-w-0 text-sm leading-6 break-words text-muted-foreground"
            : "mt-3 line-clamp-4 w-full min-w-0 text-base leading-relaxed break-words text-muted-foreground"
        }
      >
        {item.description}
      </p>
      <div className="mt-4 flex w-full flex-col items-center border-t pt-4">
        {compact ? null : (
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {t.rich("thirdParty", {
              terms: (chunks) => (
                <a
                  href={GROK_BOT.shareTerms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-muted-foreground/40 underline-offset-2 hover:text-foreground hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        )}
        <AddToGrokButton
          shareUrl={item.shareUrl}
          source="community"
          size={compact ? "default" : "lg"}
          hideIcon
          className={compact ? "w-full whitespace-normal" : "mt-3 w-full whitespace-normal"}
        />
        {compact ? null : (
          <a
            href={GROK_BOT.installMac}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("download")}
          </a>
        )}
      </div>
      <a
        href={item.xPostUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {t("xCredit", { handle: item.sharedBy })}
      </a>
    </article>
  );
}
