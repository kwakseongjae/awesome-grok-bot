import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
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
    image: DAY_ONE_RECEIPT.image,
  });
}

export default async function DayOneReceiptPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("ops");

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-12rem)] w-full max-w-3xl flex-col justify-center px-4 py-8 sm:py-10">
      <JsonLd
        data={opsReceiptJsonLd({
          locale: appLocale,
          headline: DAY_ONE_RECEIPT.headline,
          description: DAY_ONE_RECEIPT.description,
          datePublished: DAY_ONE_RECEIPT.date,
          path: DAY_ONE_RECEIPT.path,
          image: DAY_ONE_RECEIPT.image.url,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "ops") },
          { name: DAY_ONE_RECEIPT.headline, path: localePath(appLocale, DAY_ONE_RECEIPT.path) },
        ])}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/ops"
          className="w-fit cursor-pointer text-sm text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          ← {t("receiptBack")}
        </Link>
        <a
          href={DAY_ONE_RECEIPT.image.url}
          download="no-hermes-four-bots-one-day.png"
          className="cursor-pointer font-mono text-xs tracking-[0.08em] text-muted-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("receiptPng")}
        </a>
      </div>

      <article className="relative mt-5">
        <h1 className="sr-only">{DAY_ONE_RECEIPT.headline}</h1>
        <Image
          src={DAY_ONE_RECEIPT.image.url}
          alt={DAY_ONE_RECEIPT.image.alt}
          width={DAY_ONE_RECEIPT.image.width}
          height={DAY_ONE_RECEIPT.image.height}
          priority
          unoptimized
          className="h-auto w-full"
        />
        <a
          href={DAY_ONE_RECEIPT.firstShotHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-x-[9%] top-[56%] h-[6%] cursor-pointer focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="sr-only">First shot: {DAY_ONE_RECEIPT.firstShotLabel}</span>
        </a>
      </article>
    </div>
  );
}
