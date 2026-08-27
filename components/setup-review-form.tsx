"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { HoneyPot } from "@/components/setup-takes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReviewKind, SetupReview } from "@/lib/community-types";
import {
  REVIEW_ADDED_EVENT,
  REVIEW_SCORE_MAX,
  REVIEW_SCORE_MIN,
  REVIEW_TAKE_MAX,
  REVIEW_WHO_MAX,
  USED_SETUP_EVENT,
  usedSetupKey,
} from "@/lib/reviews";
import { cn } from "@/lib/utils";

type Props = {
  listingSlug: string;
};

const SCORES = Array.from(
  { length: REVIEW_SCORE_MAX - REVIEW_SCORE_MIN + 1 },
  (_, index) => index + REVIEW_SCORE_MIN,
);

export function SetupReviewForm({ listingSlug }: Props) {
  const t = useTranslations("reviews");
  const usedId = useId();
  const used = useSyncExternalStore(
    (onChange) => {
      window.addEventListener(USED_SETUP_EVENT, onChange);
      return () => window.removeEventListener(USED_SETUP_EVENT, onChange);
    },
    () => window.sessionStorage.getItem(usedSetupKey(listingSlug)) === "1",
    () => false,
  );
  const [who, setWho] = useState("");
  const [take, setTake] = useState("");
  const [kind, setKind] = useState<ReviewKind>("bot");
  const [score, setScore] = useState(8);
  const [pending, setPending] = useState(false);

  const handleUsedChange = (next: boolean) => {
    if (next) {
      window.sessionStorage.setItem(usedSetupKey(listingSlug), "1");
    } else {
      window.sessionStorage.removeItem(usedSetupKey(listingSlug));
    }
    window.dispatchEvent(new CustomEvent(USED_SETUP_EVENT, { detail: { slug: listingSlug } }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!used) {
      toast.error(t("needUsed"));
      return;
    }
    const form = event.currentTarget;
    const honey = new FormData(form).get("company");
    setPending(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingSlug,
          score,
          take,
          who,
          kind,
          company: honey,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; review?: SetupReview }
        | null;
      if (!response.ok || !payload?.ok) {
        toast.error(t("error"));
        return;
      }
      if (payload.review) {
        window.dispatchEvent(new CustomEvent(REVIEW_ADDED_EVENT, { detail: payload.review }));
      }
      setTake("");
      toast.success(t("saved"));
    } catch {
      toast.error(t("error"));
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mt-4 space-y-4 rounded-lg border bg-card p-4"
      aria-labelledby="review-form-heading"
    >
      <HoneyPot />
      <div className="space-y-1">
        <h3 id="review-form-heading" className="text-base font-semibold tracking-tight">
          {t("formTitle")}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">{used ? t("afterCopy") : t("usedHint")}</p>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id={usedId}
          checked={used}
          onCheckedChange={(value) => handleUsedChange(value === true)}
          aria-describedby={`${usedId}-hint`}
        />
        <div className="space-y-1">
          <Label htmlFor={usedId}>{t("used")}</Label>
          <p id={`${usedId}-hint`} className="text-xs leading-5 text-muted-foreground">
            {t("usedHint")}
          </p>
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{t("kind")}</legend>
        <div className="flex flex-wrap gap-2">
          {(["bot", "human"] as const).map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={kind === value ? "default" : "outline"}
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
            >
              {t(value === "bot" ? "kindBot" : "kindHuman")}
            </Button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="review-who">{t("who")}</Label>
          <Input
            id="review-who"
            value={who}
            maxLength={REVIEW_WHO_MAX}
            onChange={(event) => setWho(event.target.value)}
            placeholder={t("whoHint")}
            required
            autoComplete="nickname"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="review-score">{t("score")}</Label>
          <select
            id="review-score"
            value={score}
            onChange={(event) => setScore(Number(event.target.value))}
            className={cn(
              "h-8 w-full cursor-pointer rounded-md border border-input bg-transparent px-2.5 text-sm outline-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            )}
          >
            {SCORES.map((value) => (
              <option key={value} value={value}>
                {value}/10
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review-take">{t("take")}</Label>
        <Input
          id="review-take"
          value={take}
          maxLength={REVIEW_TAKE_MAX}
          onChange={(event) => setTake(event.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={pending || !used}>
        {pending ? t("pending") : t("submit")}
      </Button>
    </form>
  );
}
