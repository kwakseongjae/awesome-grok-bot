"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthButtons } from "@/components/auth-buttons";
import { ThemeToggle } from "@/components/theme-toggle";
import { GROK_BOT, SHOW_ACCOUNT_CHROME } from "@/lib/site";
import { HEADER_NAV } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteMobileNav() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const a11y = useTranslations("a11y");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={a11y("openMenu")}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="gap-0 p-0">
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b">
          <SheetTitle className="text-left">{brand("name")}</SheetTitle>
          <SheetClose asChild>
            <Button type="button" variant="ghost" size="icon" className="shrink-0" aria-label={a11y("closeMenu")}>
              <X />
            </Button>
          </SheetClose>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4" aria-label={a11y("mainNav")}>
          {HEADER_NAV.map((item) => (
            <SheetClose key={item.href} asChild>
              <Link
                href={item.href}
                className="rounded-md px-2 py-3 text-base hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {t(item.key)}
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <a
              href={GROK_BOT.getStarted}
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-2 py-3 text-base hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {t("docs")}
            </a>
          </SheetClose>
        </nav>
        <div className="mt-auto flex items-center gap-1 border-t p-4">
          <ThemeToggle />
          {SHOW_ACCOUNT_CHROME ? <AuthButtons appearance="icon" /> : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
