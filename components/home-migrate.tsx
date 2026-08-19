import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MigrateLockup } from "@/components/migrate-lockup";
import type { HandoffSource } from "@/lib/migrate/types";

const CARDS: { source: HandoffSource; href: "/migrate/hermes" | "/migrate/openclaw"; titleKey: "hermes" | "openclaw" }[] =
  [
    { source: "hermes", href: "/migrate/hermes", titleKey: "hermes" },
    { source: "openclaw", href: "/migrate/openclaw", titleKey: "openclaw" },
  ];

export function HomeMigrate() {
  const t = useTranslations("migrate.home");

  return (
    <section className="space-y-5">
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground">{t("eyebrow")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.source}
            href={card.href}
            className="flex flex-col gap-4 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <MigrateLockup source={card.source} />
            <div className="space-y-2">
              <h2 className="text-base font-semibold tracking-tight">{t(card.titleKey)}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{t("body")}</p>
            </div>
            <span className="text-sm font-medium">{t("cta")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
