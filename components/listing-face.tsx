import { GrokBotBlob } from "@/components/grok-bot-blob";
import { GrokBotFace } from "@/components/grok-bot-face";
import { skinForFace } from "@/lib/grok-bot-blob";
import { cn } from "@/lib/utils";

type Props = {
  slug?: string;
  seed?: string;
  name: string;
  size?: number;
  className?: string;
  decorative?: boolean;
  motion?: boolean;
  play?: boolean;
  phase?: number;
};

export function ListingFace({
  slug,
  seed,
  name,
  size,
  className,
  decorative = false,
  motion = false,
  play = false,
  phase = 0,
}: Props) {
  const skin = skinForFace(slug, seed);

  if (!skin) {
    return (
      <GrokBotFace
        name={name}
        size={size}
        decorative={decorative}
        motion={motion}
        className={cn("border border-border bg-muted", className)}
      />
    );
  }

  return (
    <GrokBotBlob
      skin={skin}
      name={name}
      size={size}
      decorative={decorative}
      motion={motion}
      play={play}
      phase={phase}
      className={className}
    />
  );
}
