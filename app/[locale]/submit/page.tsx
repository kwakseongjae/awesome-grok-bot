import { getTranslations, setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { SubmitForm } from "@/components/submit-form";
import { getAuthStatus } from "@/lib/env";
import { getServerSession } from "@/lib/session";
import type { ListingLocale } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SubmitPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  const t = await getTranslations("submit");
  const session = await getServerSession();
  const status = getAuthStatus();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
      {!session?.user ? (
        <p className="mt-4 text-sm text-muted-foreground">{t("needAuth")}</p>
      ) : null}
      <div className="mt-8">
        <SubmitForm
          fallback={{ locale: locale as ListingLocale, status: "published", kind: "bot", category: "productivity", team_members: [], integrations: [], name: "", slug: "", summary: "", prompt: "" }}
          canSave={status.canPersistListings}
          signedIn={Boolean(session?.user)}
          demoHint={session?.user && status.canPersistListings ? undefined : t("demoHint")}
        />
      </div>
    </div>
  );
}
