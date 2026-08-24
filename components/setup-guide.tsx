import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IntegrationMark } from "@/components/brand-marks";

const GUIDE_HREF = "https://www.youtube.com/watch?v=PQBYZQqan2g";

export function SetupGuide() {
  const t = useTranslations("guide");

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/how-to"
        className="flex flex-col gap-3 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`${t("title")}. ${t("cta")}`}
      >
        <span className="min-w-0 space-y-1">
          <span className="block text-base font-semibold tracking-tight">{t("title")}</span>
          <span className="block text-sm leading-6 text-muted-foreground">{t("body")}</span>
        </span>
        <span className="text-sm font-medium">{t("cta")}</span>
      </Link>
      <a
        href={GUIDE_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col gap-3 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`${t("videoTitle")}. ${t("videoCta")}`}
      >
        <span className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
            <IntegrationMark mark="youtube" className="size-5" />
          </span>
          <span className="min-w-0 space-y-1">
            <span className="block text-base font-semibold tracking-tight">{t("videoTitle")}</span>
            <span className="block text-sm leading-6 text-muted-foreground">{t("videoBody")}</span>
          </span>
        </span>
        <span className="text-sm font-medium">{t("videoCta")}</span>
      </a>
    </section>
  );
}
