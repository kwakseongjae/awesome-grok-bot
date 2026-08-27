import { getTranslations } from "next-intl/server";
import { GrokBotMascot } from "@/components/grok-bot-mascot";
import { Link } from "@/i18n/navigation";
import type { PlayGuest, PlayNote } from "@/lib/community-types";
import { MASCOT } from "@/lib/mascot";

type Props = {
  notes: PlayNote[];
  guests: PlayGuest[];
};

export async function PlayCorner({ notes, guests }: Props) {
  const t = await getTranslations("play");
  const previewNote = notes[0];
  const previewGuest = guests[0];

  return (
    <section className="space-y-4" aria-labelledby="play-corner-heading">
      <div className="flex gap-4 rounded-lg border bg-card p-5 sm:gap-5 sm:p-6">
        <GrokBotMascot name={MASCOT.hostName} size={56} className="mt-0.5" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <h2 id="play-corner-heading" className="text-lg font-semibold tracking-tight sm:text-xl">
            {t("title")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("homeLead")}</p>
          <p className="text-sm leading-6 text-muted-foreground">{t("host")}</p>
          {previewGuest ? (
            <p className="text-sm leading-6">
              <span className="font-medium">{previewGuest.name}</span>
              <span className="text-muted-foreground"> · {previewGuest.job}</span>
            </p>
          ) : null}
          {previewNote ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {previewNote.who}: {previewNote.body}
            </p>
          ) : null}
          <Link
            href="/play"
            className="inline-flex text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("open")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
