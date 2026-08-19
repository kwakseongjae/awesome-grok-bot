"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/charter";
import { CATEGORIES, type BotDraftInput, type BotKind, type Category, type ListingLocale, type TeamMember } from "@/lib/types";

type Props = {
  initial?: Partial<BotDraftInput>;
  canSave: boolean;
  signedIn: boolean;
  demoHint?: string;
};

const emptyMember = (): TeamMember => ({ name: "", role: "", charter: "" });

export function BotForm({ initial, canSave, signedIn, demoHint }: Props) {
  const t = useTranslations("submit");
  const kindT = useTranslations("kind");
  const catT = useTranslations("category");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [kind, setKind] = useState<BotKind>(initial?.kind ?? "bot");
  const [category, setCategory] = useState<Category>(initial?.category ?? "productivity");
  const [locale, setLocale] = useState<ListingLocale>(initial?.locale ?? "ko");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [prompt, setPrompt] = useState(initial?.prompt ?? "");
  const [integrations, setIntegrations] = useState((initial?.integrations ?? []).join(", "));
  const [sourceUrl, setSourceUrl] = useState(initial?.source_url ?? "");
  const [publish, setPublish] = useState(initial?.status ? initial.status === "published" : true);
  const [members, setMembers] = useState<TeamMember[]>(
    initial?.team_members?.length ? initial.team_members : [emptyMember(), emptyMember()],
  );

  const slugLocked = Boolean(initial?.slug);

  const payload = useMemo<BotDraftInput>(
    () => ({
      name: name.trim(),
      slug: (slug || slugify(name) || "bot").trim(),
      kind,
      category,
      locale,
      summary: summary.trim(),
      prompt: prompt.trim(),
      integrations: integrations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      source_url: sourceUrl.trim() || null,
      status: publish ? "published" : "draft",
      team_members: kind === "team" ? members : [],
    }),
    [category, integrations, kind, locale, members, name, prompt, publish, slug, sourceUrl, summary],
  );

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugLocked && (!slug || slug === slugify(name))) {
      setSlug(slugify(value));
    }
  };

  const handleSave = async () => {
    if (!signedIn || !canSave) {
      toast.error(t("needAuth"));
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.error || t("error"));
      }
      toast.success(t("saved"));
      router.push(`/bots/${payload.slug}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("error"));
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSave();
      }}
    >
      {demoHint ? (
        <p className="rounded-lg border border-dashed bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {demoHint}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("name")} htmlFor="name">
          <Input
            id="name"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            required
          />
        </Field>
        <Field label={t("slug")} htmlFor="slug" hint={t("slugHint")}>
          <Input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            required
          />
        </Field>
        <Field label={t("kind")} htmlFor="kind">
          <Select value={kind} onValueChange={(value) => setKind(value as BotKind)}>
            <SelectTrigger id="kind" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bot">{kindT("bot")}</SelectItem>
              <SelectItem value="team">{kindT("team")}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("category")} htmlFor="category">
          <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {catT(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("locale")} htmlFor="locale">
          <Select value={locale} onValueChange={(value) => setLocale(value as ListingLocale)}>
            <SelectTrigger id="locale" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ko">한국어</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label={t("integrations")} htmlFor="integrations">
          <Input
            id="integrations"
            value={integrations}
            onChange={(event) => setIntegrations(event.target.value)}
            placeholder="Gmail, Slack"
          />
        </Field>
      </div>

      <Field label={t("summary")} htmlFor="summary">
        <Input
          id="summary"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          required
        />
      </Field>

      <Field label={t("prompt")} htmlFor="prompt" hint={t("promptHint")}>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          required
          className="min-h-64 font-mono text-sm"
        />
      </Field>

      <Field label={t("sourceUrl")} htmlFor="sourceUrl">
        <Input
          id="sourceUrl"
          type="url"
          value={sourceUrl}
          onChange={(event) => setSourceUrl(event.target.value)}
        />
      </Field>

      {kind === "team" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">{t("teamMembers")}</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMembers((current) => [...current, emptyMember()])}
            >
              {t("addMember")}
            </Button>
          </div>
          {members.map((member, index) => (
            <div key={index} className="space-y-3 rounded-xl border p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={t("memberName")} htmlFor={`member-name-${index}`}>
                  <Input
                    id={`member-name-${index}`}
                    value={member.name}
                    onChange={(event) =>
                      setMembers((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </Field>
                <Field label={t("memberRole")} htmlFor={`member-role-${index}`}>
                  <Input
                    id={`member-role-${index}`}
                    value={member.role}
                    onChange={(event) =>
                      setMembers((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, role: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
              <Field label={t("memberCharter")} htmlFor={`member-charter-${index}`}>
                <Textarea
                  id={`member-charter-${index}`}
                  value={member.charter}
                  onChange={(event) =>
                    setMembers((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, charter: event.target.value } : item,
                      ),
                    )
                  }
                  className="min-h-28"
                />
              </Field>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setMembers((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                {t("removeMember")}
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={publish}
          onCheckedChange={(value) => setPublish(value === true)}
        />
        {t("publish")}
      </label>

      <Button type="submit" disabled={pending || !signedIn || !canSave}>
        {publish ? t("savePublish") : t("saveDraft")}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
