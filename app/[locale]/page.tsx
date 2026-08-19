import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { Directory } from "@/components/directory";
import { parseDirectoryView } from "@/lib/directory-view";
import { listIntegrations, listPublishedBots } from "@/lib/bots";
import { isSupabaseConfigured } from "@/lib/env";
import type { ListingLocale } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ view?: string | string[] }>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const query = await searchParams;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations();
  const bots = await listPublishedBots({ locale: "all" });
  const integrations = await listIntegrations();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-4 py-12 sm:py-16">
      <section className="max-w-2xl space-y-4 border-b pb-12">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {t("home.eyebrow")}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
          {t("home.lead")}
        </p>
      </section>
      <Directory
        bots={bots}
        integrations={integrations}
        uiLocale={locale as ListingLocale}
        demoMode={!isSupabaseConfigured()}
        view={parseDirectoryView(query.view)}
      />
    </div>
  );
}
