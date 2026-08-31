import type { HandoffSource } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";
import { SITE_ORIGIN } from "@/lib/site";

export const PORTER_SLUGS = {
  hermes: "porter-hermes",
  openclaw: "porter-openclaw",
} as const;

export const porterSlug = (source: HandoffSource) => PORTER_SLUGS[source];

export const porterName = (_locale: ListingLocale, source: HandoffSource) => {
  const src = source === "hermes" ? "Hermes" : "OpenClaw";
  return `Portato · ${src}`;
};

export const porterListingPath = (locale: ListingLocale, source: HandoffSource) =>
  `${SITE_ORIGIN}/${locale}/bots/${porterSlug(source)}`;

export const porterXText = (locale: ListingLocale, source: HandoffSource) => {
  const url = porterListingPath(locale, source);
  const src = source === "hermes" ? "Hermes" : "OpenClaw";
  if (locale === "ko") {
    return `에이전트 다시 만들지 마. 옮겨.\n\nPortato: ${src} → Grok Bot. 키는 안 옮김.\n\n1. Portato 설치\n2. ${src}에 한 줄\n3. 골드 태스크 3–5\n4. 컷오버\n\n${url}`;
  }
  return `Don't rebuild your agent. Carry it.\n\nPortato moves ${src} → Grok Bot. Keys stay behind.\n\n1. Add Portato\n2. Paste one line into ${src}\n3. Gold tasks 3–5\n4. Cut over\n\n${url}`;
};

export const porterThreadsText = (locale: ListingLocale, source: HandoffSource) => {
  const url = porterListingPath(locale, source);
  const src = source === "hermes" ? "Hermes" : "OpenClaw";
  if (locale === "ko") {
    return `Grok Bot으로 옮길 때 처음부터 다시 만들지 마세요.\n\nPortato는 ${src} 프로필을 Grok Bot Chief 하나로 이전하는 템플릿입니다. 키·세션·.env는 남기고, 골드 태스크 3–5개가 통과한 뒤에만 컷오버합니다.\n\n설치: ${url}\n스킬: ${SITE_ORIGIN}/${locale}/migrate/${source}`;
  }
  return `Do not rebuild when you move to Grok Bot.\n\nPortato is the template that carries a ${src} profile into one Grok Bot Chief. Keys, sessions, and .env stay behind. Cut over only after 3–5 gold tasks pass.\n\nInstall: ${url}\nSkill: ${SITE_ORIGIN}/${locale}/migrate/${source}`;
};

export const intentPostUrl = (host: "x" | "threads", text: string) => {
  const encoded = encodeURIComponent(text);
  return host === "x"
    ? `https://x.com/intent/post?text=${encoded}`
    : `https://www.threads.net/intent/post?text=${encoded}`;
};
