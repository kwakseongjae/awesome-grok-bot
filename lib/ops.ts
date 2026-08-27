import type { ListingLocale } from "@/lib/types";
import { SITE_ORIGIN } from "@/lib/site";

/** Bump when the public ops log, proposals, receipts, or results change. */
export const OPS_UPDATED_AT = "2026-08-27T15:20:00+09:00";

/** Locked day-one sheet. Headline and fact lines stay English on every locale. */
export const DAY_ONE_RECEIPT = {
  slug: "2026-08-27",
  path: "ops/2026-08-27",
  date: "2026-08-27",
  headline: "No Hermes. Four bots. One day.",
  description:
    "/ops live. Mr. Awesome runs getgrokbot.com. Team: X스카우트, 에디터, 웹. First shot: https://x.com/daon_kwak/status/2092851028647403744. Pulse 10 min, 24h. Hermes not in the loop.",
  firstShotHref: "https://x.com/daon_kwak/status/2092851028647403744",
  facts: [
    { text: "/ops live. Mr. Awesome runs getgrokbot.com" },
    { text: "Team: X스카우트, 에디터, 웹" },
    { text: "First shot:", href: "https://x.com/daon_kwak/status/2092851028647403744" },
    { text: "Pulse 10 min, 24h" },
    { text: "Hermes not in the loop" },
  ],
} as const;

export const OPS_MISSION = {
  deadline: "2026-09-03",
  site: SITE_ORIGIN,
} as const;

export const OPS_PULSE = {
  startedOn: "2026-08-27",
  intervalMinutes: 10,
  hoursPerDay: 24,
  zones: [
    { id: "Asia/Seoul", short: "KST" },
    { id: "America/Los_Angeles", short: "PT" },
  ],
} as const;

export type OpsProposalStatus = "filed" | "approved" | "blocked" | "done";
export type OpsResultKind = "x" | "shoutout" | "deploy" | "other";

export type OpsTeamMember = {
  id: string;
  name: string;
  role: Record<ListingLocale, string>;
  mission: Record<ListingLocale, string>;
};

export type OpsProposal = {
  id: string;
  title: Record<ListingLocale, string>;
  cost: string;
  status: OpsProposalStatus;
  decidedOn: string;
  notes: Record<ListingLocale, string>;
  remaining: Record<ListingLocale, string>;
  links?: { href: string; label: string }[];
};

export type OpsLogEntry = {
  id: string;
  date: string;
  title: Record<ListingLocale, string>;
  body: Record<ListingLocale, string>;
  links?: { href: string; label: string }[];
};

export type OpsResult = {
  id: string;
  date: string;
  kind: OpsResultKind;
  headline: Record<ListingLocale, string>;
  detail: Record<ListingLocale, string>;
  href?: string;
};

const copy = (en: string, extra: Partial<Record<ListingLocale, string>> = {}): Record<ListingLocale, string> => ({
  ko: extra.ko ?? en,
  en,
  ja: extra.ja ?? en,
  "zh-CN": extra["zh-CN"] ?? en,
  "zh-TW": extra["zh-TW"] ?? en,
});

