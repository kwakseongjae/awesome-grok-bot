import { ensureListingSlug } from "@/lib/charter";
import type { HandoffListingDraft, HandoffPacket, HandoffSource } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

const DEFAULT_TZ = "Asia/Seoul";
const MAX_ROUTINES = 50;

function clip(text: string, max = 1400) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}

function firstHeading(text: string) {
  const match = text.match(/^#{1,3}\s+(.+)$/m);
  return match?.[1]?.trim() ?? "";
}

function linesOf(text: string) {
  return text.replace(/\r\n/g, "\n").split("\n");
}

export function splitMemoryChunks(text: string, source: string) {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const headingSplits = normalized.split(/^(?=#{1,3}\s)/m).map((part) => part.trim()).filter(Boolean);
  const units = headingSplits.length > 1 ? headingSplits : normalized.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  let bucket: string[] = [];
  let bucketLines = 0;

  const flush = () => {
    if (bucket.length === 0) return;
    chunks.push(bucket.join("\n\n").trim());
    bucket = [];
    bucketLines = 0;
  };

  for (const unit of units) {
    const count = linesOf(unit).filter((line) => line.trim()).length || 1;
    if (count >= 5 && count <= 12 && bucket.length === 0) {
      chunks.push(unit);
      continue;
    }
    if (bucketLines + count > 12 && bucket.length > 0) {
      flush();
    }
    bucket.push(unit);
    bucketLines += count;
    if (bucketLines >= 5 && bucketLines <= 12) {
      flush();
    }
  }
  flush();

  if (chunks.length === 0) {
    const all = linesOf(normalized);
    for (let index = 0; index < all.length; index += 8) {
      const slice = all.slice(index, index + 8).join("\n").trim();
      if (slice) chunks.push(slice);
    }
  }

  return chunks.map((body, index) => ({
    title: firstHeading(body) || `${source} ${index + 1}`,
    body,
  }));
}

export function memoryPaste(chunk: string, locale: ListingLocale) {
  if (locale === "ko") {
    return `공유 컴퓨터에 FACTS.md가 있으면 그 파일에 이 사실을 넣으세요. 질문에는 파일을 인용하세요. Remember these만 하고 파일을 두지 마세요. 변하는 값은 소스 시스템에서 다시 읽으세요.

${chunk.trim()}`;
  }
  return `If FACTS.md exists on the shared computer, add this standing fact to that file. Quote the file when asked. Do not only say “remember these.” Re-read source systems for values that change.

${chunk.trim()}`;
}

export function skillPaste(name: string, body: string, locale: ListingLocale) {
  if (locale === "ko") {
    return `Save the process below as a Grok Bot skill called “${name}”.
A skill is how. Do the task once if you still need an example, then save the method. Do not schedule it yet.

When to use
- ${name} 작업이 다시 필요할 때.

Required inputs and access
- 아래 본문에 적힌 도구·파일만. 토큰이나 비밀은 다시 묻는다.

Sequence
${clip(body, 1600)}

How to validate
- 출처가 있는 결과만 남긴다. 추측이면 추측이라고 쓴다.

What to return
- 사람이 고칠 수 있는 짧은 초안.

What requires approval
- 외부 발송, 결제, 삭제, 게시, 프로덕션 변경.

This directory cannot write xAI skill APIs. Paste this into that Bot's chat.`;
  }
  return `Save the process below as a Grok Bot skill called “${name}”.
A skill is how. Do the task once if you still need an example, then save the method. Do not schedule it yet.

When to use
- When this ${name} job comes up again.

Required inputs and access
- Only the tools and files named below. Ask again for any secret; none were migrated.

Sequence
${clip(body, 1600)}

How to validate
- Keep sourced results. Label guesses as guesses.

What to return
- A short draft a person can edit.

What requires approval
- Sending, paying, deleting, publishing, or changing production systems.

This directory cannot write xAI skill APIs. Paste this into that Bot's chat.`;
}

function describeSchedule(raw: string | undefined, locale: ListingLocale) {
  const value = (raw ?? "").trim();
  if (!value) {
    return locale === "ko"
      ? `평일 10:00 (${DEFAULT_TZ}) — 출처에 시각이 없어 보수적으로 재작성`
      : `Weekdays 10:00 (${DEFAULT_TZ}) — conservative recreation; source had no clock time`;
  }
  const every = value.match(/every\s+(\d+)\s*(m|min|minutes|h|hr|hours|d|day)/i);
  if (every) {
    const amount = every[1];
    const unit = every[2].toLowerCase();
    if (unit.startsWith("m")) {
      return locale === "ko"
        ? `평일 10:00, 13:00, 16:00 (${DEFAULT_TZ}) — 출처 간격 ${amount}분이 너무 잦아 평일 주간으로 줄임`
        : `Weekdays 10:00, 13:00, 16:00 (${DEFAULT_TZ}) — source interval was ${amount}m; not recreated as a 24/7 firehose`;
    }
  }
  if (/heartbeat|always|every\s*minute|cron\s*\*/i.test(value)) {
    return locale === "ko"
      ? `평일 10:00 (${DEFAULT_TZ}) — heartbeat/고빈도 체크를 평일 주간으로 재작성`
      : `Weekdays 10:00 (${DEFAULT_TZ}) — heartbeat/high-frequency check recreated as weekday daytime`;
  }
  return `${value} (${DEFAULT_TZ})`;
}

export function routinePaste(input: {
  name: string;
  schedule?: string;
  prompt: string;
  skill?: string;
  locale: ListingLocale;
}) {
  const schedule = describeSchedule(input.schedule, input.locale);
  const job = clip(input.prompt, 900);
  if (input.locale === "ko") {
    return `이 Bot에게 루틴을 만들어 주세요. 루틴은 when입니다. 출처에 있던 일정만 재작성하고, 없던 cron은 만들지 마세요. 봇당 루틴은 50개까지입니다.

Owning Bot: 지금 이 대화의 Bot
Schedule and time zone: ${schedule}
Input: ${input.skill ? `skill “${input.skill}”; ` : ""}${job || input.name}
Expected result: 이 대화에 짧은 결과. 외부로 보내지 말 것.
Approval boundary: 메일·메시지 발송, 결제, 삭제, 배포, 게시 전에 멈춘다.
Missing-data policy: 출처가 없으면 옛 데이터로 채우지 말고 실패를 보고한다.

Duplicate Bot does not copy learned memory. Paste this into that Bot's chat.`;
  }
  return `Create a routine for this Bot. A routine is when. Recreate the schedule the previous agent had; do not invent extra cron. Cap 50 routines per Bot.

Owning Bot: the Bot in this conversation
Schedule and time zone: ${schedule}
Input: ${input.skill ? `skill “${input.skill}”; ` : ""}${job || input.name}
Expected result: a short result in this conversation. Do not send it outward.
Approval boundary: stop before sending, paying, deleting, deploying, or publishing.
Missing-data policy: if the source is unavailable, report the failure instead of using old data.

Duplicate Bot does not copy learned memory. Paste this into that Bot's chat.`;
}

export function profilePrompt(input: {
  name: string;
  soul: string;
  agents: string;
  identity: string;
  plugins: string[];
  locale: ListingLocale;
}) {
  const context = [input.soul, input.identity, input.agents].filter(Boolean).join("\n\n");
  const excerpt = clip(context, 1600);
  const plugins = input.plugins.length > 0 ? input.plugins.join(", ") : input.locale === "ko" ? "(연결할 도구를 먼저 물어보세요.)" : "(Ask which tools this job needs, then help connect them.)";

  if (input.locale === "ko") {
    return `Grok Bot 설정

이름: ${input.name}
직함: 이전 에이전트에서 인수한 담당자

당신이 맡는 일
- 아래 인수 문구의 역할을 이 대화에서 이어 간다.
- 기억은 한 패킷씩 나중에 받는다. 지금 문구만 역할이다.
${excerpt ? `- 이전 페르소나:\n${excerpt}` : ""}

잘한 일의 기준
- 사실과 추측을 나눈다.
- 결정이 필요한 항목을 맨 위에 둔다.
- 초안은 짧고, 사람이 고칠 여백을 남긴다.

묻지 않고 하지 말 것
- 외부 발송, 게시, 결제, 삭제, 권한 변경
- API 키·토큰을 묻거나 저장하기
- 이전 에이전트의 기억을 사실로 단정하기 (출처 시스템을 다시 본다)

플러그인
${plugins}

첫 작업
역할이 맞는지 한 줄로 확인하고, 내가 붙여 넣을 다음 기억 패킷을 기다린다.`;
  }

  return `Grok Bot setup

Name: ${input.name}
Title: Role handed over from the previous agent

You own
- The job described in the handoff text below, in this conversation.
- Memory arrives one packet at a time later. This setup text is the role only.
${excerpt ? `- Previous persona:\n${excerpt}` : ""}

Good looks like
- Facts and guesses are labeled.
- Decisions a human must make sit at the top.
- Drafts stay short enough to edit.

Never do without asking
- Send, publish, pay, delete, or change access
- Ask for or store API keys or tokens
- Treat previous-agent memory as a live source of truth (re-read current systems)

Plugins
${plugins}

First task
Confirm the role in one line, then wait for the next memory packet I paste.`;
}

export function listingDraftFromProfile(input: {
  name: string;
  prompt: string;
  plugins: string[];
  locale: ListingLocale;
}): HandoffListingDraft {
  const summary =
    input.locale === "ko"
      ? `${input.name} — 이전 에이전트에서 인수한 역할.`
      : `${input.name} — a role handed over from a previous agent.`;
  return {
    name: input.name,
    slug: ensureListingSlug(input.name),
    kind: "bot",
    category: "productivity",
    locale: input.locale,
    summary,
    prompt: input.prompt,
    integrations: input.plugins,
    source_url: null,
    status: "draft",
    team_members: [],
  };
}

export function capRoutines(packets: HandoffPacket[]) {
  const routines = packets.filter((packet) => packet.kind === "routine");
  if (routines.length <= MAX_ROUTINES) return packets;
  const kept = new Set(routines.slice(0, MAX_ROUTINES).map((packet) => packet.id));
  return packets.filter((packet) => packet.kind !== "routine" || kept.has(packet.id));
}

export function sourceLabel(source: HandoffSource) {
  return source === "hermes" ? "Hermes" : "OpenClaw";
}
