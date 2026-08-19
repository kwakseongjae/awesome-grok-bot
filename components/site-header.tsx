import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthButtons } from "@/components/auth-buttons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const a11y = useTranslations("a11y");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:h-14 sm:flex-nowrap sm:py-0">
        <Link href="/" className="flex min-w-0 items-baseline gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="font-display text-lg tracking-tight">{brand("name")}</span>
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
            {brand("tagline")}
          </span>
        </Link>
        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-1 gap-y-1 sm:flex-none sm:gap-2"
          aria-label={a11y("mainNav")}
        >
          <Link
            href="/from-link"
            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            {t("fromLink")}
          </Link>
          <Link
            href="/submit"
            className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground"
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
