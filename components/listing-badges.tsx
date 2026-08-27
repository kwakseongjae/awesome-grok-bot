import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

export function ScoreBadge({
  score,
  outOf = 10,
  label,
  className,
}: {
  score: number;
  outOf?: number;
  label?: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md font-mono font-normal tabular-nums", className)}
      aria-label={label ?? `${score}/${outOf}`}
    >
      {score}/{outOf}
    </Badge>
  );
}
