import { GrokBotFace } from "@/components/grok-bot-face";
import { cn } from "@/lib/utils";

type Props = {
  slug?: string;
  name: string;
  size?: number;
  className?: string;
  decorative?: boolean;
  motion?: boolean;
};

export function ListingFace({
  name,
  size = 40,
  className,
  decorative = false,
  motion = false,
}: Props) {
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
