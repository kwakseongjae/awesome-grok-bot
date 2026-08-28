import { getLocale, getTranslations } from "next-intl/server";
import type { VisitorMark } from "@/lib/visitor-posts";

type Props = {
  marks: VisitorMark[];
};

export const VisitorMarkList = async ({ marks }: Props) => {
  const t = await getTranslations("visitors");
  const locale = await getLocale();

  if (marks.length === 0) {
    return <p className="text-sm leading-6 text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className="divide-y rounded-lg border bg-card">
      {marks.map((mark) => (
        <li key={mark.id} className="space-y-2 px-4 py-4">
          <p className="font-medium tracking-tight">{mark.name}</p>
          <p className="text-sm leading-6">{mark.line}</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
            <time dateTime={mark.createdAt}>
              {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                new Date(mark.createdAt),
              )}
            </time>
            {mark.link ? (
              <a
                href={mark.link}
                target="_blank"
                rel="noreferrer"
                className="max-w-full cursor-pointer truncate underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {mark.link.replace(/^https:\/\//, "")}
              </a>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
};
