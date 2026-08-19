import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("bot");
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl">{t("notFound")}</h1>
      <p className="mt-6">
        <Link href="/" className="underline">
          {t("back")}
        </Link>
      </p>
    </div>
  );
}
