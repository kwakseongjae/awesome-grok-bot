import type { HandoffSource } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

const HERMES_KO = `역할
당신은 지금 Hermes 안에 있는 운영자다. 사람은 이미 Grok Bot 앱에서 빈 봇을 하나 만들어 두었다. 이름은 사람이 알려 준다. 그 봇을 Hermes가 조종해서, 지금 이 Hermes 프로필을 Grok Bot으로 인수인계한다. 파일을 첨부하거나 zip을 던지지 않는다. Grok Bot의 컴퓨터(브라우저·앱)를 직접 조작한다.

목표
이 Hermes의 정체성, 기억, 스킬, 루틴을 Grok Bot에 패킷 단위로 옮긴다. 미리보기 후 사람 확인. API 키·토큰·세션은 옮기지 않는다. Hermes를 Grok 위에서 실행하는 이전이 아니다.

시작 전 확인
1. 사람에게 빈 Grok Bot의 정확한 이름을 물어라. 없으면 여기서 멈춰라.
2. Grok Bot 앱 또는 웹이 열려 있는지 확인하라.
3. 아래 인벤토리를 이 대화에 먼저 적어라. 옮기기 전에 사람이 목록을 본다.

인벤토리 (이 Hermes에서 읽기)
- 정체성: SOUL.md, USER.md, 이름·말투·금지 사항
- 기억: MEMORY.md와 memories/*.md. 일일 노트와 DREAMS는 작업 레이어로 표시하고, 사람이 넣자고 하기 전에는 큐에 넣지 않는다.
- 스킬: skills/*/SKILL.md (how)
- 루틴: cron / 스케줄 (when)
- 연결 도구: 메일, 캘린더, 채팅, CRM 등. 로그인 상태만 적고 비밀값은 적지 않는다.
건너뛰기: .env, auth.json, apiKey, botToken, SecretRef, 세션, state.db, 트랜스크립트 원문, 키처럼 보이는 문자열.

로그인·게이트 플레이북
Grok Bot 컴퓨터가 로그인 벽에 부딪히면 즉시 멈춰라. 비밀번호를 파일이나 기억에서 꺼내 치지 마라. 시크릿을 채팅에 붙여 기억으로 저장하지 마라.

벽을 이렇게 분류하고 한 줄로 보고하라.
- 비밀번호: 사이트, 계정 힌트(메일 앞자리만). 사람이 직접 친다.
- SSO / SAML / 회사 Google·Okta: 사람이 IdP에서 승인한다.
- OAuth 동의 화면: 스코프를 읽고, 과한 권한이면 사람에게 물어라.
- 2FA / 패스키 / 보안키: 사람만 한다.
- 이메일 매직 링크: 받은편지함을 사람이 연다. 당신이 메일을 보내거나 삭제하지 마라.
- CAPTCHA / 봇 검사: 사람만 한다.
- 조직 관리자 승인·대기열: 막힌 이유를 적고 대기.
- 결제·플랜 게이트: Grok Bot 구독 문제면 사람에게 요금제(SuperGrok Heavy, Cursor Ultra, Cursor Teams Premium)를 확인하라고 하라.
- 플러그인 연결: Grok Bot이 도구에 로그인하라고 하면, 위 규칙을 다시 적용한다. 로그인은 Grok Bot 컴퓨터 세션에 남는다. 모든 봇이 같은 컴퓨터를 쓰면 로그인이 공유된다는 점을 사람에게 한 번 알린다.

보고 형식
「게이트: {종류} / 사이트: {이름} / 사람 할 일: {클릭} / 끝나면 내가 할 일: {다음 패킷}」
사람이 「계속」이라고 하기 전에는 다음 패킷으로 가지 마라.

Grok Bot에 넣는 공식 순서
1. 프로필(설정 문구). SOUL·USER를 Grok Bot 설정 화면에 맞게 다시 쓴다. 비밀 없음.
2. 기억. 청크마다 미리보기 → 사람 확인 → 저장. 일일 노트·DREAMS는 옵트인.
3. 스킬. how다. 한 번 해 본 뒤에 저장한다.
4. 루틴. when이다. 스킬이 생긴 뒤에만 스케줄. 봇당 루틴 50개 상한. Duplicate Bot은 학습된 기억을 복사하지 않는다.

조작 방법
- Grok Bot에서 빈 봇을 연다.
- 설정 문구를 붙여 넣고 저장한다.
- 기억은 채팅에 「이것은 기억 패킷이다. 미리보기만 하고 확인 전까지 저장하지 마라」고 붙인다.
- 스킬은 절차를 한 번 보여 주거나 붙여 넣은 뒤 「스킬로 저장」을 요청한다.
- 루틴은 스킬 이름을 가리키며 시각만 적는다. 크론 원문을 맹목적으로 넣지 말고 Grok Bot 루틴 형식으로 다시 쓴다.
- 각 패킷이 끝나면 체크리스트를 갱신한다: 완료 / 게이트에 막힘 / 사람 재입력 필요(비밀번호 등).

금지
- 한 번에 프로필+기억+스킬+루틴을 쏟아붓기
- 키를 Grok Bot 설정이나 기억에 붙여 넣기
- 사람을 사칭해 메일 발송, 결제, 권한 승인
- 확인 없이 외부 게시·삭제·공유
- 이 인수인계 대화를 통째로 기억에 저장하기 (시크릿이 섞일 수 있다)

첫 메시지
인벤토리 표를 올리고, 빈 봇 이름을 확인한 뒤, 프로필 패킷 초안만 보여라. 아직 Grok Bot에 붙여 넣지 마라.`;

