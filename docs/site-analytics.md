# Site search and analytics

Canonical host: `https://getgrokbot.com`. Sitemap: `/sitemap.xml`. Machine index: `/llms.txt`.

## Vercel Web Analytics

Root layout renders `@vercel/analytics/next` and, in production, the `/_vercel/insights/script.js` beacon. That is how pageviews leave the site. Enable Web Analytics on the Vercel project. Do not invent a dashboard number, return rate, or follower count on the site. This repo does not ship `@vercel/speed-insights`.

Do not set both `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA_MEASUREMENT_ID`. GTM wins and would double-count if gtag also loads.

## Events

Primary funnel: land → search/filter → open listing → Copy.

| Event | When | Params |
| --- | --- | --- |
| `search` | Directory query idle 800ms | `search_term_len_bucket`, `result_count_bucket`, `category`, `has_integration_filter`, `kind_filter` |
| `agb_copy` | Copy on listing / team / member / migrate starter | `copy_kind`, `has_bot_id` |
| `share` | Listing share | `method` (`web_share` \| `clipboard`), `content_type=listing` |

No raw query text. Vercel Web Analytics `page_view` is automatic. GA4 `page_view` is also automatic when a GA/GTM ID is set — do not re-fire.

## GA4 admin (once IDs are live)

Register custom dimensions: `copy_kind`, `search_term_len_bucket`, `result_count_bucket`, `kind_filter`, `category`. Mark `agb_copy` as a key event.

Funnel Exploration: page view → `search` → `agb_copy`.

## IndexNow

Key file: `https://getgrokbot.com/00f0e543c1dabc92ecf9305de5cfcee5.txt`  
Alias: `https://getgrokbot.com/indexnow.txt`  
Submit: `POST /api/indexnow` or authorized `GET /api/indexnow`. If `CRON_SECRET` or `INDEXNOW_SUBMIT_SECRET` is set, send `Authorization: Bearer <secret>`. Vercel cron (Pro) hits GET daily.
