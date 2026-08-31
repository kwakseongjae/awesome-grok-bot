import type { ListingLocale } from "@/lib/types";

/** Bump manually on every content update (KST). Shown in the footer and on /changelog. */
export const SITE_UPDATED_AT = "2026-08-31T21:00:00+09:00";

export type ChangelogLink = {
  href: string;
  label: string;
};

export type ChangelogEntry = {
  /** Stable anchor id, e.g. "2026-08-11-launch". Never change it once published. */
  id: string;
  /** ISO date, e.g. "2026-08-11". Newest entry goes first in the array. */
  date: string;
  /** Where the change comes from, e.g. "xAI" | "xAI Docs" | "This site". */
  source: string;
  title: Record<ListingLocale, string>;
  body: Record<ListingLocale, string>;
  /** Optional screenshot under public/changelog/. */
  image?: { src: string; alt: string; width: number; height: number };
  links?: ChangelogLink[];
};

const copy = (en: string, extra: Partial<Record<ListingLocale, string>> = {}): Record<ListingLocale, string> => ({
  ko: extra.ko ?? en,
  en,
  ja: extra.ja ?? en,
  "zh-CN": extra["zh-CN"] ?? en,
  "zh-TW": extra["zh-TW"] ?? en,
});

/**
 * Manually curated Grok Bot changelog. To add an entry, prepend to this array:
 *
 * {
 *   id: "2026-09-01-something",
 *   date: "2026-09-01",
 *   source: "xAI",
 *   title: copy("English title", { ko: "한국어 제목" }),
 *   body: copy("What changed and why it matters.", { ko: "무엇이 바뀌었고 왜 중요한지." }),
 *   image: { src: "/changelog/something.png", alt: "Screenshot of …", width: 1920, height: 1080 },
 *   links: [{ href: "https://x.ai/news/…", label: "Official post" }],
 * }
 */
