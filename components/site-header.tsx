import { AuthButtons } from "@/components/auth-buttons";
import { BrandLogo } from "@/components/brand-logo";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SiteHeader() {
  const t = useTranslations("nav");
  const a11y = useTranslations("a11y");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:h-14 sm:flex-nowrap sm:py-0">
        <BrandLogo />
        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-1 gap-y-1 sm:flex-none sm:gap-2"
          aria-label={a11y("mainNav")}
        >
          <Link
            href="/migrate"
            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("migrate")}
          </Link>
          <Link
            href="/from-link"
            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("fromLink")}
          </Link>
          <Link
            href="/submit"
            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {t("submit")}
          </Link>
          <LocaleSwitcher />
          <ThemeToggle />
          <AuthButtons />
        </nav>
      </div>
    </header>
  );
}