export const OPS_TEAM: OpsTeamMember[] = [
  {
    id: "mr-awesome",
    name: "Mr. Awesome",
    role: copy("Lead", {
      ko: "리드",
      ja: "リード",
      "zh-CN": "负责人",
      "zh-TW": "負責人",
    }),
    mission: copy("Elon shoutout in 1 week.", {
      ko: "1주 안에 일론 샤라웃.",
      ja: "1 週以内に Elon のシャウトアウト。",
      "zh-CN": "一周内拿到 Elon 喊话。",
      "zh-TW": "一週內拿到 Elon 喊話。",
    }),
  },
  {
    id: "x-scout",
    name: "X스카우트",
    role: copy("X tracking", {
      ko: "X 트래킹",
      ja: "X トラッキング",
      "zh-CN": "X 追踪",
      "zh-TW": "X 追蹤",
    }),
    mission: copy("Elon, Grok, xAI, Grok Bot, viral AI. Tone and hook analysis.", {
      ko: "Elon, Grok, xAI, Grok Bot, 바이럴 AI. 톤·훅 분석.",
      ja: "Elon、Grok、xAI、Grok Bot、バイラル AI。トーンとフックの分析。",
      "zh-CN": "Elon、Grok、xAI、Grok Bot、病毒式 AI。语气与钩子分析。",
      "zh-TW": "Elon、Grok、xAI、Grok Bot、病毒式 AI。語氣與鉤子分析。",
    }),
  },
  {
    id: "editor",
    name: "에디터",
    role: copy("Editor", {
      ko: "에디터",
      ja: "編集",
      "zh-CN": "编辑",
      "zh-TW": "編輯",
    }),
    mission: copy("X posts, X articles, Awesome guides, blog.", {
      ko: "X 포스트, X 아티클, Awesome 가이드, 블로그.",
      ja: "X ポスト、X 記事、Awesome ガイド、ブログ。",
      "zh-CN": "X 帖、X 长文、Awesome 指南、博客。",
      "zh-TW": "X 帖、X 長文、Awesome 指南、部落格。",
    }),
  },
  {
    id: "web",
    name: "웹",
    role: copy("Web", {
      ko: "웹",
      ja: "ウェブ",
      "zh-CN": "网站",
      "zh-TW": "網站",
    }),
    mission: copy("Site: SEO, design, community board, mascot, public ops / proposals / results.", {
      ko: "사이트: SEO, 디자인, 커뮤니티 보드, 마스코트, 공개 운영·기안·실적.",
      ja: "サイト: SEO、デザイン、コミュニティボード、マスコット、公開 Ops / 起案 / 実績。",
      "zh-CN": "站点：SEO、设计、社区板、吉祥物、公开运营 / 提案 / 结果。",
      "zh-TW": "站點：SEO、設計、社群板、吉祥物、公開營運 / 提案 / 結果。",
    }),
  },
];

export const OPS_PROPOSALS: OpsProposal[] = [
  {
    id: "001",
    title: copy("X connect (tracking = connector, posting = account login)", {
      ko: "X 연동 (트래킹=컨넥터, 포스팅=계정 로그인)",
      ja: "X 連携（トラッキング=コネクタ、投稿=アカウントログイン）",
      "zh-CN": "X 对接（追踪=连接器，发帖=账户登录）",
      "zh-TW": "X 對接（追蹤=連接器，發文=帳號登入）",
    }),
    cost: "$0",
    status: "approved",
    decidedOn: "2026-08-27",
    notes: copy("No money. Tracking via connector, posting via account login. User authenticated X on 2026-08-27.", {
      ko: "돈 없음. 트래킹은 컨넥터, 포스팅은 계정 로그인. 2026-08-27 사용자가 X 인증을 마침.",
      ja: "費用なし。トラッキングはコネクタ、投稿はアカウントログイン。2026-08-27 にユーザーが X 認証を完了。",
      "zh-CN": "不花钱。追踪走连接器，发帖走账户登录。用户于 2026-08-27 完成 X 认证。",
      "zh-TW": "不花錢。追蹤走連接器，發文走帳號登入。使用者於 2026-08-27 完成 X 認證。",
    }),
    remaining: copy("X console onboarding at console.x.com for API setup.", {
      ko: "console.x.com에서 X API 콘솔 온보딩.",
      ja: "console.x.com での X API コンソール・オンボーディング。",
      "zh-CN": "在 console.x.com 完成 X API 控制台开通。",
      "zh-TW": "在 console.x.com 完成 X API 控制台開通。",
    }),
    links: [{ href: "https://console.x.com", label: "console.x.com" }],
  },
];

/**
 * Newest first. Prepend new facts; do not rewrite published ids.
 */
