"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AddToGrokButton } from "@/components/add-to-grok-button";
import { CopyButton } from "@/components/copy-button";
import { ListingFace } from "@/components/listing-face";
import { isGrokShareUrl } from "@/lib/share-link";
import type { BotListing } from "@/lib/types";

export function TemplateCard({ bot }: { bot: BotListing }) {
  const t = useTranslations();
  const share = isGrokShareUrl(bot.share_url) ? bot.share_url : null;

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border bg-card p-5">
      <div className="flex items-start gap-3">
        <ListingFace slug={bot.slug} name={bot.name} size={48} decorative motion />
        <div className="min-w-0 space-y-1">
          <Link
            href={`/bots/${bot.slug}`}
            className="font-semibold tracking-tight underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {bot.name}
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">{bot.summary}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {share ? <AddToGrokButton shareUrl={share} source="listing" size="sm" /> : null}
        <CopyButton
          text={bot.prompt}
          label={t("bot.copy")}
          copiedLabel={t("bot.copied")}
          ariaLabel={t("a11y.copyPrompt", { name: bot.name })}
          botId={bot.id}
          copyKind="template"
          size="sm"
          variant={share ? "outline" : "default"}
        />
      </div>
    </article>
  );
}
