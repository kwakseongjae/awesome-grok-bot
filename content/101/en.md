---
title: Grok Bot 101
lang: en
version: 0.2.0
updated: 2026-08-31
---

# Grok Bot 101

A field bible for Grok Bot, Grok Build, and Cursor. This file is the **English source**. Edit it, paste it into Google Docs, export PDF, or drop screenshots into `content/101/assets/`. The Korean source is `ko.md` — keep the two in sync by chapter, not by translating in place.

Drop images next to this file as `assets/your-shot.png` and reference them as `![caption](assets/your-shot.png)`. Missing files render as a labelled slot so you can fill them later.

---

## 1. What this is

Grok Bot is a persistent teammate: a name, a job, a conversation, and a cloud computer. It is closer to hiring someone than opening a chat box.

[getgrokbot.com](https://getgrokbot.com) is a sponsor-free directory. It is not an xAI product. Official product: [x.ai/bot](https://x.ai/bot). Docs: [docs.x.ai/grok-bot](https://docs.x.ai/grok-bot).

You do **not** need to rebuild every Bot from a blank profile. Public templates on X install in one click. That is the point of this page.

---

## 2. The Grok stack

Three surfaces share the same frontier model family. They are not the same product.

### Grok Bot

Always-on teammate. Own computer, plugins, skills (how), routines (when), group chats. Templates and Portato target this surface.

- Product: https://x.ai/bot
- Get started: https://docs.x.ai/grok-bot/get-started
- Create and share Bots: https://docs.x.ai/grok-bot/bots
- Skills and routines: https://docs.x.ai/grok-bot/skills-routines-and-automations
- Computer and apps: https://docs.x.ai/grok-bot/computer-and-apps

### Grok Build

xAI’s build surface for shipping software with Grok. Use it when the job is a repo, a diff, or a product slice — not a standing inbox. A Grok Bot can install coding agents on its computer and hand work to them (see Shepherd / Herdr below).

### Cursor

The editor. Several Cursor plans include Grok Bot. Desktop onboarding: https://cursor.com/bot/onboarding. Plans: https://cursor.com/help/grok-bot/plans. Do not confuse Cursor Agent (IDE) with a Grok Bot teammate.

![Stack — Bot vs Build vs Cursor](assets/stack.png)

---

## 3. First hour

1. Check access. SuperGrok and several Cursor plans include Grok Bot. If the app will not open, start with the plan.
2. Install desktop (macOS, Windows, Linux) or iOS. The same thread continues on both. Work runs on a cloud computer, so closing the laptop does not stop the Bot.
3. Create **one** empty Bot. Name it. Do not spawn a team on day one.
4. Prefer **Add to Grok** from a public `x.ai/bot/…` link. If you only have setup text, paste it into Bot actions → Edit Profile.
5. First task is drafts only. Send, pay, delete stay off.
6. When a plugin hits a login wall, you type. Passwords, SSO, 2FA, passkeys, magic links, CAPTCHAs stay human.

Short tutorial on this site: [How to](https://getgrokbot.com/en/how-to). Coding agents on the Bot’s computer: [Install](https://getgrokbot.com/en/install).

![First empty Bot](assets/first-empty-bot.png)

---

## 4. Anatomy of a Bot

- **Profile** — name, title, what it owns, what good looks like, what it must never do without asking, first task.
- **Skill = how.** Do the task once, then save. Do not schedule a skill you have not run.
- **Routine = when.** Cap 50 per Bot. Duplicate Bot copies profile, skills, routines, avatar — not learned memory or chat history.
- **Memory is not the source of truth.** Changing facts stay in the source system.
- **Every Bot on an account shares one computer and its logins.** A reckless routine inherits every session you already opened.

Description is the standing rule. The chat is the task. “Never send without approval” belongs in the description.

An account holds up to 50 Bots and group chats combined. Ten Bots you skim is worse than two you trust.

---

## 5. Templates: add, don’t rebuild

Grok Bot can share a public link. Anyone with the link opens a preview on x.ai and chooses **Add to Grok Bot**. Adding creates a copy on their account. It does not give them your computer, logins, or conversation history.

What travels: identity, description, skills, routines. The link is public — strip keys and internal URLs before you share.

getgrokbot **cannot mint** `https://x.ai/bot/…` URLs. Those come from Share as template inside the Grok Bot app. Until a listing has that URL, this site uses Copy into Edit Profile.

Third-party Bots are unverified. SpaceXAI does not endorse them. Read the preview, connect the smallest useful accounts, run one reversible task, then enable routines. Recipients may not redistribute a shared Bot without the creator’s permission.

- Share a Bot: https://docs.x.ai/grok-bot/bots
- Third-party terms: https://x.ai/legal/bot-sharing-terms
- Directory of live X shares: https://getgrokbot.com/en/templates

![Add to Grok on a public preview](assets/add-to-grok.png)

---

## 6. Viral templates from X (credit stays with the poster)

Do not paste someone else’s configuration. Link the original post and the official preview. Below: templates we opened on X, with the share post and the `x.ai/bot` link. Full list lives on [Templates](https://getgrokbot.com/en/templates).

### Credit / cards

**Rewardsmaxxing** — shared by [@ishuagra02](https://x.com/ishuagra02/status/2093910521435103509) (2026-08-30). Knows each card’s rewards and picks the best one at purchase. [Add](https://x.ai/bot/upsD2c_qFmh6n4biksRvi).

Trevin ([@trevin](https://x.com/trevin/status/2093390512925610067), launch day) also pointed at a Credit Card Max bot in the same thread as illo and a Spotify DJ. Use his post as the credit-side reference even when you install Rewardsmaxxing.

### Make Bots / research / coding

**Dr Eggbot** — [@poteto](https://x.com/poteto/status/2093392701005946931) (Grok Bot at SpaceXAI). Makes high-quality Bots; coding Bots use pstack. [Add](https://x.ai/bot/93gOz3op1UQdBdbekQFLK).

**Researchy** — [@farzyness](https://x.com/farzyness/status/2094148803494391903). Grok Build CLI only, highest thinking. [Add](https://x.ai/bot/rQt4W2zO2Gx9lfcBjd1lj).

**Shepherd** — [@herdrdev](https://x.com/herdrdev/status/2094129284885467399). Herds Codex / Claude Code / Grok Build on the Bot’s computer so Grok Bot rate limits stay on coordination. Pair with Aaron’s walkthrough: https://x.com/theaaron/status/2093862565407494375. [Add](https://x.ai/bot/i5YF8f-zdcR76uKPrqg3J).

**Loops** — Matt Palmer’s outer loop, shared in [Avid’s six](https://x.com/Av1dlive/status/2093747886324645924). [Add](https://x.ai/bot/Ub3T7usX-c6yRQibQq83P).

**Master** — Farzad’s orchestrator, same Avid thread. [Add](https://x.ai/bot/j7B5LHnEIPTuPQZxxQwpx).

### Ops / creative

Avid’s own **Chief of Staff** and **Growth Desk**, Robert’s **Forge**, Amina’s **Grok Bot Coach** — all in that [six-template post](https://x.com/Av1dlive/status/2093747886324645924).

**illo** and **Spotify DJ** — [@trevin](https://x.com/trevin/status/2093390512925610067), launch day.

**inbot** — [@kv1nsiii](https://x.com/kv1nsiii/status/2094036259253424290). Inbox that actually processes.

Official template launch (xAI): https://x.com/bot/status/2093376523919323618

---

## 7. What this directory is for

You do not have to publish every specialist yourself. Use X templates for jobs that already exist. Use this catalog when you want a **paste-ready profile** with a never-do list, or a **Portato** handoff from Hermes / OpenClaw.

Examples on getgrokbot (Copy until a share URL exists):

- [Portato · Hermes](https://getgrokbot.com/en/bots/porter-hermes) — carry a Hermes profile into one Chief. Keys stay behind.
- [Portato · OpenClaw](https://getgrokbot.com/en/bots/porter-openclaw) — same for OpenClaw.
- [Inbox Chief](https://getgrokbot.com/en/bots/inbox-chief) — front door for mail, Slack, calendar. Decisions only.
- [Floor Nexus](https://getgrokbot.com/en/bots/floor-nexus) — does not do the work; picks a specialist.
- [Research Scout](https://getgrokbot.com/en/bots/research-scout) — one memo a week, sources attached.
- [Install agents](https://getgrokbot.com/en/install) — Claude Code, Codex, OpenClaw, Hermes on the Bot’s computer.

Possible setups without inventing a new org chart:

1. Add Dr Eggbot → ask it to design one Chief → Add Inbox Chief from this directory as the written profile.
2. Add Shepherd → install Codex or Grok Build on the computer → keep Grok Bot as the coordinator.
3. Add Rewardsmaxxing → do not paste card numbers into the profile → human still pays.
4. Portato: paste the one-liner into Hermes or OpenClaw, gold tasks 3–5, then cut over.

![Portato listing](assets/portato-listing.png)

---

## 8. Portato (Hermes / OpenClaw)

Portato is the migrate Bot on this site. The name is **Portato** in every language. It is not @poteto and not an xAI bot.

Grok Bot has no official Hermes or OpenClaw importer and no public create API. Packets are the path. First Bot is one Chief.

1. Install Portato from the listing (Copy, or Add once a share URL exists).
2. Paste the one-liner from [migrate/hermes](https://getgrokbot.com/en/migrate/hermes) or [migrate/openclaw](https://getgrokbot.com/en/migrate/openclaw) into the agent you already use.
3. Inventory first. Then 3–5 gold tasks (name, input, expected output).
4. Order: profile → facts file → skills (how) → routines (when).
5. You only handle login walls. Keys, `.env`, sessions stay behind.
6. Cut over only when gold tasks pass on Grok and source schedules are off.

Share links for Portato: create the Bot in the Grok Bot app, Share as template, paste `https://x.ai/bot/…` into `data/share-urls.ts`. getgrokbot does not mint that URL.

---

## 9. X and Threads

Post the **install**, not the secret. Unit of distribution: original X post + `x.ai/bot` preview.

Do:

- One job in one line.
- The x.ai link, plus who shared it.
- Gold tasks / never-send, no keys.
- Screenshot of the preview, not of `.env`.

Do not:

- Paste someone else’s shared configuration (redistribution without permission).
- Claim xAI endorsement.
- Screenshot customer names or card numbers.

---

## 10. Sources

Opened for this draft:

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

This directory, Portato, and the migrate skill are unofficial. MIT.