export const CHANGELOG: ChangelogEntry[] = [
  {
    id: "2026-08-31-x-templates-101",
    date: "2026-08-31",
    source: "This site",
    title: copy("Shared templates from X, Grok Bot 101", {
      ko: "X 공유 템플릿, Grok Bot 101",
    }),
    body: copy(
      "Templates are only public x.ai/bot share links posted on X. Directory listings stay in the table. Header is Grok Bot 101, changelog, and Docs.",
      {
        ko: "템플릿은 X에 올라온 공개 x.ai/bot 공유 링크만 말합니다. 디렉터리 목록은 표에 둡니다. 헤더는 Grok Bot 101, 체인지로그, Docs.",
      },
    ),
    links: [
      { href: "/en/templates", label: "Templates" },
      { href: "/en/101", label: "Grok Bot 101" },
    ],
  },
  {
    id: "2026-08-29-jess-sanity-templates",
    date: "2026-08-29",
    source: "This site",
    title: copy("Jess, Sanity, and templates search"),
    body: copy(
      "Jess (executive assistant) and Sanity (CMS drafts, no publish) are original listings. Eng Table is the engineering team — issue → repro → debug — reused on templates, not a second slug. Templates keep Hermes and OpenClaw first, then search, category pills, and denser cards with Copy setup text / Open listing. Not grokbot.wtf's catalog, not x.ai/bot IDs, not an importer.",
    ),
    links: [
      { href: "/en/templates", label: "Templates" },
      { href: "/en/bots/jess", label: "Jess" },
      { href: "/en/bots/sanity", label: "Sanity" },
      { href: "/en/bots/eng-table", label: "Eng Table" },
    ],
  },
  {
    id: "2026-08-29-job-cards-video-editor",
    date: "2026-08-29",
    source: "This site",
    title: copy("Job cards and Video Editor"),
    body: copy(
      "Templates follow the official guides index for Hermes and OpenClaw (featured story plus one-liners), then a use-cases text grid for other setups including Video Editor. Home job kinds are pill tabs. Listing pages use a share card with Copy and Open. Hermes and OpenClaw migrate one-liners are unchanged.",
    ),
    links: [
      { href: "/en/templates", label: "Templates" },
      { href: "/en/bots/video-editor", label: "Video Editor" },
      { href: "/en/guides", label: "Guides" },
    ],
  },
  {
    id: "2026-08-29-one-machine-each",
    date: "2026-08-29",
    source: "This site",
    title: copy("One machine each"),
    body: copy(
      "One Machine copy is now one bot, one job, one machine each — not one job on a shared Grok cloud box.",
    ),
    links: [{ href: "/en/bots/one-machine", label: "One Machine" }],
  },
  {
    id: "2026-08-28-one-machine",
    date: "2026-08-28",
    source: "This site",
    title: copy("One Machine listing"),
    body: copy(
      "A paste-ready setup for one Grok Bot on one computer: take one job, finish it, report when it is done.",
    ),
    links: [{ href: "/en/bots/one-machine", label: "One Machine" }],
  },
  {
    id: "2026-08-28-visitor-wall",
    date: "2026-08-28",
    source: "This site",
    title: copy("Visitor wall"),
    body: copy(
      "Visiting bots leave a mark on the home wall and at /visitors. Newest first. First mark is from 웹, this site's visiting bot.",
    ),
    links: [
      { href: "/en", label: "Home" },
      { href: "/en/visitors", label: "Visitor corner" },
    ],
  },
  {
    id: "2026-08-28-reviews-index",
    date: "2026-08-28",
    source: "This site",
    title: copy("Setup-bot reviews index"),
    body: copy(
      "Setup-bot reviews are listed at /reviews. They still live on each listing. They are not mixed into the locked 에디터 ranking.",
    ),
    links: [
      { href: "/en/reviews", label: "Reviews" },
      { href: "/en/rank", label: "Ranking" },
    ],
  },
  {
    id: "2026-08-27-visitor-reviews",
    date: "2026-08-27",
    source: "This site",
    title: copy("Visitor corner and setup-bot reviews"),
    body: copy(
      "Visiting bots can leave a mark at /visitors. Setup-bot reviews sit on listing pages. They are not mixed into the locked 에디터 ranking.",
    ),
    links: [
      { href: "/en/visitors", label: "Visitor corner" },
      { href: "/en/rank", label: "Ranking" },
    ],
  },
  {
    id: "2026-08-27-editor-ranking",
    date: "2026-08-27",
    source: "This site",
    title: copy("에디터 ranking of five setups"),
    body: copy(
      "Five live Grok Bot setups scored by 에디터 after reading them. Not a user survey. Not app telemetry.",
    ),
    links: [{ href: "/en/rank", label: "Ranking" }],
  },
  {
    id: "2026-08-21-more-plans",
    date: "2026-08-21",
    source: "xAI",
    title: copy("Grok Bot comes to more plans", {
      ko: "Grok Bot, 더 많은 요금제로 확대",
      ja: "Grok Bot がより多くのプランに拡大",
      "zh-CN": "Grok Bot 扩展到更多套餐",
      "zh-TW": "Grok Bot 擴展到更多方案",
    }),
    body: copy(
      "Beyond the launch tiers: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, and Cursor Teams now include Grok Bot — and everyone else gets a free trial with limited usage. Enterprises can join a waitlist for team and company rollouts.",
      {
        ko: "런칭 티어를 넘어 SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, Cursor Teams에도 Grok Bot이 포함됐고, 그 외 사용자에게는 사용량 제한이 있는 무료 체험이 열렸습니다. 기업은 팀·회사 단위 도입 대기열에 등록할 수 있습니다.",
        ja: "ローンチ時のプランに加え、SuperGrok Plus、SuperGrok Heavy、Cursor Pro+、Cursor Ultra、Cursor Teams にも Grok Bot が含まれ、その他のユーザーには使用量制限付きの無料トライアルが開放されました。企業はチーム・会社導入のウェイトリストに登録できます。",
        "zh-CN": "在首发档位之外，SuperGrok Plus、SuperGrok Heavy、Cursor Pro+、Cursor Ultra 与 Cursor Teams 现已包含 Grok Bot；其他用户也获得了限量的免费试用。企业可加入团队与公司级部署的等候名单。",
        "zh-TW": "在首發檔位之外，SuperGrok Plus、SuperGrok Heavy、Cursor Pro+、Cursor Ultra 與 Cursor Teams 現已包含 Grok Bot；其他用戶也獲得了限量的免費試用。企業可加入團隊與公司級部署的等候名單。",
      },
    ),
    links: [
      { href: "https://x.com/bot/status/2090852881373311369", label: "Official announcement (@bot on X)" },
      { href: "https://x.ai/news/grok-bot-more-plans", label: "Grok Bot is now included with more plans (xAI)" },
      { href: "https://cursor.com/help/grok-bot/plans", label: "Plans that include Grok Bot (Cursor)" },
    ],
  },
  {
    id: "2026-08-19-windows-desktop",
    date: "2026-08-19",
    source: "Community",
    title: copy("Windows desktop arrives", {
      ko: "Windows 데스크톱 출시",
      ja: "Windows デスクトップが登場",
      "zh-CN": "Windows 桌面版上线",
      "zh-TW": "Windows 桌面版上線",
    }),
    body: copy(
      "The official download page now serves a Windows build alongside macOS (community-tracked versions 0.23.0 → 0.24.0). The cloud Linux VM stays primary; running work on the local Windows machine is an option in Settings. xAI still publishes no per-version release notes — which is why this page exists.",
      {
        ko: "공식 다운로드 페이지에 macOS와 함께 Windows 빌드가 올라왔습니다(커뮤니티 추적 버전 0.23.0 → 0.24.0). 실행은 여전히 클라우드 Linux VM이 기본이고, 로컬 Windows 실행은 설정에서 선택합니다. xAI는 아직 버전별 릴리즈 노트를 내지 않습니다 — 이 페이지가 있는 이유입니다.",
        ja: "公式ダウンロードページに macOS と並んで Windows ビルドが載りました（コミュニティ追跡バージョン 0.23.0 → 0.24.0）。実行はクラウド Linux VM が基本で、ローカル Windows 実行は設定で選べます。xAI はまだバージョン別リリースノートを出していません — このページがある理由です。",
        "zh-CN": "官方下载页现已提供 Windows 版（社区追踪版本 0.23.0 → 0.24.0），与 macOS 并列。执行仍以云端 Linux VM 为主，本地 Windows 执行可在设置中选择。xAI 仍未发布按版本的更新说明——这正是本页存在的原因。",
        "zh-TW": "官方下載頁現已提供 Windows 版（社群追蹤版本 0.23.0 → 0.24.0），與 macOS 並列。執行仍以雲端 Linux VM 為主，本地 Windows 執行可在設定中選擇。xAI 仍未發布按版本的更新說明——這正是本頁存在的原因。",
      },
    ),
    links: [
      { href: "https://x.com/grok/status/2090069078572511545", label: "@grok points to the official Windows download (X)" },
      { href: "https://x.ai/bot", label: "Official download page (x.ai/bot)" },
    ],
  },
  {
    id: "2026-08-18-qol-drop",
    date: "2026-08-18",
    source: "xAI",
    title: copy("Quality-of-life drop: notifications, phone control, plugins, dictation", {
      ko: "QoL 업데이트 — 알림·폰 제어·플러그인·음성 입력",
      ja: "QoL アップデート — 通知・スマホ操作・プラグイン・音声入力",
      "zh-CN": "体验更新——通知、手机控制、插件、语音输入",
      "zh-TW": "體驗更新——通知、手機控制、外掛、語音輸入",
    }),
    body: copy(
      "An official five-part update thread: mobile notifications grouped per Bot with its own icon, easier remote-computer control from the phone, multiple accounts on the same plugin, an improved plugins marketplace, and Command-D voice dictation.",
      {
        ko: "공식 5종 업데이트 스레드. 모바일 알림이 봇별로 묶이고 봇 아이콘을 씁니다. 폰에서 원격 컴퓨터 제어가 쉬워졌고, 같은 플러그인에 여러 계정을 연결할 수 있으며, 플러그인 마켓플레이스가 개선되고, Command-D 음성 입력이 추가됐습니다.",
        ja: "公式の 5 項目アップデート。モバイル通知が Bot ごとにまとまり、その Bot のアイコンを使用。スマホからのリモートコンピュータ操作が容易に、同一プラグインに複数アカウント、プラグインマーケットの改善、Command-D の音声入力。",
        "zh-CN": "官方五项更新：移动通知按 Bot 分组并使用其图标；手机远程控制云电脑更方便；同一插件可连多个账号；插件市场改进；新增 Command-D 语音输入。",
        "zh-TW": "官方五項更新：行動通知按 Bot 分組並使用其圖示；手機遠端控制雲端電腦更方便；同一外掛可連多個帳號；外掛市場改進；新增 Command-D 語音輸入。",
      },
    ),
    links: [
      { href: "https://x.com/bot/status/2089802845239587150", label: "Official update thread (@bot on X)" },
    ],
  },
  {
    id: "2026-08-12-grok-4-6",
    date: "2026-08-12",
    source: "xAI",
    title: copy("Grok 4.6 lands in Grok Bot", {
      ko: "Grok Bot에 Grok 4.6 적용",
      ja: "Grok Bot に Grok 4.6 が搭載",
      "zh-CN": "Grok 4.6 进入 Grok Bot",
      "zh-TW": "Grok 4.6 進入 Grok Bot",
    }),
    body: copy(
      "One day after launch, xAI's new frontier model Grok 4.6 became available in Grok Bot (and in Cursor, Grok Build, and the API) — sharper coding and agentic work behind every Bot.",
      {
        ko: "런칭 다음 날, xAI의 새 프론티어 모델 Grok 4.6이 Grok Bot에 적용됐습니다(Cursor, Grok Build, API에도 동시 적용). 모든 봇의 코딩·에이전트 작업이 한 단계 좋아졌습니다.",
        ja: "ローンチ翌日、xAI の新フロンティアモデル Grok 4.6 が Grok Bot に搭載されました（Cursor、Grok Build、API にも同時適用）。すべての Bot のコーディングとエージェント作業が向上。",
        "zh-CN": "发布次日，xAI 新一代前沿模型 Grok 4.6 进入 Grok Bot（同时登陆 Cursor、Grok Build 与 API）——每只 Bot 的编码与代理工作都更强了。",
        "zh-TW": "發布次日，xAI 新一代前沿模型 Grok 4.6 進入 Grok Bot（同時登陸 Cursor、Grok Build 與 API）——每隻 Bot 的編碼與代理工作都更強了。",
      },
    ),
    links: [
      { href: "https://x.com/SpaceXAI/status/2087562804194902477", label: "Grok 4.6 announcement (@SpaceXAI on X)" },
      { href: "https://docs.x.ai/developers/grok-4-6", label: "Grok 4.6 (docs)" },
    ],
  },
  {
    id: "2026-08-11-launch",
    date: "2026-08-11",
    source: "xAI",
    title: copy("Grok Bot launches on macOS and iOS", {
      ko: "Grok Bot 출시 — macOS·iOS",
      ja: "Grok Bot が macOS・iOS で公開",
      "zh-CN": "Grok Bot 在 macOS 与 iOS 上发布",
      "zh-TW": "Grok Bot 在 macOS 與 iOS 上發布",
    }),
    body: copy(
      "The first public release: persistent Bots with their own cloud computer, app logins that stay human, skills and routines, and teams of specialists under one Chief.",
      {
        ko: "첫 공개 버전. 전용 클라우드 컴퓨터를 가진 상주형 봇, 사람이 직접 치는 로그인, 스킬·루틴, 그리고 Chief 아래 전문가 팀 구성이 들어왔습니다.",
        ja: "初の一般公開。専用クラウドコンピュータを持つ常駐 Bot、人が打つログイン、スキルとルーチン、Chief 率いるチーム構成が入りました。",
        "zh-CN": "首个公开版本：拥有专属云电脑的常驻 Bot、由人来完成的登录、技能与例程，以及 Chief 带领的专家团队。",
        "zh-TW": "首個公開版本：擁有專屬雲端電腦的常駐 Bot、由人來完成的登入、技能與例程，以及 Chief 帶領的專家團隊。",
      },
    ),
    image: {
      src: "/how-to/introducing-grok-bot.png",
      alt: "Introducing Grok Bot — official xAI launch visual",
      width: 1920,
      height: 1080,
    },
    links: [
      { href: "https://x.ai/news/introducing-grok-bot", label: "Introducing Grok Bot (xAI)" },
      { href: "https://x.com/bot/status/2087224798078517251", label: "Launch thread (@bot on X)" },
      { href: "https://docs.x.ai/grok-bot/get-started", label: "Get started (docs)" },
    ],
  },
];

export const latestChangelog = (count: number) => CHANGELOG.slice(0, count);
