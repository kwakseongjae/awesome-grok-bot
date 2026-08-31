import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ListingFace } from "@/components/listing-face";
import { MigrateLockup } from "@/components/migrate-lockup";
import { porterName, porterSlug } from "@/lib/porter";
import type { HandoffSource } from "@/lib/migrate/types";
import type { ListingLocale } from "@/lib/types";

const CARDS: { source: HandoffSource; href: "/migrate/hermes" | "/migrate/openclaw" }[] = [
  { source: "hermes", href: "/migrate/hermes" },
  { source: "openclaw", href: "/migrate/openclaw" },
];

export function HomeMigrate() {
  const t = useTranslations("migrate.home");
  const locale = useLocale() as ListingLocale;

  return (
    <section className="space-y-5">
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground">{t("eyebrow")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={`porter-${card.source}`}
            href={`/bots/${porterSlug(card.source)}`}
            className="flex flex-col gap-4 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="flex items-center gap-3">
              <ListingFace slug={porterSlug(card.source)} name={porterName(locale, card.source)} size={40} decorative motion />
              <span className="font-semibold tracking-tight">{porterName(locale, card.source)}</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{t("porterBody")}</p>
            <span className="text-sm font-medium">{t("porterCta")}</span>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.source}
            href={card.href}
            className="flex flex-col gap-4 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <MigrateLockup source={card.source} />
            <p className="text-sm leading-6 text-muted-foreground">{t("body")}</p>
            <span className="text-sm font-medium">{t("cta")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
