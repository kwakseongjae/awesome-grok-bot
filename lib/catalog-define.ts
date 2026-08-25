import { promptEn, promptKo } from "@/lib/catalog-prompt";
import type { AppLocale } from "@/lib/locales";
import type { BotKind, Category, TeamMember } from "@/lib/types";

export const USE_CASES_URL = "https://docs.x.ai/grok-bot/use-cases";
export const LAUNCH_URL = "https://x.ai/news/introducing-grok-bot";
export const PRODUCT_URL = "https://x.ai/bot";

export type LocalePair<T> = {
  ko: T;
  en: T;
};

export type CatalogDraft = {
  slug: string;
  index: number;
  kind: BotKind;
  category: Category;
  integrations: string[];
  source_url: string | null;
  added_at: string;
  names: Record<AppLocale, string>;
  summaries: Record<AppLocale, string>;
  titles: LocalePair<string>;
  owns: LocalePair<string[]>;
  good: LocalePair<string[]>;
  never: LocalePair<string[]>;
  first: LocalePair<string>;
  intro?: LocalePair<string>;
  members?: Partial<Record<AppLocale, TeamMember[]>>;
};

export type CatalogItem = CatalogDraft & {
  prompts: LocalePair<string>;
};

export const defineListing = (draft: CatalogDraft): CatalogItem => {
  const plugins = draft.integrations.join(", ");
  return {
    ...draft,
    prompts: {
      ko: promptKo({
        kind: draft.kind,
        name: draft.names.ko,
        title: draft.titles.ko,
        owns: draft.owns.ko,
        good: draft.good.ko,
        never: draft.never.ko,
        first: draft.first.ko,
        intro: draft.intro?.ko,
        plugins,
      }),
      en: promptEn({
        kind: draft.kind,
        name: draft.names.en,
        title: draft.titles.en,
        owns: draft.owns.en,
        good: draft.good.en,
        never: draft.never.en,
        first: draft.first.en,
        intro: draft.intro?.en,
        plugins,
      }),
    },
  };
};
