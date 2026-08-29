import { AuthButtons } from "@/components/auth-buttons";
import { BrandLogo } from "@/components/brand-logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { SiteMobileNav } from "@/components/site-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { GROK_BOT, SHOW_ACCOUNT_CHROME } from "@/lib/site";
import { useTranslations } from "next-intl";

const NAV_ITEMS = [
  { href: "/templates" as const, key: "templates" as const },
  { href: "/how-to" as const, key: "howTo" as const },
  { href: "/install" as const, key: "install" as const },
  { href: "/changelog" as const, key: "changelog" as const },
  { href: "/ops" as const, key: "ops" as const },
  { href: "/migrate" as const, key: "migrate" as const },
  { href: "/visitors" as const, key: "visitors" as const },
  { href: "/reviews" as const, key: "reviews" as const },
  ...(SHOW_ACCOUNT_CHROME ? ([{ href: "/submit" as const, key: "submit" as const }] as const) : []),
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const a11y = useTranslations("a11y");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl flex-nowrap items-center justify-between gap-3 overflow-x-clip px-4">
        <BrandLogo />
        <nav className="hidden flex-nowrap items-center gap-2 md:flex" aria-label={a11y("mainNav")}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t(item.key)}
            </Link>
          ))}
          <a
            href={GROK_BOT.getStarted}
            target="_blank"
            rel="noreferrer"
            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("docs")}
          </a>
          <LocaleSwitcher />
          <ThemeToggle />
          {SHOW_ACCOUNT_CHROME ? <AuthButtons /> : null}
        </nav>
        <div className="flex items-center md:hidden">
          <LocaleSwitcher appearance="icon" />
          <SiteMobileNav />
        </div>
      </div>
    </header>
  );
}
