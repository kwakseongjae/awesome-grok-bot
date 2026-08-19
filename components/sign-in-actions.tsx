"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { GitHubMark, GoogleGMark } from "@/components/brand-marks";
import { cn } from "@/lib/utils";

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
        <div className="rounded-md border border-dashed bg-muted/40 px-3 py-3 text-sm">
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

      <div className="grid gap-3">
        <button
          type="button"
          disabled={!providers.includes("google") || pending !== null}
          onClick={() => void handleSignIn("google")}
          aria-label={t("google")}
          className={cn(
            "inline-flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-md border px-3 text-[14px] font-medium transition-colors outline-none",
            "border-(--brand-google-border) bg-(--brand-google-bg) text-(--brand-google-text)",
            "focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {pending === "google" ? (
            <Loader2Icon className="size-4 animate-spin" aria-hidden />
          ) : (
            <GoogleGMark className="size-[18px]" />
          )}
          {pending === "google" ? t("pending") : t("google")}
        </button>
        <button
          type="button"
          disabled={!providers.includes("github") || pending !== null}
          onClick={() => void handleSignIn("github")}
          aria-label={t("github")}
          className={cn(
            "inline-flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-transparent px-3 text-[14px] font-medium transition-colors outline-none",
            "bg-(--brand-github-bg) text-(--brand-github-text)",
            "focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {pending === "github" ? (
            <Loader2Icon className="size-4 animate-spin" aria-hidden />
          ) : (
            <GitHubMark className="size-4" />
          )}
          {pending === "github" ? t("pending") : t("github")}
        </button>
      </div>
    </div>
  );
}
