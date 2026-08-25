export const LOCALES = ["en", "ko", "ja", "zh-CN", "zh-TW"] as const;

export type AppLocale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
};

export const LOCALE_OG: Record<AppLocale, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  "zh-CN": "zh_CN",
  "zh-TW": "zh_TW",
};

export const isAppLocale = (value: unknown): value is AppLocale =>
  typeof value === "string" && (LOCALES as readonly string[]).includes(value);

export const localeCollator = (locale: string) => (isAppLocale(locale) ? locale : "en");
