import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";

export const locales = ["ko", "en"] as const;
export type AppLocale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "ko",
  localePrefix: "always",
  localeDetection: true,
});

export function toAppLocale(locale: string): AppLocale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
