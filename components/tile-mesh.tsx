import { COLORS, type ColorId } from "@/lib/grok-bot-blob";
import { cn } from "@/lib/utils";

type Props = {
  color?: ColorId;
  className?: string;
};

/** Listing-palette field for official-style guide tiles. Not UI chrome. */
export function TileMesh({ color = "encre", className }: Props) {
  const fill = COLORS[color];

  return (
    <div className={cn("absolute inset-0 bg-foreground", className)} aria-hidden>
      <div
        className="absolute -top-[20%] -right-[15%] size-[85%] rounded-full opacity-80 blur-3xl"
        style={{ backgroundColor: fill }}
      />
      <div
        className="absolute -bottom-[25%] -left-[20%] size-[75%] rounded-full opacity-55 blur-3xl"
        style={{ backgroundColor: fill }}
      />
    </div>
  );
}
