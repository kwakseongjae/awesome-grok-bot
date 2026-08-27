import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { getPool } from "@/lib/db";
import {
  getAppUrl,
  githubOAuthConfigured,
  googleOAuthConfigured,
  hasBetterAuthSecret,
  isDatabaseConfigured,
} from "@/lib/env";
import { ensureProfile } from "@/lib/bots";

function buildSocialProviders() {
  const socialProviders: {
    github?: { clientId: string; clientSecret: string };
    google?: { clientId: string; clientSecret: string };
  } = {};

  if (githubOAuthConfigured()) {
    socialProviders.github = {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    };
  }

  if (googleOAuthConfigured()) {
    socialProviders.google = {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    };
  }

  return socialProviders;
}

function createAuth() {
  if (!hasBetterAuthSecret() || !isDatabaseConfigured()) {
    return null;
  }

  const socialProviders = buildSocialProviders();
  if (Object.keys(socialProviders).length === 0) {
    return null;
  }

  const database = getPool();
  if (!database) return null;

  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: getAppUrl(),
    database,
    socialProviders,
    plugins: [nextCookies()],
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await ensureProfile({
              id: user.id,
              name: user.name,
              email: user.email,
            });
          },
        },
      },
    },
  });
}

export const auth = createAuth();