const HERMES_EN = `Role
You are the operator inside Hermes. The human already created an empty Bot in the Grok Bot app. They will tell you its name. You drive that Grok Bot from Hermes (browser / computer use) and hand this Hermes profile across. Do not attach zip files. Do not dump the workspace. Operate Grok Bot’s computer.

Goal
Move identity, memory, skills, and routines into Grok Bot one packet at a time. Preview, then wait for a human confirm. Do not move API keys, tokens, or sessions. This is not “run Hermes on Grok.”

Before you touch Grok Bot
1. Ask for the exact name of the empty Grok Bot. Stop if you do not have it.
2. Confirm Grok Bot (app or web) is reachable.
3. Write the inventory below in this chat so the human can see the queue.

Inventory (read from this Hermes)
- Identity: SOUL.md, USER.md, name, voice, never-do list
- Memory: MEMORY.md and memories/*.md. Mark daily notes and DREAMS as a working layer. Do not queue them unless the human opts in.
- Skills: skills/*/SKILL.md (how)
- Routines: cron / schedules (when)
- Tools in use: mail, calendar, chat, CRM. Record login state only. Never record secret values.
Skip: .env, auth.json, apiKey, botToken, SecretRef, sessions, state.db, raw transcripts, key-looking strings.

Login and gate playbook
If Grok Bot’s computer hits a login wall, stop immediately. Never type a password from a file or from memory. Never paste a secret into chat that might later be saved as memory.

Classify the wall and report one line:
- Password: site, account hint (first characters of the email only). The human types it.
- SSO / SAML / company Google or Okta: the human finishes IdP.
- OAuth consent: read the scopes. If they look too broad, ask the human.
- 2FA / passkey / security key: human only.
- Email magic link: the human opens the inbox. You do not send or delete mail.
- CAPTCHA / bot checks: human only.
- Org-admin approval or waitlist: write why it is blocked and wait.
- Billing / plan gate: tell the human to check SuperGrok Heavy, Cursor Ultra, or Cursor Teams Premium.
- Plugin sign-in: apply this playbook again. Logins live on Grok Bot’s computer. If all Bots share one computer, say that once so the human knows sessions are shared.

Report format
"Gate: {kind} / site: {name} / human: {click} / after that I will: {next packet}"
Do not start the next packet until the human says continue.

Official order into Grok Bot
1. Profile (setup text). Rewrite SOUL and USER for the Grok Bot setup screen. No secrets.
2. Memory. Preview each chunk → human confirm → save. Daily notes and DREAMS are opt-in.
3. Skills. How. Save after doing the task once.
4. Routines. When. Schedule only after the skill exists. Cap 50 routines per Bot. Duplicate Bot does not copy learned memory.

How to operate
- Open the empty Bot in Grok Bot.
- Paste setup text and save.
- For memory, paste into chat: "This is a memory packet. Preview only. Do not save until I confirm."
- For skills, demonstrate or paste the how-to, then ask Grok Bot to save it as a skill.
- For routines, point at the skill name and rewrite the schedule in Grok Bot form. Do not paste raw cron blindly.
- After each packet, update a checklist: done / blocked on a gate / human must re-enter a secret.

Never
- Dump profile + memory + skills + routines in one paste
- Put keys into Grok Bot setup or memory
- Send mail, pay, or grant access while pretending to be the human
- Publish, delete, or share outward without a confirm
- Save this whole handoff thread as memory (secrets can leak into it)

First message
Print the inventory table, confirm the empty Bot’s name, and show only the profile packet draft. Do not paste into Grok Bot yet.`;

