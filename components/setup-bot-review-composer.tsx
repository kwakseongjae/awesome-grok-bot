"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HoneypotField } from "@/components/honeypot-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { POST_LIMITS, VISITOR_POSTS_MIGRATION } from "@/lib/post-limits";

type Props = {
  slug: string;
  listingName: string;
  canWrite: boolean;
};

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const SetupBotReviewComposer = ({ slug, listingName, canWrite }: Props) => {
  const t = useTranslations("reviews");
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [score, setScore] = useState("");
  const [body, setBody] = useState("");
  const [xHandle, setXHandle] = useState("");
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
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botSlug: slug,
          displayName,
          score,
          body,
          xHandle,
          website,
        }),
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
      setDisplayName("");
      setScore("");
      setBody("");
      setXHandle("");
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
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight">{t("composerTitle")}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{t("composerLead")}</p>
      </div>
      {!canWrite ? (
        <p className="text-sm leading-6 text-muted-foreground" role="status">
          {t("unavailable", { file: VISITOR_POSTS_MIGRATION })}
        </p>
      ) : null}
      <HoneypotField value={website} onChange={setWebsite} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`review-name-${slug}`}>{t("name")}</Label>
          <Input
            id={`review-name-${slug}`}
            name="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={POST_LIMITS.name.max}
            autoComplete="nickname"
            required
            aria-label={t("name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`review-score-${slug}`}>{t("score")}</Label>
          <select
            id={`review-score-${slug}`}
            name="score"
            value={score}
            onChange={(event) => setScore(event.target.value)}
            required
            aria-label={`${t("score")} ${t("scoreOutOf")}`}
            className="h-8 w-full cursor-pointer rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="" disabled>
              {t("scoreOutOf")}
            </option>
            {SCORES.map((value) => (
              <option key={value} value={value}>
                {value}/10
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`review-body-${slug}`}>{t("body")}</Label>
        <Textarea
          id={`review-body-${slug}`}
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={POST_LIMITS.review.max}
          required
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`review-x-${slug}`}>{t("xHandle")}</Label>
        <Input
          id={`review-x-${slug}`}
          name="xHandle"
          value={xHandle}
          onChange={(event) => setXHandle(event.target.value)}
          maxLength={POST_LIMITS.handle.max + 1}
          autoComplete="off"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">{t("xHandleHint")}</p>
      </div>
      <p className="sr-only">{listingName}</p>
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
