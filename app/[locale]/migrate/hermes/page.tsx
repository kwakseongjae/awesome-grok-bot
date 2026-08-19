import { setRequestLocale } from "next-intl/server";
import { toAppLocale } from "@/i18n/routing";
import { MigrateSourcePage } from "@/components/migrate-source-page";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HermesMigratePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(toAppLocale(locale));
  return <MigrateSourcePage source="hermes" />;
}
