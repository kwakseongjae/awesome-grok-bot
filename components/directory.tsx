"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { LayoutGridIcon, ListIcon, SlidersHorizontalIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { CategoryBadge, KindBadge } from "@/components/listing-badges";
import { CopyButton } from "@/components/copy-button";
import { PluginChip, PluginChipList } from "@/components/plugin-chip";
import { Button, buttonVariants } from "@/components/ui/button";
import { directoryViewHref, type DirectoryView } from "@/lib/directory-view";
import { integrationLabel } from "@/lib/integrations";
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
import { CATEGORIES, type BotListing, type BotKind, type Category, type ListingLocale } from "@/lib/types";

type Props = {
  bots: BotListing[];
  integrations: string[];
  uiLocale: ListingLocale;
  demoMode: boolean;
  view: DirectoryView;
};

const ALL = "all";

export function Directory({ bots, integrations, uiLocale, demoMode, view: serverView }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [view, setView] = useState(serverView);
  const [prevServerView, setPrevServerView] = useState(serverView);
  if (prevServerView !== serverView) {
    setPrevServerView(serverView);
    setView(serverView);
  }
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | typeof ALL>(ALL);
  const [integration, setIntegration] = useState(ALL);
  const [locale, setLocale] = useState<ListingLocale | typeof ALL>(uiLocale);
  const [kind, setKind] = useState<BotKind | typeof ALL>(ALL);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return bots.filter((bot) => {
      if (category !== ALL && bot.category !== category) return false;
      if (integration !== ALL && !bot.integrations.includes(integration)) return false;
      if (locale !== ALL && bot.locale !== locale) return false;
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
  }, [bots, category, integration, kind, locale, query]);

  const handleClear = () => {
    setQuery("");
    setCategory(ALL);
    setIntegration(ALL);
    setLocale(ALL);
    setKind(ALL);
  };

  const handleViewClick = (
    event: MouseEvent<HTMLAnchorElement>,
    next: DirectoryView,
  ) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    router.replace(next === "cards" ? `${pathname}?view=cards` : pathname);
    setView(next);
  };

  const filterFieldProps = {
    category,
    integration,
    locale,
    kind,
    integrations,
    onCategoryChange: (value: string) => setCategory(value as Category | typeof ALL),
    onIntegrationChange: setIntegration,
    onLocaleChange: (value: string) => setLocale(value as ListingLocale | typeof ALL),
    onKindChange: (value: string) => setKind(value as BotKind | typeof ALL),
  };

  return (
    <div className="space-y-6">
      {demoMode ? (
        <p className="rounded-md border border-dashed bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {t("home.demoBanner")}
        </p>
      ) : null}

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
              href={directoryViewHref("table")}
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
              href={directoryViewHref("cards")}
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

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p className="font-mono tabular-nums">{t("home.results", { count: filtered.length })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
          {t("home.clearFilters")}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-16 text-center">
          <p className="font-medium">{t("home.empty")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("home.emptyHint")}</p>
        </div>
      ) : view === "table" ? (
        <DirectoryTable bots={filtered} />
      ) : (
        <DirectoryCards bots={filtered} />
      )}
    </div>
  );
}

function FilterFields({
  idPrefix,
  category,
  integration,
  locale,
  kind,
  integrations,
  onCategoryChange,
  onIntegrationChange,
  onLocaleChange,
  onKindChange,
}: {
  idPrefix: string;
  category: string;
  integration: string;
  locale: string;
  kind: string;
  integrations: string[];
  onCategoryChange: (value: string) => void;
  onIntegrationChange: (value: string) => void;
  onLocaleChange: (value: string) => void;
  onKindChange: (value: string) => void;
}) {
  const t = useTranslations();
  const uiLocale = useLocale() as ListingLocale;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        id={`${idPrefix}-locale`}
        label={t("filters.locale")}
        value={locale}
        onChange={onLocaleChange}
        placeholder={t("filters.anyLocale")}
        options={[
          { value: ALL, label: t("filters.anyLocale") },
          { value: "ko", label: "한국어" },
          { value: "en", label: "English" },
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
        <SelectContent>
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

function DirectoryTable({ bots }: { bots: BotListing[] }) {
  const t = useTranslations();
  const locale = useLocale() as ListingLocale;

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.category")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("table.integrations")}</TableHead>
            <TableHead className="hidden lg:table-cell">{t("table.contributor")}</TableHead>
            <TableHead className="text-right">{t("table.copies")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots.map((bot) => (
            <TableRow key={bot.id}>
              <TableCell className="max-w-[20rem] whitespace-normal">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/bots/${bot.slug}`}
                    className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {bot.name}
                  </Link>
                  <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{bot.summary}</p>
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
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span
                    className="font-mono text-xs tabular-nums text-muted-foreground"
                    aria-label={t("a11y.installCount", { count: bot.copy_count })}
                  >
                    {bot.copy_count}
                  </span>
                  <CopyButton
                    text={bot.prompt}
                    label={t("bot.copy")}
                    copiedLabel={t("bot.copied")}
                    ariaLabel={t("a11y.copyPrompt", { name: bot.name })}
                    botId={bot.id}
                    size="sm"
                    variant="outline"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
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
      {bots.map((bot) => (
        <Card key={bot.id} className="rounded-lg">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={bot.category} label={t(`category.${bot.category}`)} />
              <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
            </div>
            <CardTitle>
              <Link
                href={`/bots/${bot.slug}`}
                className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {bot.name}
              </Link>
            </CardTitle>
            <CardDescription>{bot.summary}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <PluginChipList items={bot.integrations} locale={locale} />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-muted-foreground">@{bot.contributor_handle}</span>
              <CopyButton
                text={bot.prompt}
                label={t("bot.copy")}
                copiedLabel={t("bot.copied")}
                ariaLabel={t("a11y.copyPrompt", { name: bot.name })}
                botId={bot.id}
                size="sm"
                variant="outline"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
