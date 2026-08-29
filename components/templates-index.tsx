import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { GuideFeatured } from "@/components/guide-featured";
import { MigrateLockup } from "@/components/migrate-lockup";
import { ShareButton } from "@/components/share-button";
import { UseCaseCard, useCaseGridClass } from "@/components/use-case-card";
import { pasteInstallCommand, templateShareUrl } from "@/lib/migrate/skill-md";
import { HANDOFF_SOURCES, sourceLabel } from "@/lib/migrate/source";
import type { BotListing, ListingLocale } from "@/lib/types";

type Props = {
  listings: BotListing[];
  shareUrl: string;
  locale: ListingLocale;
};

export async function TemplatesIndex({ listings, shareUrl, locale }: Props) {
  const t = await getTranslations("templates");
  const migrate = await getTranslations("migrate");
  const bot = await getTranslations("bot");
  const category = await getTranslations("category");

  return (
    <div className="space-y-16">
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

      <section className="space-y-16">
        <div className="space-y-2">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("migrateTitle")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("migrateLead")}</p>
        </div>
        {HANDOFF_SOURCES.map((source) => {
          const install = pasteInstallCommand(source, locale);
          const share = templateShareUrl(source);
          const title = source === "hermes" ? migrate("hermesTitle") : migrate("openclawTitle");
          return (
            <GuideFeatured
              key={source}
              href={`/migrate/${source}`}
              kicker={t("byDirectory")}
              title={title}
              dek={migrate(`desk.cardLead.${source}`)}
              cta={source === "hermes" ? migrate("desk.openHermes") : migrate("desk.openOpenclaw")}
              name={title}
              tone={source === "hermes" ? "bleu" : "turquoise"}
              media={<MigrateLockup source={source} compact />}
              note={
                <>
                  <p>{share}</p>
                  <p className="mt-2 whitespace-pre-wrap">{install}</p>
                </>
              }
              copy={{
                text: install,
                label: bot("copy"),
                copiedLabel: bot("copied"),
                ariaLabel: migrate("desk.copyStarterAria", { source: sourceLabel(source) }),
                copyKind: "starter",
              }}
            />
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("setupsTitle")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("setupsLead")}</p>
        </div>
        <div className={useCaseGridClass}>
          {listings.map((item) => (
            <UseCaseCard
              key={item.id}
              href={`/bots/${item.slug}`}
              category={category(item.category)}
              title={item.name}
              dek={item.summary}
            />
          ))}
        </div>
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
