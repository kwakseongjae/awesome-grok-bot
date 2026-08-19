"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("a11y");
  const nextLocale = locale === "ko" ? "en" : "ko";

  const handleClick = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      aria-label={t("localeSwitch")}
    >
      {nextLocale === "en" ? "EN" : "한국어"}
    </Button>
  );
}
