import type { CSSProperties } from "react";
import { grainInk, type GrainTone } from "@/lib/templates";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  tone: GrainTone;
  seed?: number;
  size: "hero" | "card";
};

export function GrainThumb({ title, tone, seed = 0, size }: Props) {
  const ink = grainInk(tone);

  return (
    <div
      className={cn(
        "grain-thumb relative w-full overflow-hidden",
        size === "hero" ? "aspect-[2400/1260]" : "aspect-[1024/537]",
      )}
      data-tone={tone}
      data-ink={ink}
      style={{ "--grain-seed": `${seed}deg` } as CSSProperties}
      aria-hidden="true"
    >
      <span
        className={cn(
          "grain-thumb-title absolute inset-0 z-1 flex items-center justify-center px-5 text-center font-semibold tracking-tight",
          size === "hero" ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-xl",
        )}
      >
        {title}
      </span>
    </div>
  );
}
