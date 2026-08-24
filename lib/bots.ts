import seedFile from "@/data/seed-bots.json";
import { expandCatalog } from "@/lib/catalog";
import { ensureListingSlug } from "@/lib/charter";
import { createAdminClient, createAnonClient } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/env";
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
  added_at: string;
  copy_count: number | null;
  team_members?: { name: string; role: string; charter: string }[] | null;
};

function matchesFilters(bot: BotListing, filters: BotFilters = {}) {
  if (bot.status !== "published") return false;
  const query = filters.query?.trim().toLowerCase();
  if (query) {
    const haystack = [
      bot.name,
      bot.summary,
      bot.prompt,
      bot.contributor_handle,
      ...bot.integrations,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(query)) return false;
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
    added_at: row.added_at,
    copy_count: row.copy_count ?? 0,
    team_members: members,
  };
}

async function attachMembers(rows: BotRow[]): Promise<BotListing[]> {
  if (rows.length === 0) return [];
  const client = createAnonClient();
  if (!client) {
    return rows.map((row) => mapRow(row, row.team_members ?? []));
  }

  const ids = rows.map((row) => row.id);
  const { data, error } = await client
    .from("team_members")
    .select("team_bot_id, name, role, charter, sort_order")
    .in("team_bot_id", ids)
    .order("sort_order", { ascending: true });

  if (error) {
    return rows.map((row) => mapRow(row));
  }

  const byTeam = new Map<string, TeamMember[]>();
  for (const member of data ?? []) {
    const list = byTeam.get(member.team_bot_id) ?? [];
    list.push({
      name: member.name,
      role: member.role,
      charter: member.charter,
    });
    byTeam.set(member.team_bot_id, list);
  }

  return rows.map((row) => mapRow(row, byTeam.get(row.id) ?? []));
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
  if (!isSupabaseConfigured()) {
    return listSeedBots(filters);
  }

  const client = createAnonClient();
  if (!client) return listSeedBots(filters);

  let query = client.from("bots").select("*").eq("status", "published");

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters.locale && filters.locale !== "all") {
    query = query.eq("locale", filters.locale);
  }
  if (filters.kind && filters.kind !== "all") {
    query = query.eq("kind", filters.kind);
  }
  if (filters.integration && filters.integration !== "all") {
    query = query.contains("integrations", [filters.integration]);
  }

  const { data, error } = await query.order("name", { ascending: true });
  if (error || !data) {
    return listSeedBots(filters);
  }

  const listings = await attachMembers(data as BotRow[]);
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
  if (!isSupabaseConfigured()) {
    return getSeedBot(slug, locale);
  }

  const client = createAnonClient();
  if (!client) return getSeedBot(slug, locale);

  const preferred = await client
    .from("bots")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("status", "published")
    .maybeSingle();

  const fallbackLocales: ListingLocale[] = locale === "en" ? ["ko"] : ["en", "ko"];
  let row = preferred.data;
  if (!row) {
    for (const item of fallbackLocales) {
      const next = await client
        .from("bots")
        .select("*")
        .eq("slug", slug)
        .eq("locale", item)
        .eq("status", "published")
        .maybeSingle();
      if (next.data) {
        row = next.data;
        break;
      }
    }
  }
  if (!row) {
    row = (
      await client
        .from("bots")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .limit(1)
        .maybeSingle()
    ).data;
  }

  if (!row) return getSeedBot(slug, locale);
  const [listing] = await attachMembers([row as BotRow]);
  return listing ?? null;
}

export async function listRelatedBots(bot: BotListing, limit = 4) {
  const all = await listPublishedBots({
    category: bot.category,
    locale: bot.locale,
  });
  return all.filter((item) => item.slug !== bot.slug).slice(0, limit);
}

export async function listIntegrations() {
  if (!isSupabaseConfigured()) {
    return listSeedIntegrations();
  }
  const bots = await listPublishedBots({ locale: "all" });
  return [...new Set(bots.flatMap((bot) => bot.integrations))].sort((a, b) =>
    a.localeCompare(b),
  );
}

export async function incrementCopyCount(botId: string) {
  const admin = createAdminClient();
  if (!admin) return;
  await admin.from("copy_events").insert({
    bot_id: botId,
    copied_by: null,
  });
  const { data } = await admin.from("bots").select("copy_count").eq("id", botId).maybeSingle();
  const next = (data?.copy_count ?? 0) + 1;
  await admin.from("bots").update({ copy_count: next }).eq("id", botId);
}

export async function createBotListing(
  input: BotDraftInput,
  user?: {
    id: string;
    handle: string;
  },
) {
  const admin = createAdminClient();
  if (!admin) {
    throw new Error("SUPABASE_UNAVAILABLE");
  }

  const { data, error } = await admin
    .from("bots")
    .insert({
      slug: ensureListingSlug(input.name, input.slug),
      name: input.name,
      kind: input.kind,
      category: input.category,
      locale: input.locale,
      summary: input.summary,
      prompt: input.prompt,
      integrations: input.integrations,
      source_url: input.source_url || null,
      contributor_handle: CONTRIBUTOR_HANDLE,
      status: input.status,
      created_by: user?.id ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "INSERT_FAILED");
  }

  if (input.kind === "team" && input.team_members.length > 0) {
    const members = input.team_members
      .filter((member) => member.name.trim() && member.role.trim())
      .map((member, index) => ({
        team_bot_id: data.id,
        name: member.name.trim(),
        role: member.role.trim(),
        charter: member.charter.trim(),
        sort_order: index,
      }));
    if (members.length > 0) {
      const { error: memberError } = await admin.from("team_members").insert(members);
      if (memberError) {
        throw new Error(memberError.message);
      }
    }
  }

  const [listing] = await attachMembers([data as BotRow]);
  return listing;
}

export async function ensureProfile(user: {
  id: string;
  name?: string | null;
  email?: string | null;
}) {
  const admin = createAdminClient();
  if (!admin) return { handle: user.email?.split("@")[0] || "user" };

  const existing = await admin
    .from("profiles")
    .select("handle, display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (existing.data) {
    return { handle: existing.data.handle as string };
  }

  const handle =
    user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") ||
    `user-${user.id.slice(0, 6)}`;

  await admin.from("profiles").upsert({
    id: user.id,
    handle,
    display_name: user.name || handle,
    locale: "en",
  });

  return { handle };
}
