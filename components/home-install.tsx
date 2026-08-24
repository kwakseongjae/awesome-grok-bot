import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { INSTALL_TOOLS } from "@/lib/install";

export function HomeInstall() {
  const t = useTranslations("install");

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
          <h2 className="text-2xl font-semibold tracking-tight">{t("homeTitle")}</h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("homeLead")}</p>
        </div>
        <Link
          href="/install"
          className="text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("viewAll")} →
        </Link>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {INSTALL_TOOLS.map((tool) => (
          <li key={tool.id}>
            <Link
              href={`/install#${tool.id}`}
              className="flex h-full flex-col gap-2 rounded-lg border bg-card p-4 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="text-sm font-semibold tracking-tight">{tool.name}</span>
              <span className="text-xs leading-5 text-muted-foreground">{t(`tools.${tool.summaryKey}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
