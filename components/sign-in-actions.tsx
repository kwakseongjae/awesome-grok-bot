"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type Props = {
  canRunAuth: boolean;
  providers: string[];
  missing: string[];
  callbackPath: string;
};

export function SignInActions({ canRunAuth, providers, missing, callbackPath }: Props) {
  const t = useTranslations("signIn");
  const [pending, setPending] = useState<string | null>(null);

  const handleSignIn = async (provider: "github" | "google") => {
    if (!canRunAuth) {
      toast.error(t("missing"));
      return;
    }
    setPending(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: callbackPath,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("missing"));
      setPending(null);
    }
  };

  return (
    <div className="space-y-4">
      {!canRunAuth ? (
        <div className="rounded-lg border border-dashed bg-muted/40 px-3 py-3 text-sm">
          <p className="font-medium">{t("missing")}</p>
          {missing.includes("DATABASE_URL") ? (
            <p className="mt-1 text-muted-foreground">{t("missingDb")}</p>
          ) : null}
          <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
            {missing.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!providers.includes("github") || pending !== null}
          onClick={() => void handleSignIn("github")}
        >
          {pending === "github" ? "…" : t("github")}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!providers.includes("google") || pending !== null}
          onClick={() => void handleSignIn("google")}
        >
          {pending === "google" ? "…" : t("google")}
        </Button>
      </div>
    </div>
  );
}