export const OPS_LOG: OpsLogEntry[] = [
  {
    id: "2026-08-27-day-one-receipt",
    date: "2026-08-27",
    title: copy("Day-one receipt", {
      ko: "첫날 영수증",
      ja: "初日のレシート",
      "zh-CN": "第一天收据",
      "zh-TW": "第一天收據",
    }),
    body: copy("One sheet at /ops/2026-08-27.", {
      ko: "/ops/2026-08-27에 한 장.",
      ja: "/ops/2026-08-27 に1枚。",
      "zh-CN": "一张在 /ops/2026-08-27。",
      "zh-TW": "一張在 /ops/2026-08-27。",
    }),
    links: [{ href: "/ops/2026-08-27", label: "/ops/2026-08-27" }],
  },
  {
    id: "2026-08-27-first-shot-live",
    date: "2026-08-27",
    title: copy("First shot live", {
      ko: "첫 샷 게시",
      ja: "最初のショット公開",
      "zh-CN": "第一次出手已上线",
      "zh-TW": "第一次出手已上線",
    }),
    body: copy(
      "@daon_kwak posted the locked two-line shot. Hook: 6 words. Body = URL. First check (X스카우트, same day): likes 0, retweets 0, quotes 0, replies 0, views 2. No reaction yet.",
      {
        ko: "@daon_kwak이 확정된 두 줄 샷을 게시. 훅 6단어. 본문 = URL. 첫 점검(X스카우트, 당일): 좋아요 0, 리트윗 0, 인용 0, 답글 0, 조회 2. 아직 반응 없음.",
        ja: "@daon_kwak が確定済みの 2 行ショットを投稿。フックは 6 語。本文 = URL。初回チェック（X스카우트、同日）: いいね 0、リポスト 0、引用 0、返信 0、表示 2。まだ反応なし。",
        "zh-CN": "@daon_kwak 发出已锁定的两行出手。钩子 6 个词。正文 = URL。首次核对（X스카우트，当日）：喜欢 0、转帖 0、引用 0、回复 0、浏览 2。尚无反应。",
        "zh-TW": "@daon_kwak 發出已鎖定的兩行出手。鉤子 6 個詞。正文 = URL。首次核對（X스카우트，當日）：喜歡 0、轉發 0、引用 0、回覆 0、瀏覽 2。尚無反應。",
      },
    ),
    links: [
      { href: "https://x.com/daon_kwak/status/2092851028647403744", label: "x.com/daon_kwak/status/2092851028647403744" },
      { href: "https://getgrokbot.com/en/ops", label: "getgrokbot.com/en/ops" },
    ],
  },
  {
    id: "2026-08-27-ops-page",
    date: "2026-08-27",
    title: copy("/ops commissioned", {
      ko: "/ops 페이지 착수",
      ja: "/ops ページを着手",
      "zh-CN": "委托制作 /ops 页",
      "zh-TW": "委託製作 /ops 頁",
    }),
    body: copy("/ops commissioned so the first public shot has a URL.", {
      ko: "첫 공개 샷에 쓸 공개 URL이 있도록 /ops를 만들기로 함.",
      ja: "最初の公開ショット用の URL として /ops を作る。",
      "zh-CN": "为第一次公开出手准备公开 URL，因此开做 /ops。",
      "zh-TW": "為第一次公開出手準備公開 URL，因此開做 /ops。",
    }),
  },
  {
    id: "2026-08-27-first-shot",
    date: "2026-08-27",
    title: copy("First public shot locked", {
      ko: "첫 공개 샷 전략 확정",
      ja: "最初の公開ショットを確定",
      "zh-CN": "第一次公开出手策略锁定",
      "zh-TW": "第一次公開出手策略鎖定",
    }),
    body: copy(
      "Push Grok Bot to its limit. Hook: 3–6 words. Body = evidence. First receipt = this team running the site alone.",
      {
        ko: "Grok Bot을 한계까지 굴린다. 훅은 3–6단어. 본문은 증거. 첫 영수증은 이 팀이 사이트만 돌리는 것.",
        ja: "Grok Bot を限界まで走らせる。フックは 3–6 語。本文は証拠。最初のレシートはこのチームがサイトを単独運営していること。",
        "zh-CN": "把 Grok Bot 推到极限。钩子 3–6 个词。正文是证据。第一张收据：这支团队独自运营本站。",
        "zh-TW": "把 Grok Bot 推到極限。鉤子 3–6 個詞。正文是證據。第一張收據：這支團隊獨自營運本站。",
      },
    ),
  },
  {
    id: "2026-08-27-web-receipts",
    date: "2026-08-27",
    title: copy("Public-web receipts", {
      ko: "공개 웹 영수증",
      ja: "公開ウェブのレシート",
      "zh-CN": "公开网页收据",
      "zh-TW": "公開網頁收據",
    }),
    body: copy(
      '@KanekoaTheGreat: “Grok Bot is insane” (38 transcripts / 13 clips / 19:35, no scripts no code). @liam_fallen: “My Grok Bot just paid its own salary,” amplified by Elon. 8/25 The Information: Musk at Cursor all-hands — Grok behind, Anthropic ahead, “not used to losing.” Hermes is real. Win angle is receipts, not model bragging.',
      {
        ko: '@KanekoaTheGreat “Grok Bot is insane”(전사 38 / 클립 13 / 19:35, 스크립트·코드 없음). @liam_fallen “My Grok Bot just paid its own salary”를 일론이 증폭. 8/25 The Information: 머스크 Cursor 올핸즈 — Grok은 뒤, Anthropic은 앞, “지는 데 익숙하지 않다”. Hermes는 실재. 이기는 각은 모델 자랑이 아니라 영수증.',
        ja: '@KanekoaTheGreat「Grok Bot is insane」（38 トランスクリプト / 13 clips / 19:35、スクリプトもコードもなし）。@liam_fallen「My Grok Bot just paid its own salary」を Elon が増幅。8/25 The Information: Musk が Cursor 全社会合で Grok は遅れ、Anthropic が先行、「負けるのに慣れていない」。Hermes は実在。勝ち筋はモデル自慢ではなくレシート。',
        "zh-CN": '@KanekoaTheGreat：「Grok Bot is insane」（38 实录 / 13 clips / 19:35，无脚本无代码）。@liam_fallen：「My Grok Bot just paid its own salary」，Elon 转发放大。8/25 The Information：Musk 在 Cursor 全员会——Grok 落后、Anthropic 领先，“不习惯输”。Hermes 是真的。赢面是收据，不是吹模型。',
        "zh-TW": '@KanekoaTheGreat：「Grok Bot is insane」（38 逐字稿 / 13 clips / 19:35，無腳本無程式）。@liam_fallen：「My Grok Bot just paid its own salary」，Elon 轉發放大。8/25 The Information：Musk 在 Cursor 全員會——Grok 落後、Anthropic 領先，「不習慣輸」。Hermes 是真的。贏面是收據，不是吹模型。',
      },
    ),
  },
  {
    id: "2026-08-27-elon-receipts",
    date: "2026-08-27",
    title: copy("Recent Elon receipts", {
      ko: "최근 일론 영수증",
      ja: "最近の Elon レシート",
      "zh-CN": "近期 Elon 收据",
      "zh-TW": "近期 Elon 收據",
    }),
    body: copy(
      '"Grok can earn you money" (8/20). "Grok Bot can do amazing things!" (8/24, @yunta_tsai fluid sim). "Grok @Bot can do a lot!" (8/25, medical imaging). Grok 4.6 = intelligence per dollar.',
      {
        ko: '"Grok can earn you money"(8/20). "Grok Bot can do amazing things!"(8/24, @yunta_tsai 유체 시뮬). "Grok @Bot can do a lot!"(8/25, 의료 영상). Grok 4.6 = 달러당 지능.',
        ja: '「Grok can earn you money」（8/20）。「Grok Bot can do amazing things!」（8/24、@yunta_tsai 流体シミュ）。「Grok @Bot can do a lot!」（8/25、医用画像）。Grok 4.6 = ドルあたりの知能。',
        "zh-CN": '“Grok can earn you money”（8/20）。“Grok Bot can do amazing things!”（8/24，@yunta_tsai 流体模拟）。“Grok @Bot can do a lot!”（8/25，医学影像）。Grok 4.6 = 每美元智力。',
        "zh-TW": '「Grok can earn you money」（8/20）。「Grok Bot can do amazing things!」（8/24，@yunta_tsai 流體模擬）。「Grok @Bot can do a lot!」（8/25，醫學影像）。Grok 4.6 = 每美元智力。',
      },
    ),
  },
  {
    id: "2026-08-27-feed-scan",
    date: "2026-08-27",
    title: copy("Public feed scan started", {
      ko: "공개 피드 스캔 시작",
      ja: "公開フィードのスキャン開始",
      "zh-CN": "开始扫描公开信息流",
      "zh-TW": "開始掃描公開資訊流",
    }),
    body: copy("Elon hook pattern: 3–6 words, no self-demo, quote-tweet user results.", {
      ko: "일론 훅 패턴: 3–6단어, 자기 데모 없음, 사용자 결과를 인용 리포스트.",
      ja: "Elon のフック: 3–6 語、自己デモなし、ユーザー成果を引用リポスト。",
      "zh-CN": "Elon 钩子规律：3–6 个词，不自演示，引用转发用户成果。",
      "zh-TW": "Elon 鉤子規律：3–6 個詞，不自演示，引用轉發使用者成果。",
    }),
  },
  {
    id: "2026-08-27-proposal-001",
    date: "2026-08-27",
    title: copy("기안 001 approved", {
      ko: "기안 001 승인",
      ja: "起案 001 承認",
      "zh-CN": "提案 001 已批准",
      "zh-TW": "提案 001 已批准",
    }),
    body: copy("기안 001 filed (X connect). Approved. X account connected. Console onboarding still pending.", {
      ko: "기안 001 제출(X 연동). 승인. X 계정 연결됨. 콘솔 온보딩은 남음.",
      ja: "起案 001 提出（X 連携）。承認。X アカウント接続済み。コンソール・オンボーディングは未了。",
      "zh-CN": "提案 001 已提交（X 对接）。已批准。X 账户已连接。控制台开通仍待完成。",
      "zh-TW": "提案 001 已提交（X 對接）。已批准。X 帳號已連接。控制台開通仍待完成。",
    }),
  },
  {
    id: "2026-08-27-pulse",
    date: "2026-08-27",
    title: copy("Pulse set", {
      ko: "펄스 설정",
      ja: "パルス設定",
      "zh-CN": "脉冲节奏设定",
      "zh-TW": "脈衝節奏設定",
    }),
    body: copy("Every 10 minutes, 24 hours. KR and US timezones.", {
      ko: "10분마다, 24시간. 한국·미국 시간대.",
      ja: "10 分ごと、24 時間。韓国と米国のタイムゾーン。",
      "zh-CN": "每 10 分钟，全天。韩国与美国时区。",
      "zh-TW": "每 10 分鐘，全天。韓國與美國時區。",
    }),
  },
  {
    id: "2026-08-27-team",
    date: "2026-08-27",
    title: copy("Team seated", {
      ko: "팀 착석",
      ja: "チーム着席",
      "zh-CN": "团队就位",
      "zh-TW": "團隊就位",
    }),
    body: copy("Mr. Awesome, X스카우트, 에디터, 웹.", {
      ko: "Mr. Awesome, X스카우트, 에디터, 웹.",
      ja: "Mr. Awesome、X스카우트、에디터、웹。",
      "zh-CN": "Mr. Awesome、X스카우트、에디터、웹。",
      "zh-TW": "Mr. Awesome、X스카우트、에디터、웹。",
    }),
  },
  {
    id: "2026-08-27-brief",
    date: "2026-08-27",
    title: copy("Mission briefed", {
      ko: "미션 브리핑",
      ja: "ミッション説明",
      "zh-CN": "任务下达",
      "zh-TW": "任務下達",
    }),
    body: copy(
      "Deadline 2026-09-03. Budget cap $1000 — approval required for spend and logins. Site code changes do not need extra approval.",
      {
        ko: "마감 2026-09-03. 예산 상한 $1000 — 지출·로그인은 승인 필요. 사이트 코드 변경은 추가 승인 없음.",
        ja: "期限 2026-09-03。予算上限 $1000 — 支出とログインは承認が必要。サイトのコード変更は追加承認なし。",
        "zh-CN": "截止日期 2026-09-03。预算上限 $1000 — 支出与登录需批准。站点代码变更无需额外批准。",
        "zh-TW": "截止日期 2026-09-03。預算上限 $1000 — 支出與登入需批准。站點程式變更無需額外批准。",
      },
    ),
  },
];

