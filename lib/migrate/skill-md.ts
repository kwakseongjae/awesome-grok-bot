import { SITE_ORIGIN } from "../site";
import { PHASE_IDS } from "./playbook";
import { phasePrompt } from "./phase-prompts";
import { sourceLabel } from "./source";
import type { HandoffSource } from "./types";
import type { ListingLocale } from "../types";

export const SKILL_NAME = "grok-bot-migrate";

export const skillUrl = (origin: string, source: HandoffSource, locale: ListingLocale) =>
  `${origin.replace(/\/$/, "")}/api/migrate/skill/${source}?locale=${locale}`;

export const installCommand = (origin: string, source: HandoffSource, locale: ListingLocale) => {
  const url = skillUrl(origin, source, locale);
  if (source === "hermes") {
    return `hermes skills install ${url} --category productivity --name ${SKILL_NAME} --yes`;
  }
  return `mkdir -p skills/${SKILL_NAME} && curl -fsSL ${url} -o skills/${SKILL_NAME}/SKILL.md`;
};

export const starterPrompt = (input: {
  origin: string;
  source: HandoffSource;
  locale: ListingLocale;
}) => {
  const install = installCommand(input.origin, input.source, input.locale);
  const label = sourceLabel(input.source);
  if (input.locale === "ko") {
    return `${label}를 Grok Bot으로 마이그레이션 해줘. 이 스킬을 설치하거나 문서를 읽고 그대로 진행해.

${install}

키는 옮기지 마. 첫 봇은 Chief 하나. 골드 태스크 3–5개를 먼저 물어봐.`;
  }
  return `Migrate this ${label} profile into Grok Bot. Install or fetch this skill, then follow it.

${install}

Do not move keys. First Bot is one Chief. Ask for 3–5 gold tasks first.`;
};

/** Canonical getgrokbot.com paste. Never wait on `window.location`. */
export const pasteInstallCommand = (source: HandoffSource, locale: ListingLocale) =>
  installCommand(SITE_ORIGIN, source, locale);

export const pasteStarter = (source: HandoffSource, locale: ListingLocale) =>
  starterPrompt({ origin: SITE_ORIGIN, source, locale });

/** One English share URL per source. Locale pages stay on /{locale}/migrate/{source}. */
export const templateShareUrl = (source: HandoffSource) =>
  `${SITE_ORIGIN}/en/migrate/${source}`;

const SECRET_DENY = [
  ".env",
  "auth.json",
  "state.db",
  "*.pem",
  "*token*",
  "*apiKey*",
  "*botToken*",
  "SecretRef",
  "session",
  "transcript",
].join(", ");

