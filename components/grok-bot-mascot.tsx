import Image from "next/image";
import { BRAND_MARK } from "@/lib/brand";
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
  const src = variant === "mark" ? BRAND_MARK.src : "/brand/mascot/awesome.png";
  const intrinsic = size ?? (variant === "mark" ? BRAND_MARK.width : 256);

  return (
    <span
      className={cn("relative inline-block shrink-0 overflow-visible", className)}
      style={size || variant === "mark" ? { width: intrinsic, height: intrinsic } : undefined}
    >
      <Image
        src={src}
        alt={decorative ? "" : variant === "mark" ? BRAND_MARK.alt : name}
        width={intrinsic * 2}
        height={intrinsic * 2}
        priority={variant === "hero"}
        unoptimized
        className="mascot-edge size-full bg-transparent object-contain object-center"
      />
    </span>
  );
};
