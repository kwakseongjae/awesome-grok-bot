---
title: Grok Bot 101
lang: ko
version: 0.2.0
updated: 2026-08-31
---

# Grok Bot 101

Grok Bot, Grok Build, Cursor 현장 바이블. 이 파일이 **한국어 원본**입니다. 고치고, 구글 독스에 붙이고, PDF로 보내고, 스크린샷은 `content/101/assets/`에 넣으면 됩니다. 영문 원본은 `en.md`입니다. 두 파일은 장 단위로 맞추고, 한 파일 안에서 섞어 번역하지 마세요.

이미지는 `assets/your-shot.png`로 두고 `![설명](assets/your-shot.png)`로 걸면 됩니다. 파일이 아직 없으면 슬롯만 보입니다.

---

## 1. 이게 뭔가

Grok Bot은 상주 동료입니다. 이름, 일, 대화, 클라우드 컴퓨터. 채팅창을 여는 쪽보다 사람을 고용하는 쪽에 가깝습니다.

[getgrokbot.com](https://getgrokbot.com)은 스폰서 없는 디렉터리입니다. xAI 제품이 아닙니다. 공식 제품: [x.ai/bot](https://x.ai/bot). 문서: [docs.x.ai/grok-bot](https://docs.x.ai/grok-bot).

빈 프로필부터 다시 만들 필요는 없습니다. X의 공개 템플릿은 한 번에 설치됩니다. 이 페이지의 핵심입니다.

---

## 2. Grok 스택

세 화면이 같은 프론티어 모델 계열을 씁니다. 같은 제품은 아닙니다.

### Grok Bot

항상 켜진 동료. 전용 컴퓨터, 플러그인, 스킬(how), 루틴(when), 그룹 채팅. 템플릿과 Portato는 여기를 겨냥합니다.

- 제품: https://x.ai/bot
- 시작: https://docs.x.ai/grok-bot/get-started
- 봇 만들기와 공유: https://docs.x.ai/grok-bot/bots
- 스킬과 루틴: https://docs.x.ai/grok-bot/skills-routines-and-automations
- 컴퓨터와 앱: https://docs.x.ai/grok-bot/computer-and-apps

### Grok Build

Grok으로 소프트웨어를 내는 xAI 빌드 화면. 일이 레포, 디프, 제품 조각일 때. 상주 인박스가 아닙니다. Grok Bot은 컴퓨터에 코딩 에이전트를 깔고 일을 넘길 수 있습니다(아래 Shepherd / Herdr).

### Cursor

에디터. Cursor 요금제 여러 개에 Grok Bot이 들어 있습니다. 데스크톱 온보딩: https://cursor.com/bot/onboarding. 요금제: https://cursor.com/help/grok-bot/plans. Cursor Agent(IDE)와 Grok Bot 동료를 섞지 마세요.

![스택 — Bot vs Build vs Cursor](assets/stack.png)

---

## 3. 첫 한 시간

1. 권한을 확인합니다. SuperGrok와 Cursor 요금제 여러 개에 Grok Bot이 있습니다. 앱이 안 열리면 요금제부터.
2. 데스크톱(macOS, Windows, Linux) 또는 iOS. 같은 스레드를 양쪽에서 잇습니다. 일은 클라우드 컴퓨터에서 돌아가서 노트북을 닫아도 봇은 멈추지 않습니다.
3. **빈 봇 하나**만 만듭니다. 이름을 붙입니다. 첫날 팀을 만들지 마세요.
4. 공개 `x.ai/bot/…` 링크면 **Add to Grok**. 설정 문구만 있으면 Bot actions → Edit Profile에 붙입니다.
5. 첫 일은 초안만. 보내기, 결제, 삭제는 끕니다.
6. 플러그인이 로그인 벽에 닿으면 사람이 칩니다. 비밀번호, SSO, 2FA, 패스키, 매직 링크, CAPTCHA는 사람만.

짧은 튜토리얼: [쓰는 법](https://getgrokbot.com/ko/how-to). 봇 컴퓨터에 코딩 에이전트: [설치](https://getgrokbot.com/ko/install).

![첫 빈 봇](assets/first-empty-bot.png)

---

## 4. 봇의 구조

- **프로필** — 이름, 직함, 맡는 일, 잘한 기준, 묻지 않고 하지 말 것, 첫 작업.
- **스킬 = how.** 한 번 한 뒤에 저장. 안 돌려 본 스킬을 스케줄하지 마세요.
- **루틴 = when.** 봇당 50개. Duplicate Bot은 프로필·스킬·루틴·아바타를 복사합니다. 학습된 기억과 대화는 복사하지 않습니다.
- **기억은 원본이 아닙니다.** 변하는 사실은 소스 시스템에 둡니다.
- **계정 안 모든 봇이 컴퓨터와 로그인을 공유합니다.** 덜컥 켠 루틴은 이미 연 세션을 물려받습니다.

설명은 상주 규칙입니다. 채팅은 이번 일입니다. 「승인 없이 보내지 마」는 설명에 넣습니다.

계정은 봇과 그룹 채팅을 합쳐 50개입니다. 흘려보는 열 개보다 믿는 두 개가 낫습니다.

---

## 5. 템플릿: 다시 만들지 말고 설치

Grok Bot은 공개 링크를 나눌 수 있습니다. 링크가 있는 사람은 x.ai에서 미리 보고 **Add to Grok Bot**을 고릅니다. 추가하면 그 계정에 사본이 생깁니다. 컴퓨터, 로그인, 대화는 넘어가지 않습니다.

넘어가는 것: 정체성, 설명, 스킬, 루틴. 링크는 공개입니다. 공유 전에 키와 내부 URL을 빼세요.

getgrokbot은 `https://x.ai/bot/…` 주소를 **발급하지 않습니다.** Grok Bot 앱의 Share as template에서 나옵니다. 목록에 그 URL이 있기 전에는 이 사이트는 Copy로 Edit Profile에 붙입니다.

제3자 봇은 미검증입니다. SpaceXAI가 보증하지 않습니다. 미리보기를 읽고, 필요한 최소 계정만 연결하고, 되돌릴 수 있는 작업 한 번 한 뒤에 루틴을 켜세요. 받은 사람은 작성자 허락 없이 다시 나눠서는 안 됩니다.

- 봇 공유: https://docs.x.ai/grok-bot/bots
- 제3자 약관: https://x.ai/legal/bot-sharing-terms
- X에서 공유된 목록: https://getgrokbot.com/ko/templates

![공개 미리보기의 Add to Grok](assets/add-to-grok.png)

---

## 6. X에서 바이럴 된 템플릿 (크레딧은 올린 사람)

다른 사람 설정을 붙여 넣지 마세요. 원문 포스트와 공식 미리보기만 겁니다. 아래는 X에서 연 템플릿입니다. 공유 포스트와 `x.ai/bot` 링크. 전체 목록은 [템플릿](https://getgrokbot.com/ko/templates).

### 크레딧 / 카드

**Rewardsmaxxing** — [@ishuagra02](https://x.com/ishuagra02/status/2093910521435103509) (2026-08-30). 카드별 리워드를 알고 결제 때 제일 이득인 카드를 고릅니다. [Add](https://x.ai/bot/upsD2c_qFmh6n4biksRvi).

Trevin([@trevin](https://x.com/trevin/status/2093390512925610067), 런칭 당일)도 같은 스레드에서 Credit Card Max를 가리켰습니다. illo, Spotify DJ와 함께. 카드 쪽 레퍼런스는 그 포스트, 설치는 Rewardsmaxxing을 쓰면 됩니다.

### 봇 만들기 / 리서치 / 코딩

**Dr Eggbot** — [@poteto](https://x.com/poteto/status/2093392701005946931) (SpaceXAI Grok Bot). 쓸 만한 봇을 만듭니다. 코딩 봇은 pstack. [Add](https://x.ai/bot/93gOz3op1UQdBdbekQFLK).

**Researchy** — [@farzyness](https://x.com/farzyness/status/2094148803494391903). Grok Build CLI만, 최고 thinking. [Add](https://x.ai/bot/rQt4W2zO2Gx9lfcBjd1lj).

**Shepherd** — [@herdrdev](https://x.com/herdrdev/status/2094129284885467399). 봇 컴퓨터의 Codex / Claude Code / Grok Build를 관리해서, Grok Bot 한도는 조정에만 쓰이게 합니다. Aaron 설명: https://x.com/theaaron/status/2093862565407494375. [Add](https://x.ai/bot/i5YF8f-zdcR76uKPrqg3J).

**Loops** — Matt Palmer의 아우터 루프. [Avid의 여섯 개](https://x.com/Av1dlive/status/2093747886324645924)에서 공유. [Add](https://x.ai/bot/Ub3T7usX-c6yRQibQq83P).

**Master** — Farzad의 오케스트레이터. 같은 Avid 스레드. [Add](https://x.ai/bot/j7B5LHnEIPTuPQZxxQwpx).

### 운영 / 크리에이티브

Avid의 **Chief of Staff**, **Growth Desk**, Robert의 **Forge**, Amina의 **Grok Bot Coach** — 모두 그 [여섯 개 포스트](https://x.com/Av1dlive/status/2093747886324645924).

**illo**, **Spotify DJ** — [@trevin](https://x.com/trevin/status/2093390512925610067), 런칭 당일.

**inbot** — [@kv1nsiii](https://x.com/kv1nsiii/status/2094036259253424290). 실제로 처리하는 받은편지함.

공식 템플릿 런칭(xAI): https://x.com/bot/status/2093376523919323618

---

## 7. 이 디렉터리는 어디에 쓰나

모든 전문 봇을 직접 공개할 필요는 없습니다. 이미 있는 일은 X 템플릿. **붙여 넣는 프로필**(하지 말 것 포함)이나 Hermes / OpenClaw **Portato** 이전이 필요할 때 이 목록을 씁니다.

getgrokbot 예시(share URL이 있기 전에는 Copy):

- [Portato · Hermes](https://getgrokbot.com/ko/bots/porter-hermes) — Hermes 프로필을 Chief 하나로. 키는 남깁니다.
- [Portato · OpenClaw](https://getgrokbot.com/ko/bots/porter-openclaw) — OpenClaw도 같습니다.
- [수신함 치프](https://getgrokbot.com/ko/bots/inbox-chief) — 메일·슬랙·일정의 정문. 결정만.
- [Floor Nexus](https://getgrokbot.com/ko/bots/floor-nexus) — 일을 하지 않고 전문가를 고릅니다.
- [리서치 스카우트](https://getgrokbot.com/ko/bots/research-scout) — 매주 메모 한 장, 출처 첨부.
- [에이전트 설치](https://getgrokbot.com/ko/install) — 봇 컴퓨터에 Claude Code, Codex, OpenClaw, Hermes.

새 조직도를 그리지 않고 가능한 구성:

1. Dr Eggbot을 Add → Chief 하나를 설계해 달라고 함 → 이 디렉터리의 수신함 치프 프로필을 붙임.
2. Shepherd를 Add → 컴퓨터에 Codex 또는 Grok Build → Grok Bot은 조정만.
3. Rewardsmaxxing을 Add → 프로필에 카드 번호를 넣지 않음 → 결제는 사람.
4. Portato: Hermes나 OpenClaw에 한 줄, 골드 태스크 3–5, 컷오버.

![Portato 목록](assets/portato-listing.png)

---

## 8. Portato (Hermes / OpenClaw)

Portato는 이 사이트의 이전 봇입니다. 이름은 모든 언어에서 **Portato**입니다. @poteto가 아니고 xAI 봇도 아닙니다.

Grok Bot에는 공식 Hermes·OpenClaw 가져오기와 공개 생성 API가 없습니다. 패킷이 길입니다. 첫 봇은 Chief 하나.

1. 목록에서 Portato를 깝니다(Copy, share URL이 있으면 Add).
2. [migrate/hermes](https://getgrokbot.com/ko/migrate/hermes) 또는 [migrate/openclaw](https://getgrokbot.com/ko/migrate/openclaw)의 한 줄을 쓰던 에이전트에 붙입니다.
3. 인벤토리가 먼저. 그다음 골드 태스크 3–5개(이름, 입력, 기대 출력).
4. 순서: 프로필 → 사실 파일 → 스킬(how) → 루틴(when).
5. 사람이 할 일은 로그인 벽. 키, `.env`, 세션은 남깁니다.
6. 골드 태스크가 Grok에서 통과하고 소스 스케줄이 꺼진 뒤에만 컷오버.

Portato 공유 링크: Grok Bot 앱에서 봇을 만들고 Share as template 한 뒤 `https://x.ai/bot/…`를 `data/share-urls.ts`에 넣습니다. getgrokbot은 그 주소를 발급하지 않습니다.

---

## 9. X와 Threads

**설치**를 올리세요. 비밀이 아닙니다. 배포 단위: X 원문 + `x.ai/bot` 미리보기.

할 것:

- 일 하나를 한 줄로.
- x.ai 링크, 누가 공유했는지.
- 골드 태스크 / 보내지 말 것. 키 없음.
- 미리보기 스크린샷. `.env` 아님.

하지 말 것:

- 다른 사람 공유 설정을 붙여 넣기(허락 없는 재배포).
- xAI 보증을 주장하기.
- 고객 이름이나 카드 번호 스크린샷.

---

## 10. 출처

이 초안을 위해 연 것:

- https://docs.x.ai/grok-bot/bots
- https://docs.x.ai/grok-bot/faq
- https://docs.x.ai/grok-bot/get-started
- https://docs.x.ai/grok-bot/skills-routines-and-automations
- https://x.ai/legal/bot-sharing-terms
- https://x.ai/news/introducing-grok-bot
- https://x.com/bot/status/2093376523919323618
- https://x.com/poteto/status/2093392701005946931
- https://x.com/Av1dlive/status/2093747886324645924
- https://x.com/ishuagra02/status/2093910521435103509
- https://x.com/farzyness/status/2094148803494391903
- https://x.com/herdrdev/status/2094129284885467399
- https://x.com/trevin/status/2093390512925610067
- https://x.com/theaaron/status/2093862565407494375

이 디렉터리, Portato, 이전 스킬은 비공식입니다. MIT.
