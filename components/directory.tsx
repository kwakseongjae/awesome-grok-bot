"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon, LayoutGridIcon, ListIcon, SlidersHorizontalIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { CategoryBadge, KindBadge, ScoreBadge } from "@/components/listing-badges";
import { ListingFace } from "@/components/listing-face";
import { PluginChip, PluginChipList } from "@/components/plugin-chip";
import { Button, buttonVariants } from "@/components/ui/button";
import { directoryHref, type DirectoryView } from "@/lib/directory-view";
import { integrationLabel } from "@/lib/integrations";
import { scoreForSlug } from "@/lib/scores";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trackDirectorySearch } from "@/lib/analytics";
import { CATEGORIES, type BotListing, type BotKind, type Category, type ListingLocale } from "@/lib/types";

const ALL = "all";
const PAGE_SIZE = 20;

type Props = {
  bots: BotListing[];
  integrations: string[];
  view: DirectoryView;
  category: Category | typeof ALL;
};

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;

export function Directory({
  bots,
  integrations,
  view: serverView,
  category: serverCategory,
}: Props) {
  const t = useTranslations();
  const [view, setView] = useState(serverView);
  const [prevServerView, setPrevServerView] = useState(serverView);
  if (prevServerView !== serverView) {
    setPrevServerView(serverView);
    setView(serverView);
  }
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | typeof ALL>(serverCategory);
  const [prevServerCategory, setPrevServerCategory] = useState(serverCategory);
  if (prevServerCategory !== serverCategory) {
    setPrevServerCategory(serverCategory);
    setCategory(serverCategory);
  }
  const [integration, setIntegration] = useState(ALL);
  const [kind, setKind] = useState<BotKind | typeof ALL>(ALL);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return bots.filter((bot) => {
      if (category !== ALL && bot.category !== category) return false;
      if (integration !== ALL && !bot.integrations.includes(integration)) return false;
      if (kind !== ALL && bot.kind !== kind) return false;
      if (!needle) return true;
      const haystack = [
        bot.name,
        bot.summary,
        bot.contributor_handle,
        ...bot.integrations,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [bots, category, integration, kind, query]);

  useEffect(() => {
    const needle = query.trim();
    if (!needle) return;
    const timer = window.setTimeout(() => {
      trackDirectorySearch({
        queryLen: needle.length,
        resultCount: filtered.length,
        category,
        integration,
        kind,
      });
    }, 800);
    return () => window.clearTimeout(timer);
  }, [query, filtered.length, category, integration, kind]);

  useEffect(() => {
    setPage(1);
  }, [query, category, integration, kind, view]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (next: number) => {
    setPage(next);
  };

  const replaceDirectoryUrl = (next: {
    view?: DirectoryView;
    category?: Category | typeof ALL;
  }) => {
    const url = new URL(window.location.href);
    const nextView = next.view ?? view;
    const nextCategory = next.category ?? category;
    if (nextView === "cards") url.searchParams.set("view", "cards");
    else url.searchParams.delete("view");
    if (nextCategory === ALL) url.searchParams.delete("category");
    else url.searchParams.set("category", nextCategory);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const handleClear = () => {
    setQuery("");
    setCategory(ALL);
    setIntegration(ALL);
    setKind(ALL);
    replaceDirectoryUrl({ category: ALL });
  };

  const handleViewClick = (event: MouseEvent<HTMLAnchorElement>, next: DirectoryView) => {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    if (next === view) return;
    setView(next);
    replaceDirectoryUrl({ view: next });
  };

  const handleCategoryChange = (value: string) => {
    const next = value as Category | typeof ALL;
    setCategory(next);
    replaceDirectoryUrl({ category: next });
  };

  const filterFieldProps = {
    category,
    integration,
    kind,
    integrations,
    onCategoryChange: handleCategoryChange,
    onIntegrationChange: setIntegration,
    onKindChange: (value: string) => setKind(value as BotKind | typeof ALL),
  };

  return (
    <div id="catalog" className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor="directory-search">{t("home.searchLabel")}</Label>
          <Input
            id="directory-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("home.search")}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" className="lg:hidden" aria-label={t("a11y.openFilters")}>
                <SlidersHorizontalIcon />
                {t("home.filters")}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{t("home.filters")}</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <FilterFields idPrefix="filters-mobile" {...filterFieldProps} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="inline-flex rounded-md border p-0.5" role="group" aria-label={t("a11y.view")}>
            <Link
              href={directoryHref({ view: "table", category })}
              replace
              scroll={false}
              className={cn(buttonVariants({ size: "sm", variant: view === "table" ? "secondary" : "ghost" }))}
              aria-pressed={view === "table"}
              aria-current={view === "table" ? "page" : undefined}
              onClick={(event) => handleViewClick(event, "table")}
            >
              <ListIcon />
              {t("home.viewTable")}
            </Link>
            <Link
              href={directoryHref({ view: "cards", category })}
              replace
              scroll={false}
              className={cn(buttonVariants({ size: "sm", variant: view === "cards" ? "secondary" : "ghost" }))}
              aria-pressed={view === "cards"}
              aria-current={view === "cards" ? "page" : undefined}
              onClick={(event) => handleViewClick(event, "cards")}
            >
              <LayoutGridIcon />
              {t("home.viewCards")}
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <FilterFields idPrefix="filters-desktop" {...filterFieldProps} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <p className="font-mono tabular-nums">{t("home.results", { count: filtered.length })}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/rank"
              className="text-sm font-medium text-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("rank.view")} →
            </Link>
            <Link
              href="/visitors"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("nav.visitors")}
            </Link>
            <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
              {t("home.clearFilters")}
            </Button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed px-6 py-16 text-center">
            <p className="font-medium">{t("home.empty")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("home.emptyHint")}</p>
          </div>
        ) : view === "table" ? (
          <DirectoryTable bots={paged} />
        ) : (
          <DirectoryCards bots={paged} />
        )}

        {filtered.length > PAGE_SIZE ? (
          <nav className="flex items-center justify-center gap-2 pt-1" aria-label={t("home.pagination")}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label={t("home.prevPage")}
            >
              <ChevronLeftIcon />
              {t("home.prevPage")}
            </Button>
            <p className="font-mono text-xs tabular-nums text-muted-foreground">
              {t("home.pageStatus", { page: currentPage, pages: pageCount })}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pageCount}
              aria-label={t("home.nextPage")}
            >
              {t("home.nextPage")}
              <ChevronRightIcon />
            </Button>
          </nav>
        ) : null}
      </div>
    </div>
  );
}

