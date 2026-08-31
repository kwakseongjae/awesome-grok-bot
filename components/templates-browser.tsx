"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { XTemplateCard } from "@/components/x-template-card";
import { cn } from "@/lib/utils";
import { X_TEMPLATE_TAGS, type XTemplate, type XTemplateTag } from "@/lib/templates";

const TAG_KEYS: Record<XTemplateTag, "tagCoding" | "tagOps" | "tagCredit" | "tagCreative" | "tagPersonal"> = {
  coding: "tagCoding",
  ops: "tagOps",
  credit: "tagCredit",
  creative: "tagCreative",
  personal: "tagPersonal",
};

export function TemplatesBrowser({ items }: { items: XTemplate[] }) {
  const t = useTranslations("templates");
  const [tag, setTag] = useState<XTemplateTag | "all">("all");
  const filtered = useMemo(
    () => (tag === "all" ? items : items.filter((item) => item.tags.includes(tag))),
    [items, tag],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip active={tag === "all"} onClick={() => setTag("all")}>
          {t("tagAll")}
        </FilterChip>
        {X_TEMPLATE_TAGS.map((item) => (
          <FilterChip key={item} active={tag === item} onClick={() => setTag(item)}>
            {t(TAG_KEYS[item])}
          </FilterChip>
        ))}
      </div>
      <p className="font-mono text-xs text-muted-foreground">{t("count", { count: filtered.length })}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <li key={item.id}>
            <XTemplateCard item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer rounded-md border px-2.5 py-1 text-xs focus-visible:ring-3 focus-visible:ring-ring/50",
        active ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
