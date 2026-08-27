import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";
import { LOCALES, type AppLocale } from "@/lib/locales";

export const locales = LOCALES;
export type { AppLocale };

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
  localeCookie: false,
});

export function toAppLocale(locale: string): AppLocale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
