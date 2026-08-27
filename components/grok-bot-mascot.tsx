import Image from "next/image";
import { MASCOT } from "@/lib/mascot";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  size?: number;
  decorative?: boolean;
  className?: string;
  variant?: "hero" | "mark";
};

export const GrokBotMascot = ({
  name,
  size,
  decorative = false,
  className,
  variant = "hero",
}: Props) => {
  const src = variant === "mark" ? MASCOT.markSrc : MASCOT.heroSrc;
  const intrinsic = size ?? 256;

  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-visible", className)}
      style={size ? { width: size, height: size } : undefined}
    >
      <Image
        src={src}
        alt={decorative ? "" : name}
        width={intrinsic * 2}
        height={intrinsic * 2}
        priority={variant === "hero"}
        unoptimized
        className="mascot-edge size-full bg-transparent object-contain object-center"
      />
    </span>
  );
};
