import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand-logo";
import { GmailMark, GitHubMark, LlmsMark } from "@/components/brand-marks";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { SITE_UPDATED_AT } from "@/lib/changelog";
import type { ListingLocale } from "@/lib/types";
import { CONTACT_EMAIL, GITHUB_REPO, SHOW_ACCOUNT_CHROME } from "@/lib/site";
import { cn } from "@/lib/utils";

const USE_LINKS: (
  | { href: "/how-to"; key: "howToUse" }
  | { href: "/"; nav: "directory" }
  | { href: "/rank"; nav: "rank" }
  | { href: "/visitors"; nav: "visitors" }
  | { href: "/reviews"; nav: "reviews" }
  | { href: "/ops"; nav: "ops" }
  | { href: "/submit"; nav: "submit" }
)[] = [
  { href: "/how-to", key: "howToUse" },
  { href: "/", nav: "directory" },
  { href: "/rank", nav: "rank" },
  { href: "/visitors", nav: "visitors" },
  { href: "/reviews", nav: "reviews" },
  { href: "/ops", nav: "ops" },
  ...(SHOW_ACCOUNT_CHROME ? ([{ href: "/submit", nav: "submit" }] as const) : []),
];

const MOVE_LINKS: (
  | { href: "/templates"; key: "templates" }
  | { href: "/migrate"; key: "migrate" }
  | { href: "/migrate/hermes" | "/migrate/openclaw"; label: string }
)[] = [
  { href: "/templates", key: "templates" },
  { href: "/migrate", key: "migrate" },
  { href: "/migrate/hermes", label: "Hermes" },
  { href: "/migrate/openclaw", label: "OpenClaw" },
];

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const changelog = useTranslations("changelog");
  const locale = useLocale() as ListingLocale;

  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:py-14 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <BrandLogo />
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">{t("note")}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "bg-(--brand-github-bg) text-(--brand-github-text) hover:bg-(--brand-github-bg)/90",
              )}
            >
              <GitHubMark className="size-3.5" />
              {t("github")}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label={t("mailAria")}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "bg-(--brand-mail-bg) text-(--brand-mail-text) hover:bg-(--brand-mail-bg)/90",
              )}
            >
              <GmailMark className="size-4 [&_path]:fill-current" />
              {t("mail")}
            </a>
            <a
              href="/llms.txt"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "bg-(--brand-llms-bg) text-(--brand-llms-text) hover:bg-(--brand-llms-bg)/90",
              )}
            >
              <LlmsMark className="size-3.5" />
              {t("llms")}
            </a>
          </div>
        </div>

        <div className="flex lg:justify-end">
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <FooterCol title={t("colUse")}>
              {USE_LINKS.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {"nav" in item ? nav(item.nav) : t(item.key)}
                </FooterLink>
              ))}
            </FooterCol>
            <FooterCol title={t("colMove")}>
              {MOVE_LINKS.map((item) => (
                <FooterLink key={item.href} href={item.href}>
                  {"label" in item ? item.label : t(item.key)}
                </FooterLink>
              ))}
            </FooterCol>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright", { year: 2026 })}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FooterLink href="/changelog">
              {changelog("updatedAt")}: {new Intl.DateTimeFormat(locale, {
                dateStyle: "medium",
                timeZone: "Asia/Seoul",
              }).format(new Date(SITE_UPDATED_AT))}
            </FooterLink>
            <FooterLink href="/license">{t("license")}</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterCol = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="space-y-3">
    <p className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
      {title}
    </p>
    <div className="flex flex-col gap-2 text-sm">{children}</div>
  </div>
);

const FooterLink = ({
  href,
  children,
}: {
  href: Parameters<typeof Link>[0]["href"];
  children: ReactNode;
}) => (
  <Link
    href={href}
    className="w-fit text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
  >
    {children}
  </Link>
);
