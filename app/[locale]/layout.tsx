import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALE_OG } from "@/lib/locales";
import { websiteJsonLd } from "@/lib/seo";
import { siteVerification } from "@/lib/site-verify";
import { MASCOT } from "@/lib/mascot";
import { OG_IMAGE, SITE_NAME } from "@/lib/site";
import { routing, toAppLocale } from "@/i18n/routing";
import { HtmlLang } from "@/components/html-lang";
import { JsonLd } from "@/components/json-ld";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "meta" });
  const title = t("title");
  const description = t("description");

  return {
    title: {
      default: title,
      template: `%s · ${title}`,
    },
    description,
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      apple: MASCOT.markSrc,
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: LOCALE_OG[appLocale],
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    verification: siteVerification(),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(toAppLocale(locale));
  const messages = await getMessages();
  const t = await getTranslations("nav");

  return (
    <NextIntlClientProvider messages={messages}>
      <JsonLd data={websiteJsonLd()} />
      <HtmlLang locale={locale} />
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {t("skipToContent")}
      </a>
      <SiteHeader />
      <main id="content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <Toaster />
    </NextIntlClientProvider>
  );
}
