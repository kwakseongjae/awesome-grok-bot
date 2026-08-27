import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Link } from "@/i18n/navigation";
import { toAppLocale } from "@/i18n/routing";
import { DAY_ONE_RECEIPT } from "@/lib/ops";
import { breadcrumbJsonLd, localePath, opsReceiptJsonLd, pageSeo } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  return pageSeo({
    locale: appLocale,
    path: DAY_ONE_RECEIPT.path,
    title: DAY_ONE_RECEIPT.headline,
    description: DAY_ONE_RECEIPT.description,
  });
}

export default async function DayOneReceiptPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("ops");

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-12rem)] w-full max-w-lg flex-col justify-center px-4 py-8 sm:py-10">
      <JsonLd
        data={opsReceiptJsonLd({
          locale: appLocale,
          headline: DAY_ONE_RECEIPT.headline,
          description: DAY_ONE_RECEIPT.description,
          datePublished: DAY_ONE_RECEIPT.date,
          path: DAY_ONE_RECEIPT.path,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "ops") },
          { name: DAY_ONE_RECEIPT.headline, path: localePath(appLocale, DAY_ONE_RECEIPT.path) },
        ])}
      />

      <Link
        href="/ops"
        className="w-fit cursor-pointer text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        ← {t("receiptBack")}
      </Link>

      <article className="mt-5 rounded-lg border bg-card px-5 py-7 sm:px-8 sm:py-8">
        <time
          dateTime={DAY_ONE_RECEIPT.date}
          className="font-mono text-xs text-muted-foreground tabular-nums"
        >
          {DAY_ONE_RECEIPT.date}
        </time>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-pretty sm:text-4xl">
          {DAY_ONE_RECEIPT.headline}
        </h1>
        <ul className="mt-8 divide-y">
          {DAY_ONE_RECEIPT.facts.map((fact) => (
            <li key={fact.text} className="py-3 text-sm leading-6 first:pt-0 last:pb-0 sm:text-base sm:leading-7">
              {"href" in fact ? (
                <>
                  {fact.text}{" "}
                  <a
                    href={fact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer break-all font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {fact.href}
                  </a>
                </>
              ) : (
                fact.text
              )}
            </li>
          ))}
        </ul>
        <p className="mt-8 font-mono text-[0.7rem] tracking-[0.08em] text-muted-foreground">
          {t("receiptFooter")}
        </p>
      </article>
    </div>
  );
}
