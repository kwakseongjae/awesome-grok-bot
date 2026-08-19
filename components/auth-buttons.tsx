"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
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

  if (!ready) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/sign-in">{t("signIn")}</Link>
      </Button>
    );
  }

  if (!signedIn) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/sign-in">{t("signIn")}</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
      {t("signOut")}
    </Button>
  );
}
