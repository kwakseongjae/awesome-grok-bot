import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { KindBadge } from "@/components/listing-badges";
import { ListingFace } from "@/components/listing-face";
import { MigrateLockup } from "@/components/migrate-lockup";
import { ShareButton } from "@/components/share-button";
import { HANDOFF_SOURCES } from "@/lib/migrate/source";
import { templateShareUrl } from "@/lib/migrate/skill-md";
import type { BotListing } from "@/lib/types";

type Props = {
  listings: BotListing[];
  shareUrl: string;
};

export async function TemplatesIndex({ listings, shareUrl }: Props) {
  const t = await getTranslations("templates");
  const migrate = await getTranslations("migrate");
  const bot = await getTranslations("bot");
  const kind = await getTranslations("kind");

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center gap-2">
        <ShareButton title={t("title")} url={shareUrl} />
      </div>
      <p>
        <span className="sr-only">{bot("share")}: </span>
        <a
          href={shareUrl}
          className="cursor-pointer font-mono text-xs tracking-tight text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {shareUrl}
        </a>
      </p>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("migrateTitle")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("migrateLead")}</p>
        </div>
        <div className="grid items-stretch gap-4 sm:grid-cols-2">
          {HANDOFF_SOURCES.map((source) => (
            <Link
              key={source}
              href={`/migrate/${source}`}
              className="flex h-full flex-col gap-4 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <MigrateLockup source={source} />
              <p className="font-mono text-xs tracking-tight text-muted-foreground">
                {templateShareUrl(source)}
              </p>
              <span className="mt-auto text-sm font-medium">
                {source === "hermes" ? migrate("desk.openHermes") : migrate("desk.openOpenclaw")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("setupsTitle")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("setupsLead")}</p>
        </div>
        <ul className="space-y-3">
          {listings.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <ListingFace slug={item.slug} name={item.name} size={40} decorative motion />
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/bots/${item.slug}`}
                    className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {item.name}
                  </Link>
                  <KindBadge kind={item.kind} label={kind(item.kind)} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{item.summary}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="text-sm">
          <Link
            href="/"
            className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("directory")}
          </Link>
        </p>
      </section>
    </div>
  );
}
