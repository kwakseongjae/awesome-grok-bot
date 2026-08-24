"use client";

import { Suspense } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, LOCALE_LABELS, type AppLocale } from "@/lib/locales";
import { cn } from "@/lib/utils";

type Props = {
  appearance?: "label" | "icon";
};

function LocaleSwitcherInner({ appearance = "label" }: Props) {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("a11y");
  const query = searchParams.toString();
  const href = query ? `${pathname}?${query}` : pathname;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {appearance === "icon" ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            aria-label={t("localeSwitch")}
          >
            <Languages />
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer gap-1"
            aria-label={t("localeSwitch")}
          >
            {LOCALE_LABELS[locale] ?? locale}
            <ChevronDown className="size-3.5 opacity-60" aria-hidden />
          </Button>
        )}
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-auto min-w-40">
        {LOCALES.map((item) => (
          <DropdownMenuItem key={item} asChild className="cursor-pointer">
            <Link
              href={href}
              locale={item}
              scroll={false}
              className="cursor-pointer"
              aria-current={item === locale ? "true" : undefined}
            >
              <span className="flex-1">{LOCALE_LABELS[item]}</span>
              {item === locale ? <Check className="size-4" aria-hidden /> : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LocaleSwitcher({ appearance = "label" }: Props) {
  return (
    <Suspense
      fallback={
        <span
          className={cn(
            buttonVariants({
              variant: appearance === "icon" ? "ghost" : "outline",
              size: appearance === "icon" ? "icon" : "sm",
            }),
            "pointer-events-none opacity-0",
          )}
          aria-hidden
        />
      }
    >
      <LocaleSwitcherInner appearance={appearance} />
    </Suspense>
  );
}
