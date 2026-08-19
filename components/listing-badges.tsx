import { Badge } from "@/components/ui/badge";
import type { BotKind, Category } from "@/lib/types";

const categoryClass: Record<Category, string> = {
  productivity: "bg-amber-100 text-amber-950 dark:bg-amber-400/15 dark:text-amber-100",
  sales: "bg-sky-100 text-sky-950 dark:bg-sky-400/15 dark:text-sky-100",
  marketing: "bg-violet-100 text-violet-950 dark:bg-violet-400/15 dark:text-violet-100",
  ops: "bg-emerald-100 text-emerald-950 dark:bg-emerald-400/15 dark:text-emerald-100",
  success: "bg-rose-100 text-rose-950 dark:bg-rose-400/15 dark:text-rose-100",
  personal: "bg-orange-100 text-orange-950 dark:bg-orange-400/15 dark:text-orange-100",
};

export function CategoryBadge({
  category,
  label,
}: {
  category: Category;
  label: string;
}) {
  return (
    <Badge variant="secondary" className={categoryClass[category]}>
      {label}
    </Badge>
  );
}

export function KindBadge({ kind, label }: { kind: BotKind; label: string }) {
  return (
    <Badge variant={kind === "team" ? "default" : "outline"}>{label}</Badge>
  );
}
