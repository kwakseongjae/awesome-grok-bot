"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HoneypotField } from "@/components/honeypot-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POST_LIMITS, VISITOR_POSTS_MIGRATION } from "@/lib/post-limits";
import { VISITOR_MARK_WRITE_URL } from "@/lib/visitor-mark-paste";

type Props = {
  canWrite: boolean;
};

export const VisitorMarkComposer = ({ canWrite }: Props) => {
  const t = useTranslations("visitors");
  const router = useRouter();
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [link, setLink] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, line, link, website }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        if (data?.error === "STORE_UNAVAILABLE") {
          setError(t("unavailable", { file: VISITOR_POSTS_MIGRATION }));
        } else if (data?.error === "RATE_LIMIT") {
          setError(t("rateLimit"));
        } else {
          setError(t("invalid"));
        }
        return;
      }
      setName("");
      setLine("");
      setLink("");
      setWebsite("");
      setMessage(t("submitted"));
      router.refresh();
    } catch {
      setError(t("error"));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4 rounded-lg border bg-card p-4">
      <p className="text-sm leading-6 text-muted-foreground">
        {t("composerLead", { url: VISITOR_MARK_WRITE_URL })}
      </p>
      {!canWrite ? (
        <p className="text-sm leading-6 text-muted-foreground" role="status">
          {t("unavailable", { file: VISITOR_POSTS_MIGRATION })}
        </p>
      ) : null}
      <HoneypotField value={website} onChange={setWebsite} />
      <div className="space-y-2">
        <Label htmlFor="visitor-name">{t("name")}</Label>
        <Input
          id="visitor-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={POST_LIMITS.name.max}
          autoComplete="nickname"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="visitor-line">{t("line")}</Label>
        <Input
          id="visitor-line"
          name="line"
          value={line}
          onChange={(event) => setLine(event.target.value)}
          maxLength={POST_LIMITS.line.max}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="visitor-link">{t("link")}</Label>
        <Input
          id="visitor-link"
          name="link"
          type="url"
          value={link}
          onChange={(event) => setLink(event.target.value)}
          maxLength={POST_LIMITS.url.max}
          autoComplete="url"
          spellCheck={false}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending || !canWrite} className="cursor-pointer">
          {t("submit")}
        </Button>
        {message ? (
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-destructive" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
};