export const renderSkillMarkdown = (source: HandoffSource, locale: ListingLocale) => {
  const ko = locale === "ko";
  const label = sourceLabel(source);
  const phases = PHASE_IDS.map((phase) => {
    const pack = phasePrompt({
      source,
      phase,
      locale,
      goldNames: ko ? ["(사람에게 받은 골드 태스크)"] : ["(gold tasks from the human)"],
      skillTitles: ko ? ["(인벤토리)"] : ["(from inventory)"],
    });
    const chief = pack.chief
      ? ko
        ? `\n\n#### Grok Chief (이 페이즈에서만)\n\n${pack.chief}`
        : `\n\n#### Grok Chief (this phase only)\n\n${pack.chief}`
      : "";
    const title = ko ? `페이즈 ${phase}` : `Phase ${phase}`;
    return `### ${title}\n\n${pack.source}${chief}`;
  }).join("\n\n");

  const inventory =
    source === "hermes"
      ? ko
        ? "읽을 것: SOUL.md, USER.md, MEMORY.md, memories/*.md, skills/*/SKILL.md, cron. 홈은 보통 ~/.hermes."
        : "Read: SOUL.md, USER.md, MEMORY.md, memories/*.md, skills/*/SKILL.md, cron. Home is usually ~/.hermes."
      : ko
        ? "읽을 것: 워크스페이스 직접. zip만 있으면 경로를 받는다. SOUL.md, AGENTS.md, USER.md, MEMORY.md, memory/*.md, HEARTBEAT.md, openclaw.json, cron/jobs.json, skills. hermes claw migrate는 선택 정리일 뿐 본선이 아니다. --migrate-secrets 금지."
        : "Read the workspace directly. If only a zip exists, take a path. SOUL.md, AGENTS.md, USER.md, MEMORY.md, memory/*.md, HEARTBEAT.md, openclaw.json, cron/jobs.json, skills. `hermes claw migrate` is optional tidy, not the Grok path. Do not use --migrate-secrets.";

  if (ko) {
    return `---
name: ${SKILL_NAME}
description: ${label} 프로필을 Grok Bot Chief 하나로 이전한다. 마이그레이션, 이전, Grok Bot으로 옮겨줘 라고 하면 쓴다.
version: 0.1.0
license: MIT
metadata:
  hermes:
    tags: [migration, grok-bot, handoff]
    related_skills: [computer-use]
---

# ${label} → Grok Bot

이 스킬이 플레이북이다. 웹 체크박스를 기다리지 마라. 사이트는 이 문서를 배포할 뿐 Grok에 쓰지 않는다.

## When to Use

사용자가 마이그레이션, 이전, 옮겨줘, migrate, Grok Bot으로 라고 하면 이 스킬만 로드한다.

## 운영 규칙

- 당신은 운영자다. 사람은 골드 태스크, 로그인 벽, leftover 서명만 한다.
- Grok Bot에는 Hermes/OpenClaw importer와 생성 API가 없다. 기본 경로는 패킷이다. computer-use로 Grok 앱을 조작하는 것은 보조다. 앱을 못 열면 실패가 아니다. Copy를 한 패킷씩 준다.
- 첫 봇은 Chief 하나. 이 스킬로 Nexus·전문 봇·Seeder를 만들지 마라.
- 페이즈 0→6을 순서대로. 빨리 하라고 해도 건너뛰지 마라. 현재 페이즈 실패 조건을 보여 주고 멈춰라.
- 골드 태스크 3–5개(이름, 입력, 기대 출력)가 없으면 인벤토리 다음에 멈춰라. 기억 복원율은 성공 기준이 아니다.
- 시크릿을 열거나 출력하거나 옮기지 마라. 거부 목록: ${SECRET_DENY}. 있으면 \`skipped: secret\` 한 줄만.
- 일일 노트, DREAMS, HEARTBEAT는 기본 큐에서 빼라.
- 소스 cron과 Grok 루틴을 동시에 켜지 마라. Test run은 실동작이다.
- 이 인수 대화를 통째로 기억에 저장하지 마라.

${inventory}

## 첫 메시지

인벤토리 표, 건너뛴 비밀 파일 수(내용은 없음), 골드 태스크 질문. Grok을 아직 만지지 마라.

## Procedure

${phases}

## 게이트

비밀번호 / SSO / 2FA / 패스키 / 매직 링크 / CAPTCHA / 결제 화면에서 즉시 멈춰라.
보고: \`게이트: {종류} / 사이트: {이름} / 사람 할 일: {클릭} / 다음: {패킷}\`
「계속」 전에는 다음 페이즈로 가지 마라.

## Verification

골드 태스크가 Grok에서 통과하고 소스 스케줄이 꺼져 있을 때만 컷오버. 기억이 비슷해 보이는 것은 통과가 아니다.
`;
  }

  return `---
name: ${SKILL_NAME}
description: Migrate this ${label} profile into one Grok Bot Chief. Use when the user says migrate, hand off, or move to Grok Bot.
version: 0.1.0
license: MIT
metadata:
  hermes:
    tags: [migration, grok-bot, handoff]
    related_skills: [computer-use]
---

# ${label} → Grok Bot

This skill is the playbook. Do not wait for website checkboxes. The site only publishes this document. It does not write to Grok.

## When to Use

Load only this skill when the user says migrate, hand off, move, or Grok Bot.

## Operating rules

- You are the operator. The human only supplies gold tasks, login walls, and leftover sign-off.
- Grok Bot has no Hermes/OpenClaw importer and no create API. Packets are the default path. Computer-use on the Grok app is optional. Failing to open the app is not a fail — give Copy one packet at a time.
- First Bot is one Chief. Do not spawn a Nexus, specialist Bots, or a Seeder from this skill.
- Phases 0→6 in order. If the user says to hurry, refuse and show the current fail condition.
- Stop after inventory unless you have 3–5 gold tasks (name, input, expected output). Memory-restore rate is not success.
- Do not open, print, or move secrets. Deny: ${SECRET_DENY}. If present, write only \`skipped: secret\`.
- Daily notes, DREAMS, and HEARTBEAT stay off the default queue.
- Never run source cron and Grok routines live together. Test run is real.
- Do not save this whole handoff thread as memory.

${inventory}

## First message

Inventory table, count of skipped secret files (no values), then ask for gold tasks. Do not touch Grok yet.

## Procedure

${phases}

## Gates

Stop immediately at password / SSO / 2FA / passkey / magic link / CAPTCHA / billing.
Report: \`gate: {kind} / site: {name} / human: {click} / next: {packet}\`
Do not start the next phase until the human says continue.

## Verification

Cut over only when gold tasks pass on Grok and source schedules are off. Looking like the same memory is not a pass.
`;
};

export const assertSkillMarkdown = (markdown: string, source: HandoffSource) => {
  const missing: string[] = [];
  if (!markdown.startsWith("---\n")) missing.push("frontmatter");
  if (!markdown.includes(`name: ${SKILL_NAME}`)) missing.push("name");
  for (const phase of PHASE_IDS) {
    if (!markdown.includes(`Phase ${phase}`) && !markdown.includes(`페이즈 ${phase}`)) {
      missing.push(`phase-${phase}`);
    }
  }
  if (!markdown.includes(".env")) missing.push("secret-deny");
  if (source === "openclaw" && !markdown.includes("openclaw.json")) missing.push("openclaw-inventory");
  if (source === "hermes" && !markdown.includes("SOUL.md")) missing.push("hermes-inventory");
  if (!/Nexus/.test(markdown)) missing.push("nexus-rule");
  return missing;
};
