import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GrokBotMascot } from "@/components/grok-bot-mascot";
import { BRAND_MARK } from "@/lib/brand";

export function BrandLogo() {
  const brand = useTranslations("brand");

  return (
    <Link
      href="/"
      className="flex min-w-0 flex-nowrap items-center gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={brand("name")}
    >
      <GrokBotMascot name={BRAND_MARK.alt} size={BRAND_MARK.width} decorative variant="mark" />
      <span className="whitespace-nowrap text-sm font-semibold tracking-tight">{brand("name")}</span>
    </Link>
  );
}