function FilterFields({
  idPrefix,
  category,
  integration,
  kind,
  integrations,
  onCategoryChange,
  onIntegrationChange,
  onKindChange,
}: {
  idPrefix: string;
  category: string;
  integration: string;
  kind: string;
  integrations: string[];
  onCategoryChange: (value: string) => void;
  onIntegrationChange: (value: string) => void;
  onKindChange: (value: string) => void;
}) {
  const t = useTranslations();
  const uiLocale = useLocale() as ListingLocale;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <FilterSelect
        id={`${idPrefix}-category`}
        label={t("filters.category")}
        value={category}
        onChange={onCategoryChange}
        placeholder={t("filters.anyCategory")}
        options={[
          { value: ALL, label: t("filters.anyCategory") },
          ...CATEGORIES.map((item) => ({
            value: item,
            label: t(`category.${item}`),
          })),
        ]}
      />
      <FilterSelect
        id={`${idPrefix}-integration`}
        label={t("filters.integration")}
        value={integration}
        onChange={onIntegrationChange}
        placeholder={t("filters.anyIntegration")}
        options={[
          { value: ALL, label: t("filters.anyIntegration") },
          ...integrations.map((item) => ({
            value: item,
            label: integrationLabel(item, uiLocale),
            plugin: item,
          })),
        ]}
      />
      <FilterSelect
        id={`${idPrefix}-kind`}
        label={t("filters.kind")}
        value={kind}
        onChange={onKindChange}
        placeholder={t("filters.anyKind")}
        options={[
          { value: ALL, label: t("filters.anyKind") },
          { value: "bot", label: t("kind.bot") },
          { value: "team", label: t("kind.team") },
        ]}
      />
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string; plugin?: string }[];
}) {
  const uiLocale = useLocale() as ListingLocale;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full cursor-pointer">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side="bottom" avoidCollisions={false} className="max-h-72">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} className="cursor-pointer">
              {option.plugin ? (
                <span className="flex items-center gap-2">
                  <PluginChip name={option.plugin} locale={uiLocale} />
                </span>
              ) : (
                option.label
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function listingHref(slug: string) {
  return `/bots/${slug}` as const;
}

function DirectoryTable({ bots }: { bots: BotListing[] }) {
  const t = useTranslations();
  const locale = useLocale() as ListingLocale;
  const router = useRouter();

  const handleRowActivate = (slug: string) => {
    router.push(listingHref(slug));
  };

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>, slug: string) => {
    if ((event.target as HTMLElement).closest("a,button")) return;
    if (isModifiedClick(event)) return;
    handleRowActivate(slug);
  };

  return (
    <div className="overflow-x-clip rounded-lg border bg-card [&_[data-slot=table-container]]:overflow-x-clip">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.category")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("table.integrations")}</TableHead>
            <TableHead className="hidden lg:table-cell">{t("table.contributor")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("table.copies")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots.map((bot) => {
            const scored = scoreForSlug(bot.slug);
            return (
            <TableRow
              key={bot.id}
              className="cursor-pointer"
              onClick={(event) => handleRowClick(event, bot.slug)}
            >
              <TableCell className="max-w-[18rem] whitespace-normal">
                <div className="flex min-w-0 items-center gap-2">
                  <ListingFace slug={bot.slug} name={bot.name} size={40} decorative motion />
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <Link
                        href={listingHref(bot.slug)}
                        className="block truncate font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        {bot.name}
                      </Link>
                      <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
                      {scored ? (
                        <ScoreBadge
                          score={scored.score}
                          label={t("rank.scoreAria", { score: scored.score })}
                        />
                      ) : null}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{bot.summary}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <CategoryBadge category={bot.category} label={t(`category.${bot.category}`)} />
              </TableCell>
              <TableCell className="hidden max-w-xs whitespace-normal sm:table-cell">
                <PluginChipList items={bot.integrations} locale={locale} max={3} />
              </TableCell>
              <TableCell className="hidden font-mono text-xs lg:table-cell">
                @{bot.contributor_handle}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span
                  className="font-mono text-xs tabular-nums text-muted-foreground"
                  aria-label={t("a11y.installCount", { count: bot.copy_count })}
                >
                  {bot.copy_count}
                </span>
              </TableCell>
            </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DirectoryCards({ bots }: { bots: BotListing[] }) {
  const t = useTranslations();
  const locale = useLocale() as ListingLocale;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bots.map((bot) => {
        const scored = scoreForSlug(bot.slug);
        return (
        <Link
          key={bot.id}
          href={listingHref(bot.slug)}
          className="rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={bot.name}
        >
          <Card className="h-full rounded-lg transition-colors hover:bg-muted/40">
            <CardHeader>
              <div className="flex items-start gap-3">
                <ListingFace slug={bot.slug} name={bot.name} size={56} decorative motion />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryBadge category={bot.category} label={t(`category.${bot.category}`)} />
                    <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
                    {scored ? (
                      <ScoreBadge
                        score={scored.score}
                        label={t("rank.scoreAria", { score: scored.score })}
                      />
                    ) : null}
                  </div>
                  <CardTitle>{bot.name}</CardTitle>
                  <CardDescription>{bot.summary}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <PluginChipList items={bot.integrations} locale={locale} />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">@{bot.contributor_handle}</span>
                <span
                  className="font-mono text-xs tabular-nums text-muted-foreground"
                  aria-label={t("a11y.installCount", { count: bot.copy_count })}
                >
                  {t("a11y.installCount", { count: bot.copy_count })}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
        );
      })}
    </div>
  );
}
