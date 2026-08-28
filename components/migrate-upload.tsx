"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { HandoffQueue } from "@/components/handoff-queue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HandoffSource, ParseResult } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

type Props = {
  source: HandoffSource;
  locale?: ListingLocale;
  onParsed?: (result: ParseResult) => void;
  showQueue?: boolean;
};

const archiveName = (file: File) => {
  const relative = "webkitRelativePath" in file ? String(file.webkitRelativePath || "") : "";
  return relative || file.name;
};

export function MigrateUpload({ source, locale: localeProp, onParsed, showQueue = true }: Props) {
  const t = useTranslations("migrate");
  const localeHook = useLocale() as ListingLocale;
  const locale = localeProp ?? localeHook;
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const filesInput = form.elements.namedItem("handoff-files") as HTMLInputElement | null;
    const folderInput = form.elements.namedItem("handoff-folder") as HTMLInputElement | null;
    const files = [...Array.from(filesInput?.files ?? []), ...Array.from(folderInput?.files ?? [])];
    if (files.length === 0) {
      toast.error(t("needFiles"));
      return;
    }

    const body = new FormData();
    body.set("source", source);
    body.set("locale", locale);
    for (const file of files) {
      body.append("files", file, archiveName(file));
    }

    setPending(true);
    try {
      const response = await fetch("/api/migrate/parse", {
        method: "POST",
        body,
      });
      const payload = (await response.json().catch(() => null)) as
        | (ParseResult & { error?: string })
        | null;
      if (!response.ok || !payload || payload.error) {
        toast.error(payload?.error || t("parseFailed"));
        return;
      }
      setResult(payload);
      onParsed?.(payload);
    } catch {
      toast.error(t("parseFailed"));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-8">
      <form className="space-y-4 rounded-lg border bg-card p-4" onSubmit={(event) => void handleSubmit(event)}>
        <div className="space-y-1.5">
          <Label htmlFor="handoff-files">{t("files")}</Label>
          <Input
            id="handoff-files"
            name="handoff-files"
            type="file"
            multiple
            accept=".md,.markdown,.json,.yaml,.yml,.txt,.zip,.tar,.gz,.tgz"
          />
          <Label htmlFor="handoff-folder">{t("folder")}</Label>
          <Input
            id="handoff-folder"
            name="handoff-folder"
            type="file"
            multiple
            aria-label={t("folder")}
            {...({ webkitdirectory: "", directory: "" } as InputHTMLAttributes<HTMLInputElement>)}
          />
          <p className="text-xs text-muted-foreground">{t(`accept.${source}`)}</p>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? t("parsing") : t("preview")}
        </Button>
      </form>

      {showQueue && result ? (
        <HandoffQueue
          source={result.source}
          packets={result.packets}
          listingDraft={result.listingDraft}
          skipped={result.skipped}
          redactedCount={result.redactedCount}
        />
      ) : null}
    </div>
  );
}
