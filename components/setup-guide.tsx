import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { IntegrationMark } from "@/components/brand-marks";

const GUIDE_HREF = "https://www.youtube.com/watch?v=PQBYZQqan2g";

const SETUP_CARDS = [
  { href: { pathname: "/how-to" as const, hash: "step-task" }, titleKey: "onceTitle" as const, bodyKey: "onceBody" as const },
  { href: { pathname: "/how-to" as const, hash: "step-skill" }, titleKey: "skillTitle" as const, bodyKey: "skillBody" as const },
  { href: { pathname: "/how-to" as const, hash: "step-routine" }, titleKey: "routineTitle" as const, bodyKey: "routineBody" as const },
];

export function SetupGuide() {
  const t = useTranslations("guide");

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {SETUP_CARDS.map((card, index) => (
          <Link
            key={card.href.hash}
            href={card.href}
            className="flex cursor-pointer flex-col gap-3 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label={`${t(card.titleKey)}. ${t("cta")}`}
          >
            <span className="font-mono text-xs text-muted-foreground tabular-nums">{index + 1}</span>
            <span className="min-w-0 space-y-1">
              <span className="block text-base font-semibold tracking-tight">{t(card.titleKey)}</span>
              <span className="block text-sm leading-6 text-muted-foreground">{t(card.bodyKey)}</span>
            </span>
            <span className="mt-auto text-sm font-medium">{t("cta")}</span>
          </Link>
        ))}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{t("loginNote")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/guides"
          className="flex cursor-pointer flex-col gap-3 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
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
          className="flex cursor-pointer flex-col gap-3 rounded-lg border bg-card p-5 hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50"
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
      </div>
    </section>
  );
}
