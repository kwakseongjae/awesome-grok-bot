import type { ListingLocale } from "@/lib/types";

export type ReadingItem = {
  href: string;
  source: string;
  date: string;
  title: Record<ListingLocale, string>;
  note: Record<ListingLocale, string>;
};

const copy = (en: string, extra: Partial<Record<ListingLocale, string>> = {}): Record<ListingLocale, string> => ({
  ko: extra.ko ?? en,
  en,
  ja: extra.ja ?? en,
  "zh-CN": extra["zh-CN"] ?? en,
  "zh-TW": extra["zh-TW"] ?? en,
});

/** Launch-week posts and field notes (후기) around Grok Bot. Official xAI first, then verified X threads. */
export const READING: ReadingItem[] = [
  {
    href: "https://x.ai/news/introducing-grok-bot",
    source: "xAI",
    date: "2026-08-11",
    title: copy("Introducing Grok Bot"),
    note: copy("The official post. Computer, logins, many Bots, skills and routines.", {
      ko: "공식 소개. 컴퓨터, 로그인, 여러 봇, 스킬·루틴의 원문입니다.",
      ja: "公式発表。コンピュータ、ログイン、複数ボット、スキルとルーチン。",
      "zh-CN": "官方介绍。电脑、登录、多个 Bot、技能与例程。",
      "zh-TW": "官方介紹。電腦、登入、多個 Bot、技能與例程。",
    }),
  },
  {
    href: "https://venturebeat.com/orchestration/spacexais-grok-bot-turns-agents-into-persistent-digital-coworkers-that-can-operate-your-apps-for-120-per-month",
    source: "VentureBeat",
    date: "2026-08-11",
    title: copy("Persistent digital coworkers, $120 / seat"),
    note: copy("Launch-day write-up of plans and who gets in.", {
      ko: "요금제와 접근 범위를 런칭 당일 정리한 보도.",
      ja: "料金とアクセス範囲を発売当日にまとめた記事。",
      "zh-CN": "发布当天对套餐与准入范围的整理。",
      "zh-TW": "發布當天對方案與准入範圍的整理。",
    }),
  },
  {
    href: "https://www.unite.ai/xai-launches-grok-bot-always-on-ai-teammates-with-their-own-cloud-computers/",
    source: "Unite.AI",
    date: "2026-08-11",
    title: copy("Always-on teammates with their own computers"),
    note: copy("Unpacks the cloud computer and the SuperGrok Heavy / Cursor tiers.", {
      ko: "클라우드 컴퓨터와 SuperGrok Heavy / Cursor 티어를 풀어 쓴 글.",
      ja: "クラウドコンピュータと SuperGrok Heavy / Cursor プランの解説。",
      "zh-CN": "拆解云电脑与 SuperGrok Heavy / Cursor 档位。",
      "zh-TW": "拆解雲端電腦與 SuperGrok Heavy / Cursor 方案。",
    }),
  },
  {
    href: "https://x.com/rileybrown/status/2087235887012749383",
    source: "@rileybrown",
    date: "2026-08-11",
    title: copy("A 20-minute first walkthrough"),
    note: copy("Connections, plugins, skills, the cloud computer, bots talking to each other — and what's missing.", {
      ko: "연결, 플러그인, 스킬, 클라우드 컴퓨터, 봇끼리의 대화까지. 빠진 것도 짚습니다.",
      ja: "接続、プラグイン、スキル、クラウドコンピュータ、Bot 同士の会話まで。足りない点も指摘。",
      "zh-CN": "连接、插件、技能、云电脑、Bot 之间的对话，一次讲全。也点出缺什么。",
      "zh-TW": "連接、外掛、技能、雲端電腦、Bot 之間的對話，一次講全。也點出缺什麼。",
    }),
  },
  {
    href: "https://x.com/HouseHackerJon/status/2087635639701573962",
    source: "@HouseHackerJon",
    date: "2026-08-12",
    title: copy("A plumbing company runs intake on it"),
    note: copy("Work orders across Gmail, Slack, and ServiceTitan. Five or six jobs booked a day in about ten minutes.", {
      ko: "Gmail·Slack·ServiceTitan을 오가는 작업 접수. 하루 5~6건 예약을 10분 안에 끝냅니다.",
      ja: "Gmail・Slack・ServiceTitan をまたぐ受付業務。1 日 5〜6 件の予約を約 10 分で。",
      "zh-CN": "跨 Gmail、Slack、ServiceTitan 的工单接入。每天 5-6 单预约，约 10 分钟搞定。",
      "zh-TW": "跨 Gmail、Slack、ServiceTitan 的工單接入。每天 5-6 單預約，約 10 分鐘搞定。",
    }),
  },
  {
    href: "https://x.com/liam_fallen/status/2090355235751379002",
    source: "@liam_fallen",
    date: "2026-08-20",
    title: copy("One job: win back churned customers"),
    note: copy("Find six months of churn, email them, win some back — then draft the community plan overnight.", {
      ko: "6개월치 이탈 고객을 찾아 메일을 보내고 일부를 되찾습니다. 밤사이 커뮤니티 플랜 초안까지.",
      ja: "6 か月分の解約ユーザーを洗い出してメールし、一部を取り戻す。夜のうちにコミュニティ計画の草案まで。",
      "zh-CN": "找出六个月的流失客户，发邮件挽回一部分——夜里还起草了社区方案。",
      "zh-TW": "找出六個月的流失客戶，發郵件挽回一部分——夜裡還起草了社群方案。",
    }),
  },
  {
    href: "https://x.com/DillonLoomis/status/2091133785106686153",
    source: "@DillonLoomis",
    date: "2026-08-22",
    title: copy("Teach it with a screen recording"),
    note: copy("A Chief of Staff learns a desktop-cleanup workflow from one recording plus voice, then runs it.", {
      ko: "화면 녹화 한 번과 음성으로 데스크톱 정리 워크플로를 가르치면, 그대로 굴러갑니다.",
      ja: "画面録画 1 本と音声でデスクトップ整理のワークフローを教えると、そのまま回ります。",
      "zh-CN": "一段录屏加语音，教会 Chief of Staff 桌面整理流程，然后它就照着跑。",
      "zh-TW": "一段錄影加語音，教會 Chief of Staff 桌面整理流程，然後它就照著跑。",
    }),
  },
  {
    href: "https://docs.x.ai/grok-bot/get-started",
    source: "xAI Docs",
    date: "2026-08",
    title: copy("Get started"),
    note: copy("Install, first Bot, first task, then the human types the login wall.", {
      ko: "설치, 첫 봇, 첫 일. 로그인 벽은 사람이 칩니다.",
      ja: "インストール、最初の Bot、最初の仕事。ログイン壁は人が打ちます。",
      "zh-CN": "安装、第一只 Bot、第一份任务。登录墙由人来打。",
      "zh-TW": "安裝、第一隻 Bot、第一份任務。登入牆由人來打。",
    }),
  },
  {
    href: "https://docs.x.ai/grok-bot/skills-routines-and-automations",
    source: "xAI Docs",
    date: "2026-08",
    title: copy("Skills and routines"),
    note: copy("How is a skill. When is a routine. Show the job once before you schedule it.", {
      ko: "스킬은 how, 루틴은 when. 스케줄 전에 한 번 보여 줍니다.",
      ja: "スキルは how、ルーチンは when。予定の前に一度見せます。",
      "zh-CN": "技能是 how，例程是 when。排程前先示范一次。",
      "zh-TW": "技能是 how，例程是 when。排程前先示範一次。",
    }),
  },
];
