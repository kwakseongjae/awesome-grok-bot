import type { ListingLocale } from "@/lib/types";
import { GROK_BOT, SITE_ORIGIN } from "@/lib/site";

export const BIBLE_VERSION = "0.1.0";
export const BIBLE_UPDATED_AT = "2026-08-28T12:00:00+09:00";
export const BIBLE_PATH = "101";

const copy = (
  en: string,
  extra: Partial<Record<ListingLocale, string>> = {},
): Record<ListingLocale, string> => ({
  ko: extra.ko ?? en,
  en,
  ja: extra.ja ?? en,
  "zh-CN": extra["zh-CN"] ?? en,
  "zh-TW": extra["zh-TW"] ?? en,
});

export type BibleBlock =
  | { type: "p"; text: Record<ListingLocale, string> }
  | { type: "h3"; text: Record<ListingLocale, string> }
  | { type: "ul"; items: Record<ListingLocale, string>[] }
  | { type: "ol"; items: Record<ListingLocale, string>[] }
  | { type: "quote"; text: Record<ListingLocale, string> };

export type BibleChapter = {
  id: string;
  title: Record<ListingLocale, string>;
  blocks: BibleBlock[];
};

export const BIBLE_TITLE = copy("Grok Bot 101", {
  ko: "Grok Bot 101",
  ja: "Grok Bot 101",
  "zh-CN": "Grok Bot 101",
  "zh-TW": "Grok Bot 101",
});

export const BIBLE_LEAD = copy(
  "A field bible for the Grok stack: Grok Bot, Grok Build, and Cursor. How to install a template, how to carry Hermes or OpenClaw across, and how to post it on X and Threads without leaking keys. This page is the source of truth. Print or save as PDF when you need a snapshot.",
  {
    ko: "Grok 스택 현장 바이블입니다. Grok Bot, Grok Build, Cursor. 템플릿 설치, Hermes·OpenClaw 이전, 키를 흘리지 않고 X와 Threads에 올리는 법. 이 페이지가 원본입니다. 스냅샷이 필요하면 인쇄하거나 PDF로 저장하세요.",
    ja: "Grok スタックの現場バイブル。Grok Bot、Grok Build、Cursor。テンプレートの入れ方、Hermes / OpenClaw の移行、鍵を漏らさず X と Threads に出す方法。このページが原本です。スナップショットが必要なら印刷するか PDF に保存してください。",
    "zh-CN": "Grok 栈现场手册：Grok Bot、Grok Build、Cursor。如何安装模板、如何从 Hermes 或 OpenClaw 迁过来，以及如何在 X 和 Threads 上发布且不泄露密钥。本页是原文。需要快照时打印或存成 PDF。",
    "zh-TW": "Grok 棧現場手冊：Grok Bot、Grok Build、Cursor。如何安裝模板、如何從 Hermes 或 OpenClaw 遷過來，以及如何在 X 與 Threads 上發布且不洩漏金鑰。本頁是原文。需要快照時列印或存成 PDF。",
  },
);

