import { AuthButtons } from "@/components/auth-buttons";
import { BrandLogo } from "@/components/brand-logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { SiteMobileNav } from "@/components/site-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const NAV_ITEMS = [
  { href: "/migrate" as const, key: "migrate" as const },
  { href: "/from-link" as const, key: "fromLink" as const },
  { href: "/submit" as const, key: "submit" as const },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  const a11y = useTranslations("a11y");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <BrandLogo />
        <nav className="hidden items-center gap-2 md:flex" aria-label={a11y("mainNav")}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t(item.key)}
            </Link>
          ))}
          <LocaleSwitcher />
          <ThemeToggle />
          <AuthButtons />
        </nav>
        <div className="md:hidden">
          <SiteMobileNav />
        </div>
      </div>
    </header>
  );
}
