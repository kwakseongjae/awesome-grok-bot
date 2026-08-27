import { hasLocale } from "next-intl";
import { defineRouting } from "next-intl/routing";
import { LOCALES, type AppLocale } from "@/lib/locales";

export const locales = LOCALES;
export type { AppLocale };

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: "en",
  localePrefix: "always",
  // Unprefixed `/` must land on `/en`. Accept-Language would otherwise
  // send Korean (and other non-English) browsers to `/ko` etc.
  localeDetection: false,
  localeCookie: false,
});

export function toAppLocale(locale: string): AppLocale {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
