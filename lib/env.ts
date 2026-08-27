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
    canPersistListings: isDatabaseConfigured(),
    providers,
    missing: [...new Set(missing)],
  };
}

export function getAppUrl() {
  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
}