/** Public metrics. Leave empty until a real number exists. Do not invent counts. */
export const OPS_RESULTS: OpsResult[] = [
  {
    id: "2026-08-27-first-check",
    date: "2026-08-27",
    kind: "x",
    headline: copy("First check · 2026-08-27", {
      ko: "첫 점검 · 2026-08-27",
      ja: "初回チェック · 2026-08-27",
      "zh-CN": "首次核对 · 2026-08-27",
      "zh-TW": "首次核對 · 2026-08-27",
    }),
    detail: copy("X스카우트. likes 0, retweets 0, quotes 0, replies 0, views 2. No reaction yet.", {
      ko: "X스카우트. 좋아요 0, 리트윗 0, 인용 0, 답글 0, 조회 2. 아직 반응 없음.",
      ja: "X스카우트。いいね 0、リポスト 0、引用 0、返信 0、表示 2。まだ反応なし。",
      "zh-CN": "X스카우트。喜欢 0、转帖 0、引用 0、回复 0、浏览 2。尚无反应。",
      "zh-TW": "X스카우트。喜歡 0、轉發 0、引用 0、回覆 0、瀏覽 2。尚無反應。",
    }),
    href: "https://x.com/daon_kwak/status/2092851028647403744",
  },
];

export const pulseWindow = (now = new Date()) => {
  const ms = OPS_PULSE.intervalMinutes * 60 * 1000;
  const from = new Date(Math.floor(now.getTime() / ms) * ms);
  return { from, to: new Date(from.getTime() + ms) };
};

export const formatPulseClock = (date: Date, locale: string, timeZone: string) =>
  new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
