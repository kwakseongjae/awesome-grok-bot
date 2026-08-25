import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GrokBotMascot } from "@/components/grok-bot-mascot";

export function BrandLogo() {
  const brand = useTranslations("brand");

  return (
    <Link
      href="/"
      className="flex min-w-0 flex-nowrap items-center gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50"
      aria-label={brand("name")}
    >
      <GrokBotMascot name={brand("product")} size={32} decorative variant="mark" />
      <span className="whitespace-nowrap text-sm font-semibold tracking-tight">{brand("name")}</span>
    </Link>
  );
}
