"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  appearance?: "label" | "icon";
};

export function LocaleSwitcher({ appearance = "label" }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("a11y");
  const nextLocale = locale === "ko" ? "en" : "ko";

  const handleClick = () => {
    const query = window.location.search;
    router.replace(`${pathname}${query}`, { locale: nextLocale });
  };

  if (appearance === "icon") {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleClick}
        aria-label={t("localeSwitch")}
      >
        <Languages />
      </Button>
    );
  }

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
