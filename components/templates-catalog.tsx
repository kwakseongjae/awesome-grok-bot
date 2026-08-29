"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CopyButton } from "@/components/copy-button";
import { KindBadge } from "@/components/listing-badges";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CATEGORIES, type BotKind, type Category } from "@/lib/types";

export type TemplateSetup = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  prompt: string;
  category: Category;
  kind: BotKind;
};

type Props = {
  listings: TemplateSetup[];
};

const ALL = "all";

const listingHref = (slug: string) => `/bots/${slug}` as const;

const pillClass = (pressed: boolean) =>
  cn(
    "cursor-pointer rounded-full border px-3 py-1.5 text-sm tracking-tight focus-visible:ring-3 focus-visible:ring-ring/50",
    pressed
      ? "border-foreground bg-foreground text-background"
      : "border-border bg-background text-foreground hover:bg-muted/40",
  );

export function TemplatesCatalog({ listings }: Props) {
  const t = useTranslations("templates");
  const bot = useTranslations("bot");
  const a11y = useTranslations("a11y");
  const categoryT = useTranslations("category");
  const kindT = useTranslations("kind");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | typeof ALL>(ALL);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return listings.filter((item) => {
      if (category !== ALL && item.category !== category) return false;
      if (!needle) return true;
      const haystack = [item.name, item.summary, item.slug, item.category].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [listings, query, category]);

  const handleCategoryChange = (next: Category | typeof ALL) => {
    setCategory(next);
  };

  const handleClear = () => {
    setQuery("");
    setCategory(ALL);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="templates-search">{t("searchLabel")}</Label>
        <Input
          id="templates-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("search")}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label={t("categories")}>
        <button
          type="button"
          aria-pressed={category === ALL}
          className={pillClass(category === ALL)}
          onClick={() => handleCategoryChange(ALL)}
        >
          {t("all")} {listings.length}
        </button>
        {CATEGORIES.map((item) => {
          const count = listings.filter((listing) => listing.category === item).length;
          if (count === 0) return null;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              className={pillClass(category === item)}
              onClick={() => handleCategoryChange(item)}
            >
              {categoryT(item)} {count}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p className="font-mono tabular-nums">{t("results", { count: filtered.length })}</p>
        {query || category !== ALL ? (
          <button
            type="button"
            className="cursor-pointer text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={handleClear}
          >
            {t("clear")}
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-12 text-center">
          <p className="font-medium">{t("empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("emptyHint")}</p>
        </div>
      ) : (
        <div className="grid items-stretch gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <article key={item.id} className="flex h-full flex-col rounded-lg border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[11px] tracking-tight text-muted-foreground">
                  {categoryT(item.category)}
                </p>
                <KindBadge kind={item.kind} label={kindT(item.kind)} />
              </div>
              <h3 className="mt-2 text-base font-semibold tracking-tight">
                <Link
                  href={listingHref(item.slug)}
                  className="cursor-pointer underline-offset-4 hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {item.name}
                </Link>
              </h3>
              <p className="mt-1 line-clamp-2 flex-1 text-sm leading-5 text-muted-foreground">
                {item.summary}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CopyButton
                  text={item.prompt}
                  label={t("copySetup")}
                  copiedLabel={bot("copied")}
                  ariaLabel={a11y("copyPrompt", { name: item.name })}
                  botId={item.id}
                  copyKind="listing"
                  size="sm"
                />
                <Link
                  href={listingHref(item.slug)}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}
                  aria-label={t("openListingAria", { name: item.name })}
                >
                  {t("openListing")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
