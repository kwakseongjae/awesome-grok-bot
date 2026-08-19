import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{t("note")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/from-link"
            className="hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {nav("fromLink")}
          </Link>
          <Link
            href="/submit"
            className="hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {nav("submit")}
          </Link>
          <span>{t("license")}</span>
        </div>
      </div>
    </footer>
  );
}
