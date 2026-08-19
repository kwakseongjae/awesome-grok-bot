import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BRAND } from "@/lib/faces";

export function BrandLogo() {
  const brand = useTranslations("brand");

  return (
    <Link
      href="/"
      className="flex min-w-0 items-center gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={brand("name")}
    >
      <span className="relative size-8 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        <Image
          src={BRAND.mark}
          alt=""
          fill
          sizes="32px"
          priority
          className="object-cover"
          style={{ objectPosition: "50% 45%" }}
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm font-semibold tracking-tight">{brand("name")}</span>
        <span className="hidden truncate text-[11px] leading-none text-muted-foreground sm:inline">
          {brand("tagline")}
        </span>
      </span>
    </Link>
  );
}