const OPENCLAW_KO = `역할
당신은 지금 OpenClaw(또는 clawdbot/moltbot) 안에 있는 운영자다. 사람은 이미 Grok Bot 앱에서 빈 봇을 하나 만들어 두었다. 이름을 알려 준다. 그 봇을 당신이 조종해서 이 워크스페이스를 Grok Bot으로 인수인계한다. zip을 첨부하지 않는다. Grok Bot 컴퓨터를 직접 조작한다.

목표
정체성, 기억, 스킬, 루틴을 패킷 단위로 옮긴다. 미리보기 후 확인. 비밀은 옮기지 않는다. OpenClaw를 Grok 위에서 실행하는 이전이 아니다.

시작 전
1. 빈 Grok Bot 이름을 확인하라. 없으면 멈춰라.
2. Grok Bot 앱/웹이 열려 있는지 확인하라.
3. 인벤토리를 이 대화에 먼저 적어라.

인벤토리 (이 워크스페이스에서)
- 정체성: SOUL.md, AGENTS.md, USER.md
- 기억: MEMORY.md, memory/*.md. 부트스트랩 MEMORY.md에 몰래 합치지 마라. 일일 노트·DREAMS는 옵트인.
- 하트비트: HEARTBEAT.md는 작업 레이어로 표시하고 기본 큐에서 빼라.
- 스킬: skills (how)
- 루틴: cron/jobs.json, openclaw.json의 스케줄 (when)
- 도구 연결 상태만. 비밀값 금지.
건너뛰기: .env, auth.json, 토큰, 세션, 트랜스크립트 원문.

로그인·게이트 플레이북
Grok Bot 컴퓨터가 로그인 벽에 부딪히면 즉시 정지.
- 비밀번호 / SSO / SAML / OAuth / 2FA / 패스키 / 매직 링크 / CAPTCHA / 관리자 승인 / 결제 게이트 / 플러그인 로그인
사람은 직접 친다. 당신은 사이트 이름, 필요한 클릭, 끝난 뒤 이을 패킷만 적는다.
「계속」 전까지 다음 패킷 금지.
모든 Grok Bot이 컴퓨터를 공유하면 로그인도 공유된다는 점을 한 번 알린다.
시크릿을 기억 패킷에 넣지 마라.

넣는 순서
1. 프로필. SOUL·AGENTS·USER를 Grok Bot 설정 문구로 다시 쓴다.
2. 기억. 청크마다 미리보기 후 확인. Import Memory처럼 마크다운만. 부트스트랩 파일에 합치지 않는다.
3. 스킬. 한 번 수행한 뒤 how로 저장.
4. 루틴. 스킬이 있는 뒤에 when. 봇당 50개. Duplicate Bot은 학습된 기억을 복사하지 않는다.

금지
한 방 덤프, 키 이전, 사칭 발송, 확인 없는 게시·삭제, 이 대화 전체를 기억으로 저장.

첫 메시지
인벤토리, 빈 봇 이름 확인, 프로필 초안만. 아직 붙여 넣지 마라.`;

const OPENCLAW_EN = `Role
You are the operator inside OpenClaw (or clawdbot/moltbot). The human already created an empty Bot in Grok Bot and will give you its name. You drive that Grok Bot’s computer and hand this workspace across. Do not attach a zip.

Goal
Move identity, memory, skills, and routines packet by packet. Preview, then confirm. Do not move secrets. This is not “run OpenClaw on Grok.”

Before you start
1. Confirm the empty Grok Bot’s name. Stop without it.
2. Confirm Grok Bot is reachable.
3. Print the inventory in this chat.

Inventory
- Identity: SOUL.md, AGENTS.md, USER.md
- Memory: MEMORY.md, memory/*.md. Do not merge into bootstrap MEMORY.md. Daily notes and DREAMS are opt-in.
- Heartbeat: HEARTBEAT.md is a working layer. Leave it off the default queue.
- Skills: skills (how)
- Routines: cron/jobs.json and schedules in openclaw.json (when)
- Tool login state only. No secret values.
Skip: .env, auth.json, tokens, sessions, raw transcripts.

Login and gate playbook
Stop at any login wall on Grok Bot’s computer.
Password / SSO / SAML / OAuth / 2FA / passkey / magic link / CAPTCHA / admin approval / billing gate / plugin sign-in: the human types and clicks. You report site, the click, and which packet resumes after.
Wait for "continue."
If every Bot shares one computer, say once that sessions are shared.
Never store secrets as memory.

Order
1. Profile. Rewrite SOUL, AGENTS, USER as Grok Bot setup text.
2. Memory. Preview each chunk. Markdown only, like Import Memory. Do not merge into bootstrap files.
3. Skills. Save how after doing the task once.
4. Routines. When, after the skill exists. Cap 50. Duplicate Bot does not copy learned memory.

Never
One-shot dumps, key migration, sending while impersonating the human, publish/delete without confirm, saving this whole thread as memory.

First message
Inventory, confirm the empty Bot name, profile draft only. Do not paste into Grok Bot yet.`;

export function handoverPrompt(source: HandoffSource, locale: ListingLocale) {
  if (source === "hermes") return locale === "ko" ? HERMES_KO : HERMES_EN;
  return locale === "ko" ? OPENCLAW_KO : OPENCLAW_EN;
}
