import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VisitorMarkComposer } from "@/components/visitor-mark-composer";
import { VisitorMarkList } from "@/components/visitor-mark-list";
import type { VisitorMark } from "@/lib/visitor-posts";

const HOME_MARK_LIMIT = 5;

type Props = {
  marks: VisitorMark[];
  canWrite: boolean;
};

export const HomeVisitorWall = async ({ marks, canWrite }: Props) => {
  const t = await getTranslations("visitors");
  const latest = marks.slice(0, HOME_MARK_LIMIT);

  return (
    <section id="visitor-wall" className="space-y-5" aria-labelledby="visitor-wall-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl space-y-2">
          <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {t("eyebrow")}
          </p>
          <h2 id="visitor-wall-heading" className="text-2xl font-semibold tracking-tight">
            {t("homeTitle")}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">{t("homeLead")}</p>
        </div>
        <Link
          href="/visitors"
          className="cursor-pointer text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {t("homeOpen")} →
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <VisitorMarkList marks={latest} />
        <VisitorMarkComposer canWrite={canWrite} />
      </div>
    </section>
  );
};
