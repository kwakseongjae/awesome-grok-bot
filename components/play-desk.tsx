"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ListingFace } from "@/components/listing-face";
import { HoneyPot } from "@/components/setup-takes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PlayGuest, PlayNote, PlayReaction, PlayReactionKind } from "@/lib/community-types";
import { PLAY_ADDED_EVENT } from "@/lib/community-types";
import { PLAY_JOB_MAX, PLAY_NAME_MAX, PLAY_NOTE_MAX, PLAY_REACTIONS } from "@/lib/play";
import { listingNameFor } from "@/lib/reviews";
import { SCORE_FALLBACK_NAMES, type RankingRow } from "@/lib/scores";
import { cn } from "@/lib/utils";

type Board = {
  guests: PlayGuest[];
  notes: PlayNote[];
  reactions: PlayReaction[];
};

type PlayAddedDetail =
  | { kind: "guest"; guest: PlayGuest }
  | { kind: "note"; note: PlayNote }
  | { kind: "reaction"; reaction: PlayReaction };

type Props = {
  initial: Board;
  rows: RankingRow[];
  names: Record<string, string>;
};

export function PlayDesk({ initial, rows, names }: Props) {
  const t = useTranslations("play");
  const [board, setBoard] = useState(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setBoard(initial);
  }

  useEffect(() => {
    const handleAdded = (event: Event) => {
      const detail = (event as CustomEvent<PlayAddedDetail>).detail;
      if (!detail) return;
      setBoard((current) => {
        if (detail.kind === "guest") {
          return {
            ...current,
            guests: [detail.guest, ...current.guests.filter((item) => item.id !== detail.guest.id)],
          };
        }
        if (detail.kind === "note") {
          return {
            ...current,
            notes: [detail.note, ...current.notes.filter((item) => item.id !== detail.note.id)],
          };
        }
        return {
          ...current,
          reactions: [
            detail.reaction,
            ...current.reactions.filter((item) => item.id !== detail.reaction.id),
          ],
        };
      });
    };
    window.addEventListener(PLAY_ADDED_EVENT, handleAdded);
    return () => window.removeEventListener(PLAY_ADDED_EVENT, handleAdded);
  }, []);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("guestsTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("guestsLead")}</p>
        </div>
        {board.guests.length === 0 ? (
          <p className="rounded-lg border px-4 py-5 text-sm leading-6 text-muted-foreground">
            {t("guestsEmpty")}
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {board.guests.map((guest) => (
              <li key={guest.id} className="flex gap-3 px-4 py-4 sm:items-center">
                <ListingFace seed={guest.name} name={guest.name} size={40} decorative motion />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium tracking-tight">{guest.name}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{guest.job}</p>
                </div>
                <time className="font-mono text-xs text-muted-foreground tabular-nums" dateTime={guest.date}>
                  {guest.date}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("notesTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("notesLead")}</p>
        </div>
        {board.notes.length === 0 ? (
          <p className="rounded-lg border px-4 py-5 text-sm leading-6 text-muted-foreground">
            {t("notesEmpty")}
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {board.notes.map((note) => (
              <li key={note.id} className="space-y-1 px-4 py-4">
                <p className="text-sm leading-6">{note.body}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {note.who} · {note.date}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">{t("reactTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("reactLead")}</p>
        </div>
        {board.reactions.length === 0 ? (
          <p className="rounded-lg border px-4 py-5 text-sm leading-6 text-muted-foreground">
            {t("reactEmpty")}
          </p>
        ) : (
          <ul className="divide-y rounded-lg border">
            {board.reactions.map((item) => {
              const name = listingNameFor(
                item.listingSlug,
                names,
                SCORE_FALLBACK_NAMES[item.listingSlug as keyof typeof SCORE_FALLBACK_NAMES] ??
                  item.listingSlug,
              );
              return (
                <li key={item.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-4">
                  <span className="text-sm font-medium tracking-tight">{item.who}</span>
                  <span className="rounded-md border px-2 py-0.5 font-mono text-[0.7rem] tracking-[0.08em] uppercase">
                    {t(`react${capitalize(item.reaction)}`)}
                  </span>
                  <span className="text-sm text-muted-foreground">{name}</span>
                  <time className="font-mono text-xs text-muted-foreground tabular-nums" dateTime={item.date}>
                    {item.date}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <InviteForm />
        <NoteForm />
        <ReactForm rows={rows} />
      </div>
    </div>
  );
}

const capitalize = (value: PlayReactionKind) =>
  `${value.slice(0, 1).toUpperCase()}${value.slice(1)}` as "Used" | "Keep" | "Skip";

const InviteForm = () => {
  const t = useTranslations("play");
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const honey = new FormData(event.currentTarget).get("company");
    setPending(true);
    try {
      const response = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite", name, job, company: honey }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; guest?: PlayGuest }
        | null;
      if (!response.ok || !payload?.ok || !payload.guest) {
        toast.error(t("error"));
        return;
      }
      window.dispatchEvent(
        new CustomEvent(PLAY_ADDED_EVENT, { detail: { kind: "guest", guest: payload.guest } }),
      );
      setName("");
      setJob("");
      toast.success(t("saved"));
    } catch {
      toast.error(t("error"));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-3 rounded-lg border p-4">
      <HoneyPot />
      <h3 className="text-base font-semibold tracking-tight">{t("inviteTitle")}</h3>
      <div className="space-y-2">
        <Label htmlFor="guest-name">{t("inviteName")}</Label>
        <Input
          id="guest-name"
          value={name}
          maxLength={PLAY_NAME_MAX}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guest-job">{t("inviteJob")}</Label>
        <Input
          id="guest-job"
          value={job}
          maxLength={PLAY_JOB_MAX}
          onChange={(event) => setJob(event.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("pending") : t("inviteSubmit")}
      </Button>
    </form>
  );
};

const NoteForm = () => {
  const t = useTranslations("play");
  const [who, setWho] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const honey = new FormData(event.currentTarget).get("company");
    setPending(true);
    try {
      const response = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "note", who, body, company: honey }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; note?: PlayNote }
        | null;
      if (!response.ok || !payload?.ok || !payload.note) {
        toast.error(t("error"));
        return;
      }
      window.dispatchEvent(
        new CustomEvent(PLAY_ADDED_EVENT, { detail: { kind: "note", note: payload.note } }),
      );
      setBody("");
      toast.success(t("saved"));
    } catch {
      toast.error(t("error"));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-3 rounded-lg border p-4">
      <HoneyPot />
      <h3 className="text-base font-semibold tracking-tight">{t("noteTitle")}</h3>
      <div className="space-y-2">
        <Label htmlFor="note-who">{t("noteWho")}</Label>
        <Input
          id="note-who"
          value={who}
          maxLength={PLAY_NAME_MAX}
          onChange={(event) => setWho(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note-body">{t("noteBody")}</Label>
        <Input
          id="note-body"
          value={body}
          maxLength={PLAY_NOTE_MAX}
          onChange={(event) => setBody(event.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? t("pending") : t("noteSubmit")}
      </Button>
    </form>
  );
};

const ReactForm = ({ rows }: { rows: RankingRow[] }) => {
  const t = useTranslations("play");
  const [who, setWho] = useState("");
  const [listingSlug, setListingSlug] = useState<string>(rows[0]?.slug ?? "inbox-chief");
  const [reaction, setReaction] = useState<PlayReactionKind>("used");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const honey = new FormData(event.currentTarget).get("company");
    setPending(true);
    try {
      const response = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "react", who, listingSlug, reaction, company: honey }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; reaction?: PlayReaction }
        | null;
      if (!response.ok || !payload?.ok || !payload.reaction) {
        toast.error(t("error"));
        return;
      }
      window.dispatchEvent(
        new CustomEvent(PLAY_ADDED_EVENT, {
          detail: { kind: "reaction", reaction: payload.reaction },
        }),
      );
      toast.success(t("saved"));
    } catch {
      toast.error(t("error"));
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-3 rounded-lg border p-4">
      <HoneyPot />
      <h3 className="text-base font-semibold tracking-tight">{t("reactFormTitle")}</h3>
      <div className="space-y-2">
        <Label htmlFor="react-who">{t("reactWho")}</Label>
        <Input
          id="react-who"
          value={who}
          maxLength={PLAY_NAME_MAX}
          onChange={(event) => setWho(event.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="react-setup">{t("reactSetup")}</Label>
        <select
          id="react-setup"
          value={listingSlug}
          onChange={(event) => setListingSlug(event.target.value)}
          className={cn(
            "h-8 w-full cursor-pointer rounded-md border border-input bg-transparent px-2.5 text-sm outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          )}
        >
          {rows.map((row) => (
            <option key={row.slug} value={row.slug}>
              {row.name}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{t("reactPick")}</legend>
        <div className="flex flex-wrap gap-2">
          {PLAY_REACTIONS.map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={reaction === value ? "default" : "outline"}
              aria-pressed={reaction === value}
              onClick={() => setReaction(value)}
            >
              {t(`react${capitalize(value)}`)}
            </Button>
          ))}
        </div>
      </fieldset>
      <Button type="submit" disabled={pending}>
        {pending ? t("pending") : t("reactSubmit")}
      </Button>
    </form>
  );
};
