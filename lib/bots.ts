import seedFile from "@/data/seed-bots.json";
import { expandCatalog } from "@/lib/catalog";
import { ensureListingSlug } from "@/lib/charter";
import {
  getPool,
  isUndefinedTableError,
  query,
  toIsoString,
  withTransaction,
} from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/env";
import { CONTRIBUTOR_HANDLE } from "@/lib/site";
import { localeCollator } from "@/lib/locales";
import type {
  BotDraftInput,
  BotFilters,
  BotKind,
  BotListing,
  Category,
  ListingLocale,
  TeamMember,
} from "@/lib/types";

type SeedFile = { bots: BotListing[] };

const seedBots = dedupeSlugLocale([
  ...(seedFile as SeedFile).bots,
  ...expandCatalog(),
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function dedupeSlugLocale(bots: BotListing[]) {
  const seen = new Set<string>();
  const out: BotListing[] = [];
  for (const bot of bots) {
    const key = `${bot.slug}:${bot.locale}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(bot);
  }
  return out;
}

type BotRow = {
  id: string;
  slug: string;
  name: string;
  kind: BotKind;
  category: Category;
  locale: ListingLocale;
  summary: string;
  prompt: string;
  integrations: string[] | null;
  source_url: string | null;
  contributor_handle: string | null;
  status: "draft" | "published";
  created_by: string | null;
  added_at: Date | string;
  copy_count: number | null;
};

function matchesFilters(bot: BotListing, filters: BotFilters = {}) {
  if (bot.status !== "published") return false;
  const queryText = filters.query?.trim().toLowerCase();
  if (queryText) {
    const haystack = [
      bot.name,
      bot.summary,
      bot.prompt,
      bot.contributor_handle,
      ...bot.integrations,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(queryText)) return false;
  }
  if (filters.category && filters.category !== "all" && bot.category !== filters.category) {
    return false;
  }
  if (
    filters.integration &&
    filters.integration !== "all" &&
    !bot.integrations.includes(filters.integration)
  ) {
    return false;
  }
  if (filters.locale && filters.locale !== "all" && bot.locale !== filters.locale) {
    return false;
  }
  if (filters.kind && filters.kind !== "all" && bot.kind !== filters.kind) {
    return false;
  }
  return true;
}

function mapRow(row: BotRow, members: TeamMember[] = []): BotListing {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    kind: row.kind,
    category: row.category,
    locale: row.locale,
    summary: row.summary,
    prompt: row.prompt,
    integrations: row.integrations ?? [],
    source_url: row.source_url,
    contributor_handle: row.contributor_handle ?? CONTRIBUTOR_HANDLE,
    status: row.status,
    created_by: row.created_by,
    added_at: toIsoString(row.added_at),
    copy_count: Number(row.copy_count ?? 0),
    team_members: members,
  };
}

async function attachMembers(rows: BotRow[]): Promise<BotListing[]> {
  if (rows.length === 0) return [];
  try {
    const result = await query<{
      team_bot_id: string;
      name: string;
      role: string;
      charter: string;
    }>(
      `select team_bot_id, name, role, charter
       from public.team_members
       where team_bot_id = any($1::uuid[])
       order by sort_order asc`,
      [rows.map((row) => row.id)],
    );
    if (!result) {
      return rows.map((row) => mapRow(row));
    }

    const byTeam = new Map<string, TeamMember[]>();
    for (const member of result.rows) {
      const list = byTeam.get(member.team_bot_id) ?? [];
      list.push({
        name: member.name,
        role: member.role,
        charter: member.charter,
      });
      byTeam.set(member.team_bot_id, list);
    }

    return rows.map((row) => mapRow(row, byTeam.get(row.id) ?? []));
  } catch (error) {
    if (isUndefinedTableError(error)) {
      return rows.map((row) => mapRow(row));
    }
    throw error;
  }
}

export function listSeedBots(filters: BotFilters = {}) {
  const wanted = filters.locale && filters.locale !== "all" ? filters.locale : null;
  const published = seedBots.filter((bot) => bot.status === "published");
  const unique = wanted
    ? pickLocaleRows(published, wanted)
    : published;

  return unique
    .filter((bot) => matchesFilters(bot, { ...filters, locale: "all" }))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, localeCollator(wanted ?? "ko")));
}

function pickLocaleRows(bots: BotListing[], wanted: ListingLocale) {
  const rank = (locale: string) => {
    if (locale === wanted) return 0;
    if (locale === "en") return 1;
    if (locale === "ko") return 2;
    return 3;
  };
  const bySlug = new Map<string, BotListing>();
  for (const bot of bots) {
    const existing = bySlug.get(bot.slug);
    if (!existing || rank(bot.locale) < rank(existing.locale)) {
      bySlug.set(bot.slug, bot);
    }
  }
  return [...bySlug.values()];
}

export function getSeedBot(slug: string, locale: ListingLocale) {
  const order: ListingLocale[] = [locale, "en", "ko"];
  for (const item of order) {
    const hit = seedBots.find((bot) => bot.slug === slug && bot.locale === item);
    if (hit) return hit;
  }
  return seedBots.find((bot) => bot.slug === slug) ?? null;
}

export function listSeedIntegrations() {
  return [...new Set(seedBots.flatMap((bot) => bot.integrations))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export async function listPublishedBots(filters: BotFilters = {}): Promise<BotListing[]> {
  if (!isDatabaseConfigured()) {
    return listSeedBots(filters);
  }

  const values: unknown[] = ["published"];
  let sql = `select * from public.bots where status = $1`;
  let index = 2;
  if (filters.category && filters.category !== "all") {
    sql += ` and category = $${index}`;
    values.push(filters.category);
    index += 1;
  }
  if (filters.locale && filters.locale !== "all") {
    sql += ` and locale = $${index}`;
    values.push(filters.locale);
    index += 1;
  }
  if (filters.kind && filters.kind !== "all") {
    sql += ` and kind = $${index}`;
    values.push(filters.kind);
    index += 1;
  }
  if (filters.integration && filters.integration !== "all") {
    sql += ` and integrations @> array[$${index}]::text[]`;
    values.push(filters.integration);
    index += 1;
  }
  sql += ` order by name asc`;

  try {
    const result = await query<BotRow>(sql, values);
    if (!result) return listSeedBots(filters);

    const listings = await attachMembers(result.rows);
    const filtered = listings.filter((bot) => matchesFilters(bot, { query: filters.query }));
    const locale = filters.locale;
    if (
      filtered.length === 0 &&
      locale &&
      locale !== "all" &&
      locale !== "ko" &&
      locale !== "en"
    ) {
      return listSeedBots(filters);
    }
    return mergeSeedGaps(filtered, filters);
  } catch (error) {
    if (isUndefinedTableError(error)) return listSeedBots(filters);
    return listSeedBots(filters);
  }
}

function mergeSeedGaps(dbListings: BotListing[], filters: BotFilters) {
  const seed = listSeedBots(filters);
  const slugs = new Set(dbListings.map((bot) => bot.slug));
  const extras = seed.filter((bot) => !slugs.has(bot.slug));
  if (extras.length === 0) return dbListings;
  const locale = filters.locale && filters.locale !== "all" ? filters.locale : "ko";
  return [...dbListings, ...extras].sort((a, b) =>
    a.name.localeCompare(b.name, localeCollator(locale)),
  );
}

export async function getPublishedBot(slug: string, locale: ListingLocale) {
  if (!isDatabaseConfigured()) {
    return getSeedBot(slug, locale);
  }

  try {
    const result = await query<BotRow>(
      `select *
       from public.bots
       where slug = $1
         and status = 'published'
       order by
         case
           when locale = $2 then 0
           when locale = 'en' then 1
           when locale = 'ko' then 2
           else 3
         end,
         added_at asc
       limit 1`,
      [slug, locale],
    );
    const row = result?.rows[0];
    if (!row) return getSeedBot(slug, locale);
    const [listing] = await attachMembers([row]);
    return listing ?? null;
  } catch (error) {
    if (isUndefinedTableError(error)) return getSeedBot(slug, locale);
    return getSeedBot(slug, locale);
  }
}

export async function listRelatedBots(bot: BotListing, limit = 4) {
  const all = await listPublishedBots({
    category: bot.category,
    locale: bot.locale,
  });
  return all.filter((item) => item.slug !== bot.slug).slice(0, limit);
}

export async function listIntegrations() {
  if (!isDatabaseConfigured()) {
    return listSeedIntegrations();
  }
  const bots = await listPublishedBots({ locale: "all" });
  return [...new Set(bots.flatMap((bot) => bot.integrations))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export async function incrementCopyCount(botId: string) {
  const db = getPool();
  if (!db || !UUID_RE.test(botId)) return;
  try {
    await withTransaction(async (client) => {
      await client.query(
        `insert into public.copy_events (bot_id, copied_by) values ($1, null)`,
        [botId],
      );
      await client.query(
        `update public.bots set copy_count = copy_count + 1 where id = $1`,
        [botId],
      );
    });
  } catch {
    return;
  }
}

export async function createBotListing(
  input: BotDraftInput,
  user?: {
    id: string;
    handle: string;
  },
) {
  const created = await withTransaction(async (client) => {
    const inserted = await client.query<BotRow>(
      `insert into public.bots (
         slug, name, kind, category, locale, summary, prompt, integrations,
         source_url, contributor_handle, status, created_by
       ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       returning *`,
      [
        ensureListingSlug(input.name, input.slug),
        input.name,
        input.kind,
        input.category,
        input.locale,
        input.summary,
        input.prompt,
        input.integrations,
        input.source_url || null,
        CONTRIBUTOR_HANDLE,
        input.status,
        user?.id ?? null,
      ],
    );
    const data = inserted.rows[0];
    if (!data) {
      throw new Error("INSERT_FAILED");
    }

    if (input.kind === "team" && input.team_members.length > 0) {
      const members = input.team_members.filter(
        (member) => member.name.trim() && member.role.trim(),
      );
      for (const [index, member] of members.entries()) {
        await client.query(
          `insert into public.team_members (team_bot_id, name, role, charter, sort_order)
           values ($1, $2, $3, $4, $5)`,
          [
            data.id,
            member.name.trim(),
            member.role.trim(),
            member.charter.trim(),
            index,
          ],
        );
      }
    }

    return data;
  });

  if (!created) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const [listing] = await attachMembers([created]);
  return listing;
}

export async function ensureProfile(user: {
  id: string;
  name?: string | null;
  email?: string | null;
}) {
  const fallbackHandle = user.email?.split("@")[0] || "user";
  const db = getPool();
  if (!db) return { handle: fallbackHandle };

  try {
    const existing = await db.query<{ handle: string }>(
      `select handle from public.profiles where id = $1`,
      [user.id],
    );
    if (existing.rows[0]) {
      return { handle: existing.rows[0].handle };
    }

    const handle =
      user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") ||
      `user-${user.id.slice(0, 6)}`;

    await db.query(
      `insert into public.profiles (id, handle, display_name, locale)
       values ($1, $2, $3, 'en')
       on conflict (id) do update set display_name = excluded.display_name`,
      [user.id, handle, user.name || handle],
    );

    return { handle };
  } catch (error) {
    if (isUndefinedTableError(error)) return { handle: fallbackHandle };
    throw error;
  }
}
