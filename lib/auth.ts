import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import {
  getAppUrl,
  githubOAuthConfigured,
  googleOAuthConfigured,
  hasBetterAuthSecret,
  isDatabaseConfigured,
} from "@/lib/env";
import { createAdminClient } from "@/lib/supabase";

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

  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: getAppUrl(),
    database: new Pool({ connectionString: process.env.DATABASE_URL }),
    socialProviders,
    plugins: [nextCookies()],
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            const admin = createAdminClient();
            if (!admin) return;
            const handle =
              user.email?.split("@")[0]?.replace(/[^a-zA-Z0-9_]/g, "") ||
              user.id.slice(0, 8);
            await admin.from("profiles").upsert({
              id: user.id,
              handle,
              display_name: user.name || handle,
              locale: "ko",
            });
          },
        },
      },
    },
  });
}

export const auth = createAuth();
