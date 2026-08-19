"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { BotForm } from "@/components/bot-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildCharterFromPage } from "@/lib/charter";
import type { BotDraftInput, ListingLocale } from "@/lib/types";

export function FromLinkForm() {
  const t = useTranslations("fromLink");
  const locale = useLocale() as ListingLocale;
  const [url, setUrl] = useState("");
  const [splitTeam, setSplitTeam] = useState(false);
  const [pending, setPending] = useState(false);
  const [extractedTitle, setExtractedTitle] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<BotDraftInput> | null>(null);

  const applyTemplate = (title: string, text: string, pageUrl: string, failed: boolean) => {
    const built = buildCharterFromPage({
      url: pageUrl || "https://example.com",
      title: title || (locale === "ko" ? "새 봇" : "New bot"),
      text,
      locale,
      splitTeam,
    });
    setDraft({
      ...built,
      locale,
      category: "productivity",
      status: "draft",
      source_url: pageUrl || null,
    });
    if (failed) {
      toast.error(t("fetchFailed"));
    } else {
      toast.success(t("fetched"));
    }
  };

  const handleFetch = async () => {
    setPending(true);
    try {
      const response = await fetch("/api/from-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setExtractedTitle(null);
        applyTemplate("", "", url, true);
        return;
      }
      setExtractedTitle(body.title ?? null);
      applyTemplate(body.title ?? "", body.text ?? "", body.url ?? url, false);
    } catch {
      setExtractedTitle(null);
      applyTemplate("", "", url, true);
    } finally {
      setPending(false);
    }
  };

  const handleEmpty = () => {
    applyTemplate("", "", url, false);
  };

  return (
    <div className="space-y-8">
      <form
        className="space-y-4 rounded-lg border bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleFetch();
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="source-url">{t("url")}</Label>
          <Input
            id="source-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://"
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={splitTeam} onCheckedChange={(value) => setSplitTeam(value === true)} />
          {t("splitTeam")}
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? t("fetching") : t("fetch")}
          </Button>
          <Button type="button" variant="outline" onClick={handleEmpty}>
            {t("fillAnyway")}
          </Button>
        </div>
        {extractedTitle ? (
          <p className="text-sm text-muted-foreground">
            {t("extractedTitle")}: {extractedTitle}
          </p>
        ) : null}
      </form>

      {draft ? (
        <BotForm
          key={`${draft.slug}-${draft.kind}-${draft.prompt?.slice(0, 24)}`}
          initial={draft}
        />
      ) : null}
    </div>
  );
}
