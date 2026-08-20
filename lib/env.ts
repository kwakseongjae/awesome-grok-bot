function firstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function asAbsoluteUrl(value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value.replace(/\/$/, "");
  }
  return `https://${value.replace(/\/$/, "")}`;
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function hasBetterAuthSecret() {
  const secret = process.env.BETTER_AUTH_SECRET;
  return Boolean(secret && secret.length >= 32);
}

export function githubOAuthConfigured() {
  return Boolean(
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
  );
}

export function googleOAuthConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
}

export function getAuthStatus() {
  const missing: string[] = [];
  if (!hasBetterAuthSecret()) missing.push("BETTER_AUTH_SECRET");
  if (!isDatabaseConfigured()) missing.push("DATABASE_URL");
  const providers: string[] = [];
  if (!githubOAuthConfigured()) {
    missing.push("GITHUB_CLIENT_ID");
    missing.push("GITHUB_CLIENT_SECRET");
  } else {
    providers.push("github");
  }
  if (!googleOAuthConfigured()) {
    missing.push("GOOGLE_CLIENT_ID");
    missing.push("GOOGLE_CLIENT_SECRET");
  } else {
    providers.push("google");
  }
  return {
    canRunAuth: hasBetterAuthSecret() && isDatabaseConfigured() && providers.length > 0,
    canPersistListings: isSupabaseAdminConfigured(),
    providers,
    missing: [...new Set(missing)],
  };
}

export function getAppUrl() {
  const fromEnv = firstNonEmpty(
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  );
  return fromEnv ? asAbsoluteUrl(fromEnv) : "http://localhost:3000";
}

export function getAppHost() {
  try {
    return new URL(getAppUrl()).host;
  } catch {
    return "localhost:3000";
  }
}

export function getTrustedOrigins() {
  const origins = new Set<string>([
    getAppUrl(),
    "https://awesome-grok-bot.vercel.app",
    "https://*.vercel.app",
  ]);
  for (const item of (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "").split(",")) {
    const origin = item.trim().replace(/\/$/, "");
    if (origin) origins.add(origin);
  }
  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }
  return [...origins];
}

export function getAllowedAuthHosts() {
  const hosts = new Set<string>(["awesome-grok-bot.vercel.app", "*.vercel.app"]);
  const canonical = getAppHost();
  if (canonical) hosts.add(canonical);
  for (const item of (process.env.BETTER_AUTH_ALLOWED_HOSTS ?? "").split(",")) {
    const host = item.trim();
    if (host) hosts.add(host);
  }
  if (process.env.NODE_ENV !== "production") {
    hosts.add("localhost:*");
    hosts.add("127.0.0.1:*");
  }
  return [...hosts];
}

export function getGtmId() {
  const id = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  if (!id || !/^GTM-[A-Z0-9]+$/i.test(id)) return undefined;
  return id;
}

export function getSiteVerification() {
  const google = firstNonEmpty(process.env.GOOGLE_SITE_VERIFICATION);
  const naver = firstNonEmpty(process.env.NAVER_SITE_VERIFICATION);
  return { google, naver };
}

export function getIndexNowKey() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || !/^[A-Za-z0-9-]{8,128}$/.test(key)) return undefined;
  return key;
}
