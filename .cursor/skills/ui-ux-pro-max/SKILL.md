---
name: ui-ux-pro-max
description: UI/UX Pro Max constraints for this Grok Bot directory. Follow design.md; do not apply catalog purple palettes.
---

# UI UX Pro Max (pointer)

Product: AI / chatbot directory / developer catalog (SaaS, Korean-first).
Style: Minimalism / monochrome / high contrast.
Stack: Next.js App Router + shadcn/ui + Tailwind v4.

The CLI catalog suggested AI purple. **Ignore that.** Brand colours are
locked in [`design.md`](../../../design.md) and `app/globals.css`.

## Must keep

- No emoji-as-icons (Lucide or official SVG only)
- `cursor-pointer` on clickable controls
- Text contrast ≥ 4.5:1
- Visible `:focus-visible`
- `prefers-reduced-motion`
- Chips wrap or collapse with `+n`
- Official brand marks, not text-only tags

CSV dumps from `ui-ux-pro-max-cli` are not committed. Re-run
`npx ui-ux-pro-max-cli init --ai cursor` locally if you need the search
scripts; do not overwrite `design.md`.

Upstream: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
