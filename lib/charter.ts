import type { BotListing, TeamMember } from "@/lib/types";

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function formatTeamCopy(bot: BotListing) {
  if (bot.kind !== "team" || bot.team_members.length === 0) {
    return bot.prompt;
  }

  const members = bot.team_members
    .map((member) => formatMemberBlock(member, bot.locale))
    .join("\n\n");

  const divider = bot.locale === "ko" ? "팀원 헌장" : "Member charters";
  return `${bot.prompt}\n\n---\n\n# ${divider}\n\n${members}`;
}

export function formatMemberBlock(member: TeamMember, locale: "ko" | "en") {
  const roleLabel = locale === "ko" ? "역할" : "Role";
  return `## ${member.name}\n${roleLabel}: ${member.role}\n\n${member.charter}`;
}

type PageExtract = {
  url: string;
  title: string;
  text: string;
  locale: "ko" | "en";
  splitTeam: boolean;
};

function clip(text: string, max = 900) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max).trim()}…`;
}

export function buildCharterFromPage(input: PageExtract) {
  const title = input.title.trim() || (input.locale === "ko" ? "이름 없는 봇" : "Untitled bot");
  const excerpt = clip(input.text || title, 700);
  const name = title.replace(/\s+/g, " ").slice(0, 80);

  if (input.locale === "ko") {
    const prompt = `Grok Bot 설정

이름: ${name}
직함: 이 주제의 담당자

당신이 맡는 일
- "${title}"에서 읽은 맥락을 기준으로, 관련 작업을 한 줄로 정리하고 다음 행동을 제안한다.
- 출처: ${input.url}
- 페이지에서 건진 요지: ${excerpt}

잘한 일의 기준
- 사실과 추측을 나눈다.
- 한 번의 응답에 결정이 필요한 항목을 맨 위에 둔다.
- 초안은 짧고, 사람이 고칠 여백을 남긴다.

묻지 않고 하지 말 것
- 외부 발송, 게시, 결제, 삭제, 권한 변경
- 원문을 통째로 재게시
- 개인정보나 비밀을 저장·재사용

연결
(이 일을 하려면 어떤 도구가 필요한지 먼저 물어보고 연결을 도와 줘.)

첫 작업
위 요지를 바탕으로 오늘 할 일 세 가지와, 내가 승인해야 하는 한 가지를 제안해 줘.`;

    const members = input.splitTeam
      ? [
          {
            name: `${name} 치프`,
            role: "총괄 · 라우팅",
            charter:
              "요청을 받아 범위와 마감을 정하고, 초안이 나가기 전에 승인 줄을 지킨다. 전문 봇에게는 요약만 넘긴다.",
          },
          {
            name: `${name} 리서치`,
            role: "조사",
            charter:
              "출처를 확인하고 빠진 사실을 찾는다. 추측이면 그렇게 표시한다. 외부에 묻지 않고 연락하지 않는다.",
          },
          {
            name: `${name} 초안`,
            role: "작성",
            charter:
              "치프가 넘긴 요약으로 초안만 만든다. 보내기·게시는 하지 않고 승인 대기 목록에 올린다.",
          },
        ]
      : [];

    return {
      name,
      slug: slugify(name) || "from-link",
      summary: `${title} 페이지를 기준으로 한 작업 봇.`,
      prompt,
      integrations: [] as string[],
      team_members: members,
      kind: input.splitTeam ? ("team" as const) : ("bot" as const),
    };
  }

  const prompt = `Grok Bot setup

Name: ${name}
Title: Owner of this topic

You own
- Work that follows from "${title}". Turn it into a short brief and a next action.
- Source: ${input.url}
- Page excerpt: ${excerpt}

Good looks like
- Facts and guesses are labeled.
- Decisions a human must make sit at the top.
- Drafts stay short enough to edit.

Never do without asking
- Send, publish, pay, delete, or change access
- Republish the source page in full
- Store or reuse private data

Integrations
Ask which tools this job needs, then help connect them.

First task
From the excerpt, propose three tasks for today and one item that needs my approval.`;

  const members = input.splitTeam
    ? [
        {
          name: `${name} Chief`,
          role: "Lead · routing",
          charter:
            "Intake the request, set scope and due date, and keep the approval line. Hand specialists a summary, not the raw dump.",
        },
        {
          name: `${name} Research`,
          role: "Research",
          charter:
            "Check sources and missing facts. Mark guesses as guesses. Do not contact anyone without asking.",
        },
        {
          name: `${name} Draft`,
          role: "Writing",
          charter:
            "Write drafts from the Chief's summary. Do not send or publish. Leave them on the approval list.",
        },
      ]
    : [];

  return {
    name,
    slug: slugify(name) || "from-link",
    summary: `A working bot drafted from ${title}.`,
    prompt,
    integrations: [] as string[],
    team_members: members,
    kind: input.splitTeam ? ("team" as const) : ("bot" as const),
  };
}
