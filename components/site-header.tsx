import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthButtons } from "@/components/auth-buttons";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex min-w-0 items-baseline gap-2 rounded-md focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="font-display text-lg tracking-tight">{brand("name")}</span>
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">
            {brand("tagline")}
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          <Link
            href="/from-link"
            className="hidden rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {t("fromLink")}
          </Link>
          <Link
            href="/submit"
            className="hidden rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline"
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
