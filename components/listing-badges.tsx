import { Badge } from "@/components/ui/badge";
import type { BotKind, Category } from "@/lib/types";

export function CategoryBadge({
  label,
}: {
  category: Category;
  label: string;
}) {
  return (
    <Badge variant="outline" className="rounded-md font-normal">
      {label}
    </Badge>
  );
}

export function KindBadge({ kind, label }: { kind: BotKind; label: string }) {
  return (
    <Badge
      variant={kind === "team" ? "default" : "outline"}
      className="rounded-md font-normal"
    >
      {label}
    </Badge>
  );
}
