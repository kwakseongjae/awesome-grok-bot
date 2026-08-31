"use client";

import { useLocale, useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { intentPostUrl, porterThreadsText, porterXText } from "@/lib/porter";
import type { HandoffSource } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  source: HandoffSource;
};

export function PorterShare({ source }: Props) {
  const t = useTranslations("porter");
  const locale = useLocale() as ListingLocale;
  const xText = porterXText(locale, source);
  const threadsText = porterThreadsText(locale, source);

  return (
    <section className="space-y-3 rounded-lg border bg-card p-5">
      <h2 className="text-sm font-semibold tracking-tight">{t("shareTitle")}</h2>
      <p className="text-sm leading-6 text-muted-foreground">{t("shareLead")}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={intentPostUrl("x", xText)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          {t("postX")}
        </a>
        <a
          href={intentPostUrl("threads", threadsText)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          {t("postThreads")}
        </a>
      </div>
    </section>
  );
}
