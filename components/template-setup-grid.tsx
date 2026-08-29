"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { UseCaseCard, useCaseGridClass } from "@/components/use-case-card";
import { CATEGORIES, type BotListing, type Category } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "all";

type Props = {
  listings: BotListing[];
};

export function TemplateSetupGrid({ listings }: Props) {
  const t = useTranslations();
  const [category, setCategory] = useState<Category | typeof ALL>(ALL);

  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    for (const item of listings) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1);
    }
    return map;
  }, [listings]);

  const visible =
    category === ALL ? listings : listings.filter((item) => item.category === category);

  const handleSelect = (next: Category | typeof ALL) => {
    setCategory(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, next: Category | typeof ALL) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(next);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("filters.category")}>
        <button
          type="button"
          aria-pressed={category === ALL}
          tabIndex={0}
          className={cn(
            "cursor-pointer rounded-full border px-3 py-1.5 text-sm tracking-tight focus-visible:ring-3 focus-visible:ring-ring/50",
            category === ALL
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground hover:bg-muted/40",
          )}
          onClick={() => handleSelect(ALL)}
          onKeyDown={(event) => handleKeyDown(event, ALL)}
        >
          {t("filters.anyCategory")} {listings.length}
        </button>
        {CATEGORIES.map((item) => {
          const count = counts.get(item) ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              tabIndex={0}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 text-sm tracking-tight focus-visible:ring-3 focus-visible:ring-ring/50",
                category === item
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted/40",
              )}
              onClick={() => handleSelect(item)}
              onKeyDown={(event) => handleKeyDown(event, item)}
            >
              {t(`category.${item}`)} {count}
            </button>
          );
        })}
      </div>
      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-16 text-center">
          <p className="font-medium">{t("home.empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.emptyHint")}</p>
        </div>
      ) : (
        <div className={useCaseGridClass}>
          {visible.map((item) => (
            <UseCaseCard
              key={item.id}
              href={`/bots/${item.slug}`}
              category={t(`category.${item.category}`)}
              title={item.name}
              dek={item.summary}
              kind={item.kind}
              kindLabel={t(`kind.${item.kind}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
