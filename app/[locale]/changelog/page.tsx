import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { toAppLocale } from "@/i18n/routing";
import { JsonLd } from "@/components/json-ld";
import { CHANGELOG, SITE_UPDATED_AT } from "@/lib/changelog";
import { breadcrumbJsonLd, changelogJsonLd, localePath, pageSeo } from "@/lib/seo";
import { GROK_BOT, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  const t = await getTranslations({ locale: appLocale, namespace: "changelog" });
  return pageSeo({ locale: appLocale, path: "changelog", title: t("title"), description: t("lead") });
}

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;
  const appLocale = toAppLocale(locale);
  setRequestLocale(appLocale);
  const t = await getTranslations("changelog");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <JsonLd
        data={changelogJsonLd({
          locale: appLocale,
          name: t("title"),
          description: t("lead"),
          dateModified: SITE_UPDATED_AT,
          entries: CHANGELOG.map((entry) => ({
            id: entry.id,
            date: entry.date,
            headline: entry.title[appLocale],
            text: entry.body[appLocale],
          })),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: SITE_NAME, path: localePath(appLocale) },
          { name: t("title"), path: localePath(appLocale, "changelog") },
        ])}
      />
      <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{t("eyebrow")}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{t("lead")}</p>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        {t("updatedAt")}: {" "}
        <time dateTime={SITE_UPDATED_AT}>
          {new Intl.DateTimeFormat(appLocale, {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Asia/Seoul",
          }).format(new Date(SITE_UPDATED_AT))} KST
        </time>
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        {t("note")}{" "}
        <a
          href={GROK_BOT.xAccount}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          @xai
        </a>
      </p>

      <ol className="mt-10 space-y-12">
        {CHANGELOG.map((entry) => (
          <li key={entry.id} id={entry.id} className="scroll-mt-20 border-l pl-5 sm:pl-6">
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              <time dateTime={entry.date}>{entry.date}</time> · {entry.source}
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              <a href={`#${entry.id}`} className="hover:underline underline-offset-4">
                {entry.title[appLocale]}
              </a>
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.body[appLocale]}</p>
            {entry.image ? (
              <figure className="mt-4 overflow-hidden rounded-lg border bg-card">
                <Image
                  src={entry.image.src}
                  alt={entry.image.alt}
                  width={entry.image.width}
                  height={entry.image.height}
                  className="h-auto w-full"
                />
              </figure>
            ) : null}
            {entry.links && entry.links.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                {entry.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
