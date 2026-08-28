"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HoneypotField } from "@/components/honeypot-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { POST_LIMITS, VISITOR_POSTS_MIGRATION } from "@/lib/post-limits";

type Props = {
  canWrite: boolean;
};

export const VisitorMarkComposer = ({ canWrite }: Props) => {
  const t = useTranslations("visitors");
  const router = useRouter();
  const formId = useId();
  const nameId = `${formId}-name`;
  const lineId = `${formId}-line`;
  const linkId = `${formId}-link`;
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [link, setLink] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canWrite || pending) return;
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
    <form
      onSubmit={handleSubmit}
      className="relative space-y-4 rounded-lg border bg-card p-4"
      aria-label={t("submit")}
      aria-busy={pending}
    >
      <p className="text-sm leading-6 text-muted-foreground">{t("composerLead")}</p>
      {!canWrite ? (
        <p className="text-sm leading-6 text-muted-foreground" role="status">
          {t("unavailable", { file: VISITOR_POSTS_MIGRATION })}
        </p>
      ) : null}
      <HoneypotField value={website} onChange={setWebsite} />
      <fieldset disabled={!canWrite || pending} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={nameId}>{t("name")}</Label>
          <Input
            id={nameId}
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={POST_LIMITS.name.min}
            maxLength={POST_LIMITS.name.max}
            autoComplete="nickname"
            required
            aria-invalid={Boolean(error) || undefined}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={lineId}>{t("line")}</Label>
          <Input
            id={lineId}
            name="line"
            value={line}
            onChange={(event) => setLine(event.target.value)}
            minLength={POST_LIMITS.line.min}
            maxLength={POST_LIMITS.line.max}
            required
            aria-invalid={Boolean(error) || undefined}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={linkId}>{t("link")}</Label>
          <Input
            id={linkId}
            name="link"
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            maxLength={POST_LIMITS.url.max}
            autoComplete="url"
            spellCheck={false}
            inputMode="url"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" className="cursor-pointer">
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
      </fieldset>
    </form>
  );
};
