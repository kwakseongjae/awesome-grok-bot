"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type JobKindItem = {
  slug: string;
  name: string;
  summary: string;
};

type Props = {
  jobs: JobKindItem[];
};

export function JobKinds({ jobs }: Props) {
  const t = useTranslations("home");
  const card = useTranslations("card");
  const [active, setActive] = useState(jobs[0]?.slug ?? "");
  const current = jobs.find((job) => job.slug === active) ?? jobs[0];

  if (!current) return null;

  const handleSelect = (slug: string) => {
    setActive(slug);
  };

  return (
    <section className="space-y-5" aria-labelledby="job-kinds-heading">
      <div className="space-y-2">
        <h2 id="job-kinds-heading" className="text-2xl font-semibold tracking-tight">
          {t("jobsTitle")}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{t("jobsLead")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {jobs.map((job) => {
          const selected = job.slug === current.slug;
          return (
            <button
              key={job.slug}
              type="button"
              aria-pressed={selected}
              tabIndex={0}
              onClick={() => handleSelect(job.slug)}
              className={cn(
                "cursor-pointer rounded-full border px-3 py-1.5 text-sm tracking-tight transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted/40",
              )}
            >
              {job.name}
            </button>
          );
        })}
      </div>
      <div className="max-w-2xl space-y-3">
        <h3 className="text-lg font-semibold tracking-tight">{current.name}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{current.summary}</p>
        <p>
          <Link
            href={`/bots/${current.slug}`}
            className="cursor-pointer text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {card("open")}
          </Link>
        </p>
      </div>
    </section>
  );
}
