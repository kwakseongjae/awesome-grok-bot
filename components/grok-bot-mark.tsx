import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  motion?: boolean;
};

/** Official Grok Bot face mark (white sphere, black pill eyes). */
export function GrokBotMark({ className, motion = false }: Props) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-[22%] border border-border bg-black",
        motion && "mark-idle",
        className,
      )}
      aria-hidden
    >
      <Image
        src="/brand/grok-bot-official.png"
        alt=""
        width={96}
        height={96}
        unoptimized
        className="size-full object-cover"
      />
    </span>
  );
}
