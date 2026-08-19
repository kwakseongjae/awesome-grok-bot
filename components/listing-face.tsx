import Image from "next/image";
import { BRAND, listingFaceSrc } from "@/lib/faces";
import { cn } from "@/lib/utils";

type Props = {
  slug?: string;
  src?: string;
  name: string;
  size?: number;
  crop?: number;
  className?: string;
  decorative?: boolean;
  priority?: boolean;
};

export function ListingFace({
  slug,
  src,
  name,
  size = 40,
  crop = 0,
  className,
  decorative = false,
  priority = false,
}: Props) {
  const imageSrc = src ?? (slug ? listingFaceSrc(slug) : BRAND.mark);
  const position = crop === 0 ? "50% 18%" : `${50 + crop}% ${18 + crop / 2}%`;

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full border border-border bg-muted",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={imageSrc}
        alt={decorative ? "" : name}
        fill
        sizes={`${size}px`}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </span>
  );
}
