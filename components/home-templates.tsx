import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { XTemplateCard } from "@/components/x-template-card";
import { HOME_FEATURED_X_IDS, X_TEMPLATES } from "@/lib/templates";

export async function HomeTemplates() {
  const t = await getTranslations("templates");
  const featured = HOME_FEATURED_X_IDS.map((id) => X_TEMPLATES.find((item) => item.id === id)).filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  );

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("homeEyebrow")}
          </p>
          <h2 className="text-lg font-semibold tracking-tight">{t("homeTitle")}</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("homeLead")}</p>
        </div>
        <Link
          href="/templates"
          className="text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("homeCta")}
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((item) => (
          <XTemplateCard key={item.id} item={item} compact />
        ))}
      </div>
    </section>
  );
}
