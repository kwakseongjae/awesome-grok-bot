# Design — Grok Bot

Locked design system. Future pages defer to this file. Amend it
intentionally; do not improvise colours or type in components.

## System

- Genre · modern-minimal (Linear / Stripe / Grok school)
- Macrostructure · Index (directory workbench: hairline table + air)
- Theme · custom · vibe: "white, black, one hairline, lots of air"
- Axes · light / geometric-sans / neutral
- Tone · austere, technical, Korean-first. Roman headings only.

This is **not** a Hallmark catalog theme (Specimen, Newsprint, etc.).
The owner named the brand: Grok-like white + black monotone. True
chroma-0 paper/ink is the product, not a tinted cream or AI purple.

## Tokens (canonical · `app/globals.css`)

```css
:root {
  --color-paper:      oklch(1 0 0);           /* #ffffff */
  --color-paper-2:    oklch(0.98 0 0);
  --color-ink:        oklch(0.145 0 0);       /* ~#0a0a0a */
  --color-ink-2:      oklch(0.44 0 0);        /* muted text, ≥4.5:1 */
  --color-rule:       oklch(0.9 0 0);
  --color-accent:     oklch(0.145 0 0);       /* primary = ink */
  --color-accent-ink: oklch(1 0 0);
  --color-focus:      oklch(0.145 0 0);

  --font-display: var(--font-noto), ui-sans-serif, system-ui, sans-serif;
  --font-body:    var(--font-noto), ui-sans-serif, system-ui, sans-serif;
  --font-mono:    var(--font-geist-mono), ui-monospace, monospace;

  --radius-card:  0.5rem;
  --radius-input: 0.5rem;
  --radius-pill:  0.375rem;

  --dur-fast: 120ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
}

.dark {
  --color-paper:      oklch(0 0 0);
  --color-paper-2:    oklch(0.16 0 0);
  --color-ink:        oklch(0.985 0 0);
  --color-ink-2:      oklch(0.72 0 0);
  --color-rule:       oklch(1 0 0 / 12%);
  --color-accent:     oklch(0.985 0 0);
  --color-accent-ink: oklch(0 0 0);
  --color-focus:      oklch(0.985 0 0);
}
```

shadcn semantic tokens (`--background`, `--primary`, `--border`, …)
map 1:1 onto the block above in `app/globals.css`. Do not set
component hex outside that file.

**Exceptions (named, not improvised):** official product marks keep
trademark fills (`--mark-*`). OAuth buttons use `--brand-google-*` and
`--brand-github-*` so Google/GitHub identity is not flattened into ink.
Listing avatars use the Grok Bot customizer palette in
`lib/grok-bot-blob.ts`. The huddle mascot is the raster at
`/brand/mascot/awesome.png`.

## Type

- UI + headings: Noto Sans KR / JP / SC / TC (script fallbacks). Headings = same sans,
  weight 600, tracking tight, never italic, never serif display.
- Counts, slugs, eyebrows, overflow `+n`: Geist Mono.
- Body 16px / 1.5. Directory table 14px.

## CTA voice

- Primary · ink fill, paper type, radius 0.5rem, no glow.
- Secondary · hairline outline, paper fill.
- Detail action labels are English **Copy** / **Copy all**
  (this listing vs the whole team). Home listings show install
  count as text only — no copy button on the index.
  After copy: Copied.

## Motion stance

- Motion-cut. No bounce, no gradient wash, no glow, no scroll-reveal.
- Hover: opacity / background only, ≤150ms.
- Reduced-motion: disable animation and non-essential transition.
- Home hero: listings start on a circle and orbit slowly. No orbit
  guide rings. Teammate faces are smaller than the mascot. Reduced-motion:
  static circle. No bounce, no glow, no fan-in. Decorative, not a second nav.
- Header mark: directory mascot raster (white Grok Bot face, black
  eyes, purple wizard hat). Slow optional. Reduced-motion: static.
  Site language is a five-way menu (한국어, English, 日本語, 简体中文,
  繁體中文), not a two-way toggle. Directory listings follow that menu;
  there is no separate language filter on the index.
- Directory mascot (home huddle center): same raster, white sphere on the
  huddle origin, hat overflowing up. Name: 어썸 / Awesome. Light mode: a hairline
  drop-shadow on the sphere so the white body reads on paper. Not a glow.
  Dark mode: no extra shadow.
- Listing faces: Grok Bot avatar skins (shape + colour + expression)
  with a blink/float on SVG. Huddle faces also wander gaze like the
  Grok Bot customizer play state. Reduced-motion: static.
- Grok Bot product mark (migrate lockup): official Grok Bot face
  (white sphere, black pill eyes) at `/brand/grok-bot-official.png`.
  Slow idle. Reduced-motion: static.

## Component voice

- No emoji-as-icons. Lucide or official SVG marks only.
- Clickables: `cursor-pointer`, visible `:focus-visible` ring.
- Chips wrap, or collapse with `+n`. Plugin chips = official mark +
  short label, never a raw English tag dump.
- Category badges are monotone outlines, not rainbow.
- Kind (봇 / 팀) lives on the name row as a compact badge.
- No fake metrics, testimonials, or browser chrome.

## Vocabulary (user-facing)

A **listing** is a specialist or a team you put into Grok Bot.
**Copy** puts setup text on the clipboard so it can be pasted into
Grok Bot. A **team** has a chief plus specialists.

| UI | Korean | English |
| --- | --- | --- |
| Listing copy | Copy (도움말: 이 목록) | Copy |
| Team copy | Copy all (도움말: 팀 전체) | Copy all |
| Payload | 설정 문구 | Setup text |
| Plugins | 플러그인 | Plugins |
| Category `success` | 고객지원 | Support |
| Migrate | 이전 | Migrate |
| Handoff stepper | 인수인계 | Handoff |
| Share | 공유 | Share |

Do not show 헌장 / charter or 성공 / Success in the UI. Code and
data may still use `charter` / `success` as keys.

## Anti-patterns (Hallmark + UI UX Pro Max)

- No warm beige, orange `#c45c26`, cream oklch, or AI purple/pink on UI chrome.
  Listing avatars may use the Grok Bot customizer palette (including violet).
- No Inter / Roboto / Poppins / system-ui as a display face.
- No italic headings, bounce, glassmorphism, or gradient CTA.
- Contrast: body text ≥ 4.5:1. Keyboard focus always visible.
