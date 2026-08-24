import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MigrateLockup } from "@/components/migrate-lockup";
import type { HandoffSource } from "@/lib/migrate/types";

const CARDS: { source: HandoffSource; href: "/migrate/hermes" | "/migrate/openclaw" }[] = [
  { source: "hermes", href: "/migrate/hermes" },
  { source: "openclaw", href: "/migrate/openclaw" },
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
            <p className="text-sm leading-6 text-muted-foreground">{t("body")}</p>
            <span className="text-sm font-medium">{t("cta")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