export const BIBLE_CHAPTERS: BibleChapter[] = [
  {
    id: "what",
    title: copy("What this is", { ko: "이게 뭔가", ja: "これは何か", "zh-CN": "这是什么", "zh-TW": "這是什麼" }),
    blocks: [
      {
        type: "p",
        text: copy(
          "Grok Bot is a persistent teammate with a name, a job, a conversation, and a cloud computer. It is closer to hiring someone than opening a chat box. Awesome Grok Bot (getgrokbot.com) is a sponsor-free directory of specialists, teams, and installable templates. It is not an xAI product.",
          {
            ko: "Grok Bot은 이름, 일, 대화, 클라우드 컴퓨터를 가진 상주 동료입니다. 채팅창을 여는 쪽보다 사람을 고용하는 쪽에 가깝습니다. Awesome Grok Bot(getgrokbot.com)은 스폰서 없는 전문가·팀·설치형 템플릿 디렉터리입니다. xAI 제품이 아닙니다.",
          },
        ),
      },
      {
        type: "ul",
        items: [
          copy("Official product: x.ai/bot", { ko: "공식 제품: x.ai/bot" }),
          copy("Docs: docs.x.ai/grok-bot", { ko: "문서: docs.x.ai/grok-bot" }),
          copy(`This directory: ${SITE_ORIGIN}`, { ko: `이 디렉터리: ${SITE_ORIGIN}` }),
        ],
      },
    ],
  },
  {
    id: "stack",
    title: copy("The Grok stack", {
      ko: "Grok 스택",
      ja: "Grok スタック",
      "zh-CN": "Grok 栈",
      "zh-TW": "Grok 棧",
    }),
    blocks: [
      {
        type: "p",
        text: copy(
          "Three surfaces share the same frontier model family. They are not the same product. Pick the surface that owns the job.",
          {
            ko: "세 화면이 같은 프론티어 모델 계열을 씁니다. 같은 제품은 아닙니다. 일을 소유하는 화면을 고르세요.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("Grok Bot", { ko: "Grok Bot" }),
      },
      {
        type: "p",
        text: copy(
          "Always-on teammate. Own computer, plugins, skills (how), routines (when), group chats. This is the surface everyday operators actually live in. Templates and Portato target this surface.",
          {
            ko: "항상 켜진 동료. 전용 컴퓨터, 플러그인, 스킬(how), 루틴(when), 그룹 채팅. 일상 운영자가 실제로 사는 화면입니다. 템플릿과 Portato는 여기를 겨냥합니다.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("Grok Build", { ko: "Grok Build" }),
      },
      {
        type: "p",
        text: copy(
          "xAI’s build surface for shipping software with Grok. Use it when the job is a repo, a diff, or a product slice — not a standing inbox. Grok Bot can still install coding agents on its computer and hand work to them.",
          {
            ko: "Grok으로 소프트웨어를 내는 xAI 빌드 화면입니다. 일이 레포, 디프, 제품 조각일 때 씁니다. 상주 인박스가 아닙니다. Grok Bot은 자기 컴퓨터에 코딩 에이전트를 깔고 일을 넘길 수 있습니다.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("Cursor", { ko: "Cursor" }),
      },
      {
        type: "p",
        text: copy(
          "The editor. Several Cursor plans include Grok Bot. Desktop onboarding lives at cursor.com/bot/onboarding. Do not confuse Cursor Agent (local CLI / cloud agents in the IDE) with a Grok Bot teammate. A Grok Bot can drive Cursor Agent on its computer; that is optional, not the default.",
          {
            ko: "에디터입니다. Cursor 요금제 여러 개에 Grok Bot이 포함됩니다. 데스크톱 온보딩은 cursor.com/bot/onboarding. Cursor Agent(IDE의 로컬 CLI·클라우드 에이전트)와 Grok Bot 동료를 섞지 마세요. Grok Bot이 컴퓨터에서 Cursor Agent를 조종할 수는 있습니다. 기본값은 아닙니다.",
          },
        ),
      },
      {
        type: "ul",
        items: [
          copy(`Grok Bot product: ${GROK_BOT.product}`, { ko: `Grok Bot 제품: ${GROK_BOT.product}` }),
          copy(`Plans: ${GROK_BOT.plansHelp}`, { ko: `요금제: ${GROK_BOT.plansHelp}` }),
          copy(`Cursor pricing: ${GROK_BOT.pricingCursor}`, { ko: `Cursor 요금: ${GROK_BOT.pricingCursor}` }),
        ],
      },
    ],
  },
  {
    id: "first",
    title: copy("First hour", { ko: "첫 한 시간", ja: "最初の1時間", "zh-CN": "第一个小时", "zh-TW": "第一個小時" }),
    blocks: [
      {
        type: "ol",
        items: [
          copy(
            "Check access. SuperGrok and several Cursor plans include Grok Bot. If the app will not open, start with the plan.",
            {
              ko: "권한을 확인합니다. SuperGrok와 Cursor 요금제 여러 개에 Grok Bot이 있습니다. 앱이 안 열리면 요금제부터.",
            },
          ),
          copy(
            "Install desktop (macOS or Windows) or iOS. The same thread continues on both. Work runs on a cloud computer, so closing the laptop does not stop the Bot.",
            {
              ko: "데스크톱(macOS 또는 Windows) 또는 iOS를 깝니다. 같은 스레드를 양쪽에서 잇습니다. 일은 클라우드 컴퓨터에서 돌아가서, 노트북을 닫아도 봇은 멈추지 않습니다.",
            },
          ),
          copy(
            "Create one empty Bot. Name it. Do not spawn a team on day one.",
            { ko: "빈 봇 하나를 만듭니다. 이름을 붙입니다. 첫날 팀을 만들지 마세요." },
          ),
          copy(
            "Paste setup text from a listing, or Add a public template from x.ai. Start with drafts only.",
            {
              ko: "목록의 설정 문구를 붙이거나, x.ai 공개 템플릿을 Add 합니다. 초안만으로 시작하세요.",
            },
          ),
          copy(
            "When a plugin hits a login wall, you type. Passwords, SSO, 2FA, passkeys, magic links, CAPTCHAs stay human.",
            {
              ko: "플러그인이 로그인 벽에 닿으면 사람이 칩니다. 비밀번호, SSO, 2FA, 패스키, 매직 링크, CAPTCHA는 사람만.",
            },
          ),
        ],
      },
      {
        type: "p",
        text: copy(
          "Short tutorial: getgrokbot.com/how-to. Install prompts for Claude Code, Codex, OpenClaw, and Hermes inside Grok Bot: getgrokbot.com/install.",
          {
            ko: "짧은 튜토리얼: getgrokbot.com/how-to. Grok Bot 안에 Claude Code, Codex, OpenClaw, Hermes를 까는 프롬프트: getgrokbot.com/install.",
          },
        ),
      },
    ],
  },
  {
    id: "anatomy",
    title: copy("Anatomy of a Bot", {
      ko: "봇의 구조",
      ja: "Bot の構造",
      "zh-CN": "Bot 的结构",
      "zh-TW": "Bot 的結構",
    }),
    blocks: [
      {
        type: "ul",
        items: [
          copy(
            "Profile (setup text): name, title, what it owns, what good looks like, what it must never do without asking, first task.",
            {
              ko: "프로필(설정 문구): 이름, 직함, 맡는 일, 잘한 기준, 묻지 않고 하지 말 것, 첫 작업.",
            },
          ),
          copy(
            "Skill = how. Do the task once, then save. Do not schedule a skill you have not run.",
            { ko: "스킬 = how. 한 번 한 뒤에 저장합니다. 안 돌려 본 스킬을 스케줄하지 마세요." },
          ),
          copy(
            "Routine = when. Cap 50 per Bot. Duplicate Bot copies profile, skills, routines, avatar — not learned memory or chat history.",
            {
              ko: "루틴 = when. 봇당 50개. Duplicate Bot은 프로필·스킬·루틴·아바타를 복사합니다. 학습된 기억과 대화는 복사하지 않습니다.",
            },
          ),
          copy(
            "Memory is not the source of truth. Changing facts stay in the source system. Cite or reopen current data for consequential decisions.",
            {
              ko: "기억은 원본이 아닙니다. 변하는 사실은 소스 시스템에 둡니다. 중요한 결정은 현재 데이터를 인용하거나 다시 엽니다.",
            },
          ),
          copy(
            "Every Bot on an account shares one computer and its logins. A reckless routine inherits every session you already opened.",
            {
              ko: "계정 안 모든 봇이 컴퓨터와 로그인을 공유합니다. 덜컥 켠 루틴은 이미 연 세션을 그대로 물려받습니다.",
            },
          ),
        ],
      },
      {
        type: "quote",
        text: copy(
          "Description is the standing rule. The chat is the task. “Never send without approval” belongs in the description.",
          {
            ko: "설명은 상주 규칙입니다. 채팅은 이번 일입니다. 「승인 없이 보내지 마」는 설명에 넣습니다.",
          },
        ),
      },
    ],
  },
  {
    id: "templates",
    title: copy("Templates: share and add", {
      ko: "템플릿: 공유와 설치",
      ja: "テンプレート：共有と追加",
      "zh-CN": "模板：分享与添加",
      "zh-TW": "模板：分享與新增",
    }),
    blocks: [
      {
        type: "p",
        text: copy(
          "Grok Bot can share a public link. Anyone with the link opens a preview on x.ai and chooses Add to Grok Bot. Adding creates a copy on their account. It does not give them your computer, logins, or conversation history.",
          {
            ko: "Grok Bot은 공개 링크를 나눌 수 있습니다. 링크가 있는 사람은 x.ai에서 미리 보고 Add to Grok Bot을 고릅니다. 추가하면 그 계정에 사본이 생깁니다. 컴퓨터, 로그인, 대화 기록은 넘어가지 않습니다.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("What travels", { ko: "넘어가는 것" }),
      },
      {
        type: "ul",
        items: [
          copy("Identity, description, skills, and routines (per official docs).", {
            ko: "정체성, 설명, 스킬, 루틴(공식 문서 기준).",
          }),
          copy("The link is public. It exposes the Bot’s configuration. Strip API keys, internal URLs, customer data, and anything confidential before you share.", {
            ko: "링크는 공개입니다. 봇 설정이 드러납니다. 공유 전에 API 키, 내부 URL, 고객 데이터, 비밀을 빼세요.",
          }),
        ],
      },
      {
        type: "h3",
        text: copy("What does not travel", { ko: "안 넘어가는 것" }),
      },
      {
        type: "ul",
        items: [
          copy("Your computer, browser logins, and conversation history.", {
            ko: "컴퓨터, 브라우저 로그인, 대화 기록.",
          }),
          copy("Custom MCP servers, local scripts, and code. Write setup instructions instead of embedding secrets.", {
            ko: "커스텀 MCP, 로컬 스크립트, 코드. 비밀을 넣지 말고 설치 안내를 적으세요.",
          }),
        ],
      },
      {
        type: "h3",
        text: copy("Two install paths on this site", { ko: "이 사이트의 설치 두 길" }),
      },
      {
        type: "ol",
        items: [
          copy(
            "Add to Grok — when a listing has a public x.ai/bot/… link. Opens the official preview. You need the Grok Bot app to finish.",
            {
              ko: "Add to Grok — 목록에 공개 x.ai/bot/… 링크가 있을 때. 공식 미리보기가 열립니다. 마무리는 Grok Bot 앱이 필요합니다.",
            },
          ),
          copy(
            "Copy — paste setup text into Bot actions → Edit Profile. This is how original getgrokbot listings install until the author publishes a share link from inside Grok Bot. getgrokbot cannot mint x.ai/bot URLs.",
            {
              ko: "Copy — 설정 문구를 Bot actions → Edit Profile에 붙입니다. 작성자가 Grok Bot 안에서 공유 링크를 내기 전, getgrokbot 원본 목록의 설치 방법입니다. getgrokbot은 x.ai/bot 주소를 발급하지 않습니다.",
            },
          ),
        ],
      },
      {
        type: "p",
        text: copy(
          "Third-party Bots are not verified by SpaceXAI. Read the preview, connect the smallest useful accounts, run one reversible task while watching, then enable routines. Recipients may not redistribute a shared Bot without the creator’s permission.",
          {
            ko: "제3자 봇은 SpaceXAI가 검증하지 않습니다. 미리보기를 읽고, 필요한 최소 계정만 연결하고, 보면서 되돌릴 수 있는 작업 한 번 한 뒤에 루틴을 켜세요. 받은 사람은 작성자 허락 없이 다시 나눠서는 안 됩니다.",
          },
        ),
      },
      {
        type: "ul",
        items: [
          copy(`Share a Bot: ${GROK_BOT.bots}`, { ko: `봇 공유: ${GROK_BOT.bots}` }),
          copy(`Third-party terms: ${GROK_BOT.shareTerms}`, { ko: `제3자 약관: ${GROK_BOT.shareTerms}` }),
          copy(`Templates on this site: ${SITE_ORIGIN}/templates`, {
            ko: `이 사이트 템플릿: ${SITE_ORIGIN}/templates`,
          }),
        ],
      },
    ],
  },
  {
    id: "porter",
    title: copy("Portato — carry Hermes or OpenClaw in", {
      ko: "Portato — Hermes·OpenClaw를 옮겨",
      ja: "Portato — Hermes / OpenClaw を運ぶ",
      "zh-CN": "Portato — 把 Hermes 或 OpenClaw 搬过来",
      "zh-TW": "Portato — 把 Hermes 或 OpenClaw 搬過來",
    }),
    blocks: [
      {
        type: "p",
        text: copy(
          "Portato is the migrate Bot. Carry, don’t rebuild. One Chief. Grok Bot has no official Hermes or OpenClaw importer and no public create API. Packets are the path. The name nods to the potato-era Grok Bot community; it is not @poteto and not an xAI bot.",
          {
            ko: "Portato는 이전 봇입니다. 다시 만들지 말고 옮기세요. Chief 하나. Grok Bot에는 공식 Hermes·OpenClaw 가져오기와 공개 생성 API가 없습니다. 패킷이 길입니다. 이름은 Grok Bot 커뮤니티의 감자 드립에서 왔지만, @poteto가 아니고 xAI 봇도 아닙니다.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("Two templates", { ko: "템플릿 둘" }),
      },
      {
        type: "ul",
        items: [
          copy(`Portato · Hermes — ${SITE_ORIGIN}/en/bots/porter-hermes`, {
            ko: `Portato · Hermes — ${SITE_ORIGIN}/ko/bots/porter-hermes`,
          }),
          copy(`Portato · OpenClaw — ${SITE_ORIGIN}/en/bots/porter-openclaw`, {
            ko: `Portato · OpenClaw — ${SITE_ORIGIN}/ko/bots/porter-openclaw`,
          }),
        ],
      },
      {
        type: "h3",
        text: copy("Share links come from Grok Bot", { ko: "공유 링크는 Grok Bot이 발급한다" }),
      },
      {
        type: "p",
        text: copy(
          "getgrokbot cannot mint https://x.ai/bot/… URLs. Create Portato in the Grok Bot app, choose Share as template, copy the public link, then we store it as the listing’s share URL. Until that URL exists, install is Copy into Edit Profile. The Live on x.ai strip already uses other authors’ issued links — we do not copy their setup text.",
          {
            ko: "getgrokbot은 https://x.ai/bot/… 주소를 발급하지 않습니다. Grok Bot 앱에서 Portato를 만들고 Share as template로 공개 링크를 받은 뒤, 그 URL을 목록의 share URL에 넣습니다. 그 주소가 있기 전에는 Copy로 Edit Profile에 붙입니다. x.ai에서 바로 칸은 다른 작성자가 낸 링크만 연결합니다. 설정 문구는 복사하지 않습니다.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("Order of operations", { ko: "순서" }),
      },
      {
        type: "ol",
        items: [
          copy("Install Portato on Grok Bot (Copy the listing, or Add when a share link exists).", {
            ko: "Grok Bot에 Portato를 깝니다(목록 Copy, 공유 링크가 있으면 Add).",
          }),
          copy("Paste the one-liner from getgrokbot.com/migrate/hermes or /migrate/openclaw into the agent you already use.", {
            ko: "이미 쓰는 에이전트에 getgrokbot.com/migrate/hermes 또는 /migrate/openclaw의 한 줄을 붙입니다.",
          }),
          copy("That agent loads the skill, prints an inventory, and asks for 3–5 gold tasks (name, input, expected output).", {
            ko: "그 에이전트가 스킬을 읽고 인벤토리를 올린 뒤, 골드 태스크 3–5개(이름, 입력, 기대 출력)를 묻습니다.",
          }),
          copy("Packets in order: profile → facts file → skills (how) → routines (when).", {
            ko: "패킷 순서: 프로필 → 사실 파일 → 스킬(how) → 루틴(when).",
          }),
          copy("You only handle login walls and leftover sign-off. Keys, .env, sessions stay behind.", {
            ko: "사람이 할 일은 로그인 벽과 leftover 서명뿐입니다. 키, .env, 세션은 남깁니다.",
          }),
          copy("Cut over only when gold tasks pass on Grok and source schedules are off.", {
            ko: "골드 태스크가 Grok에서 통과하고 소스 스케줄이 꺼진 뒤에만 컷오버합니다.",
          }),
        ],
      },
      {
        type: "p",
        text: copy(
          "First Grok Bot is one Chief. Do not spawn a Nexus or a specialist farm during the handoff. Daily notes, DREAMS, and HEARTBEAT stay off the default queue.",
          {
            ko: "첫 Grok Bot은 Chief 하나입니다. 인수인계 중에 Nexus나 전문가 농장을 만들지 마세요. 일일 노트, DREAMS, HEARTBEAT는 기본 큐에서 뺍니다.",
          },
        ),
      },
    ],
  },
  {
    id: "viral",
    title: copy("X and Threads", {
      ko: "X와 Threads",
      ja: "X と Threads",
      "zh-CN": "X 与 Threads",
      "zh-TW": "X 與 Threads",
    }),
    blocks: [
      {
        type: "p",
        text: copy(
          "The Grok ecosystem is growing on X first, Threads second. Post the install, not the secret. A public share link plus a getgrokbot listing is the unit of distribution.",
          {
            ko: "Grok 생태계는 X가 먼저, Threads가 다음입니다. 비밀이 아니라 설치를 올리세요. 공개 공유 링크와 getgrokbot 목록이 배포 단위입니다.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("What to post", { ko: "무엇을 올리는가" }),
      },
      {
        type: "ol",
        items: [
          copy("One job in one line. “Carries Hermes into one Grok Bot Chief. Keys stay behind.”", {
            ko: "일 하나를 한 줄로. 「Hermes를 Grok Bot Chief 하나로 옮깁니다. 키는 남깁니다.」",
          }),
          copy("The install: x.ai/bot/… if you published a template, otherwise the getgrokbot listing.", {
            ko: "설치: 템플릿을 냈으면 x.ai/bot/…, 아니면 getgrokbot 목록.",
          }),
          copy("The rule: gold tasks, no keys, drafts before send.", {
            ko: "규칙: 골드 태스크, 키 없음, 보내기 전 초안.",
          }),
          copy("A screenshot of the preview page or the huddle face — not of .env, not of a customer inbox.", {
            ko: "미리보기 화면이나 허들 얼굴 스크린샷. .env나 고객 받은편지함은 안 됩니다.",
          }),
        ],
      },
      {
        type: "h3",
        text: copy("Thread shape (X)", { ko: "스레드 모양 (X)" }),
      },
      {
        type: "ol",
        items: [
          copy("1/ The pain: rebuilding an agent org from scratch.", { ko: "1/ 고통: 에이전트 조직을 처음부터 다시 만들기." }),
          copy("2/ The move: Portato + one Chief. Link the listing.", { ko: "2/ 수: Portato + Chief 하나. 목록 링크." }),
          copy("3/ Gold tasks: three examples, no secrets.", { ko: "3/ 골드 태스크: 예시 세 개, 비밀 없음." }),
          copy("4/ Cut over: source cron off, Grok routine on.", { ko: "4/ 컷오버: 소스 cron 끄고 Grok 루틴 켜기." }),
          copy("5/ Ask people to quote-post their own gold tasks, not their keys.", {
            ko: "5/ 키 말고 자기 골드 태스크를 인용해 달라고 하세요.",
          }),
        ],
      },
      {
        type: "h3",
        text: copy("Threads", { ko: "Threads" }),
      },
      {
        type: "p",
        text: copy(
          "Same facts, slightly longer. Lead with the job. Put the URL in the first screen. Do not split the install across five posts.",
          {
            ko: "같은 사실, 조금 더 길게. 일로 시작하세요. URL을 첫 화면에 두세요. 설치를 다섯 포스트로 쪼개지 마세요.",
          },
        ),
      },
      {
        type: "h3",
        text: copy("Do not", { ko: "하지 말 것" }),
      },
      {
        type: "ul",
        items: [
          copy("Do not paste someone else’s shared Bot configuration. The terms forbid redistribution without permission. Link the official preview instead.", {
            ko: "다른 사람 공유 봇 설정을 붙여 넣지 마세요. 약관은 허락 없는 재배포를 금합니다. 공식 미리보기 링크를 쓰세요.",
          }),
          copy("Do not screenshot API keys, internal URLs, or customer names.", {
            ko: "API 키, 내부 URL, 고객 이름 스크린샷을 올리지 마세요.",
          }),
          copy("Do not claim xAI endorsement. Third-party templates are unverified.", {
            ko: "xAI 보증을 주장하지 마세요. 제3자 템플릿은 미검증입니다.",
          }),
        ],
      },
    ],
  },
  {
    id: "roster",
    title: copy("A small roster", {
      ko: "작은 명단",
      ja: "小さな編成",
      "zh-CN": "小编制",
      "zh-TW": "小編制",
    }),
    blocks: [
      {
        type: "p",
        text: copy(
          "An account holds up to 50 Bots and group chats combined. Ten Bots you skim is worse than two you trust.",
          {
            ko: "계정은 봇과 그룹 채팅을 합쳐 50개입니다. 흘려보는 열 개보다 믿는 두 개가 낫습니다.",
          },
        ),
      },
      {
        type: "ol",
        items: [
          copy("One Chief that owns the front door.", { ko: "정문을 맡은 Chief 하나." }),
          copy("Add a specialist only when the job is stable.", { ko: "일이 안정됐을 때만 전문가를 추가." }),
          copy("Put them in a group chat when the handoff itself needs to be visible.", {
            ko: "인수인계 자체가 보여야 하면 그룹 채팅에 넣기.",
          }),
          copy("Keep send, pay, delete, and share behind approval.", {
            ko: "보내기, 결제, 삭제, 공유는 승인 뒤에.",
          }),
        ],
      },
    ],
  },
  {
    id: "glossary",
    title: copy("Glossary", { ko: "용어", ja: "用語", "zh-CN": "术语", "zh-TW": "用語" }),
    blocks: [
      {
        type: "ul",
        items: [
          copy("Listing — a specialist or team on getgrokbot.com.", { ko: "목록 — getgrokbot.com의 전문가 또는 팀." }),
          copy("Template — a shareable Grok Bot (x.ai/bot/…) or paste-ready setup text.", {
            ko: "템플릿 — 공유 가능한 Grok Bot(x.ai/bot/…) 또는 붙여 넣는 설정 문구.",
          }),
          copy("Add to Grok — official install from a public share link.", {
            ko: "Add to Grok — 공개 공유 링크로 하는 공식 설치.",
          }),
          copy("Copy — clipboard install into Edit Profile.", { ko: "Copy — Edit Profile에 붙이는 클립보드 설치." }),
          copy("Portato / Portato — the migrate Bot for Hermes or OpenClaw.", {
            ko: "Portato / Portato — Hermes 또는 OpenClaw용 이전 봇.",
          }),
          copy("Gold task — a named input and expected output that must pass before cutover.", {
            ko: "골드 태스크 — 컷오버 전에 통과해야 하는 이름 있는 입력과 기대 출력.",
          }),
          copy("Skill / routine — how / when.", { ko: "스킬 / 루틴 — how / when." }),
          copy("Chief — the first Bot. Not a Nexus.", { ko: "Chief — 첫 봇. Nexus가 아님." }),
        ],
      },
    ],
  },
  {
    id: "sources",
    title: copy("Sources", { ko: "출처", ja: "出典", "zh-CN": "来源", "zh-TW": "來源" }),
    blocks: [
      {
        type: "p",
        text: copy(
          "Mechanics come from xAI docs. This site adds directory listings, Portato, and the migrate skill. Unofficial. MIT.",
          {
            ko: "동작 원리는 xAI 문서입니다. 이 사이트는 목록, Portato, 이전 스킬을 더합니다. 비공식. MIT.",
          },
        ),
      },
      {
        type: "ul",
        items: [
          copy(`Create and manage Bots (Share a Bot): ${GROK_BOT.bots}`, {
            ko: `봇 만들기와 관리(공유): ${GROK_BOT.bots}`,
          }),
          copy(`FAQ: ${GROK_BOT.faq}`, { ko: `FAQ: ${GROK_BOT.faq}` }),
          copy(`Get started: ${GROK_BOT.getStarted}`, { ko: `시작: ${GROK_BOT.getStarted}` }),
          copy(`Skills and routines: ${GROK_BOT.skills}`, { ko: `스킬과 루틴: ${GROK_BOT.skills}` }),
          copy(`Computer and apps: ${GROK_BOT.computer}`, { ko: `컴퓨터와 앱: ${GROK_BOT.computer}` }),
          copy(`Third-party bot terms: ${GROK_BOT.shareTerms}`, { ko: `제3자 봇 약관: ${GROK_BOT.shareTerms}` }),
          copy(`Launch: ${GROK_BOT.launch}`, { ko: `런칭: ${GROK_BOT.launch}` }),
        ],
      },
    ],
  },
];
