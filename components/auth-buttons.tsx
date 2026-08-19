"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type Props = {
  appearance?: "label" | "icon";
};

export function AuthButtons({ appearance = "label" }: Props) {
  const t = useTranslations("nav");
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    authClient
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSignedIn(Boolean(data?.user));
        setReady(true);
      })
      .catch(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  if (appearance === "icon") {
    if (ready && signedIn) {
      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          aria-label={t("signOut")}
        >
          <LogOut />
        </Button>
      );
    }

    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/sign-in" aria-label={t("signIn")}>
          <LogIn />
        </Link>
      </Button>
    );
  }

  if (!ready || !signedIn) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/sign-in">{t("signIn")}</Link>
      </Button>
    );
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
      {t("signOut")}
    </Button>
  );
}
