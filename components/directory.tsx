"use client";

import { useMemo, useState } from "react";
import { LayoutGridIcon, ListIcon, SlidersHorizontalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CategoryBadge, KindBadge } from "@/components/listing-badges";
import { CopyButton } from "@/components/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

type ViewMode = "table" | "cards";

type Props = {
  bots: BotListing[];
  integrations: string[];
  uiLocale: ListingLocale;
  demoMode: boolean;
};

const ALL = "all";

export function Directory({ bots, integrations, uiLocale, demoMode }: Props) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | typeof ALL>(ALL);
  const [integration, setIntegration] = useState(ALL);
  const [locale, setLocale] = useState<ListingLocale | typeof ALL>(uiLocale);
  const [kind, setKind] = useState<BotKind | typeof ALL>(ALL);
  const [view, setView] = useState<ViewMode>("table");

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

  const filterFields = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <FilterSelect
        id="category"
        label={t("filters.category")}
        value={category}
        onChange={(value) => setCategory(value as Category | typeof ALL)}
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
        id="integration"
        label={t("filters.integration")}
        value={integration}
        onChange={setIntegration}
        placeholder={t("filters.anyIntegration")}
        options={[
          { value: ALL, label: t("filters.anyIntegration") },
          ...integrations.map((item) => ({ value: item, label: item })),
        ]}
      />
      <FilterSelect
        id="locale"
        label={t("filters.locale")}
        value={locale}
        onChange={(value) => setLocale(value as ListingLocale | typeof ALL)}
        placeholder={t("filters.anyLocale")}
        options={[
          { value: ALL, label: t("filters.anyLocale") },
          { value: "ko", label: "한국어" },
          { value: "en", label: "English" },
        ]}
      />
      <FilterSelect
        id="kind"
        label={t("filters.kind")}
        value={kind}
        onChange={(value) => setKind(value as BotKind | typeof ALL)}
        placeholder={t("filters.anyKind")}
        options={[
          { value: ALL, label: t("filters.anyKind") },
          { value: "bot", label: t("kind.bot") },
          { value: "team", label: t("kind.team") },
        ]}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {demoMode ? (
        <p className="rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
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
          <div className="hidden lg:block">{/* filters sit below on desktop */}</div>
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
              <div className="px-4 pb-6">{filterFields}</div>
            </SheetContent>
          </Sheet>
          <div className="inline-flex rounded-lg border p-0.5" role="group" aria-label="View">
            <Button
              type="button"
              size="sm"
              variant={view === "table" ? "secondary" : "ghost"}
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
            >
              <ListIcon />
              {t("home.viewTable")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={view === "cards" ? "secondary" : "ghost"}
              aria-pressed={view === "cards"}
              onClick={() => setView("cards")}
            >
              <LayoutGridIcon />
              {t("home.viewCards")}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">{filterFields}</div>

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>{t("home.results", { count: filtered.length })}</p>
        <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
          {t("home.clearFilters")}
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed px-6 py-16 text-center">
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
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DirectoryTable({ bots }: { bots: BotListing[] }) {
  const t = useTranslations();

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.bot")}</TableHead>
            <TableHead>{t("table.category")}</TableHead>
            <TableHead className="hidden md:table-cell">{t("table.kind")}</TableHead>
            <TableHead className="hidden sm:table-cell">{t("table.integrations")}</TableHead>
            <TableHead className="hidden lg:table-cell">{t("table.source")}</TableHead>
            <TableHead className="text-right">{t("table.copies")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bots.map((bot) => (
            <TableRow key={bot.id}>
              <TableCell className="max-w-[18rem] whitespace-normal">
                <Link href={`/bots/${bot.slug}`} className="font-medium hover:underline">
                  {bot.name}
                </Link>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{bot.summary}</p>
              </TableCell>
              <TableCell>
                <CategoryBadge category={bot.category} label={t(`category.${bot.category}`)} />
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
              </TableCell>
              <TableCell className="hidden max-w-xs whitespace-normal sm:table-cell">
                <IntegrationList items={bot.integrations} />
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                @{bot.contributor_handle}
              </TableCell>
              <TableCell className="text-right tabular-nums">{bot.copy_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function DirectoryCards({ bots }: { bots: BotListing[] }) {
  const t = useTranslations();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bots.map((bot) => (
        <Card key={bot.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={bot.category} label={t(`category.${bot.category}`)} />
              <KindBadge kind={bot.kind} label={t(`kind.${bot.kind}`)} />
            </div>
            <CardTitle>
              <Link href={`/bots/${bot.slug}`} className="hover:underline">
                {bot.name}
              </Link>
            </CardTitle>
            <CardDescription>{bot.summary}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <IntegrationList items={bot.integrations} />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">@{bot.contributor_handle}</span>
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

function IntegrationList({ items }: { items: string[] }) {
  if (items.length === 0) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge key={item} variant="outline">
          {item}
        </Badge>
      ))}
    </div>
  );
}
