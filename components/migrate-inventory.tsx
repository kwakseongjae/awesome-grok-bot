"use client";

import { useTranslations } from "next-intl";
import type { Phase0Inventory } from "@/lib/migrate/types";

type Props = {
  inventory: Phase0Inventory;
};

export function MigrateInventory({ inventory }: Props) {
  const t = useTranslations("migrate.playbook");

  return (
    <section className="space-y-3 rounded-lg border bg-card p-4">
      <h2 className="text-sm font-semibold tracking-tight">{t("inventoryPreview")}</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        {t("skippedSecrets", { count: inventory.skippedSecrets.length })}
      </p>
      <pre className="max-h-80 overflow-auto text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
        {inventory.table}
      </pre>
    </section>
  );
}
