"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GrokBotMark } from "@/components/grok-bot-mark";
import { buttonVariants } from "@/components/ui/button";
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
  const [active, setActive] = useState(jobs[0]?.slug ?? "");
  const current = jobs.find((job) => job.slug === active) ?? jobs[0];

  if (!current) return null;

  const handleSelect = (slug: string) => {
    setActive(slug);
  };

  return (
    <section className="space-y-8" aria-labelledby="job-kinds-heading">
      <h2 id="job-kinds-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("jobsTitle")}
      </h2>
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
                "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm tracking-tight transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "border-foreground text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {selected ? <GrokBotMark className="size-5" /> : null}
              {job.name}
            </button>
          );
        })}
      </div>
      <div className="max-w-2xl space-y-3">
        <p className="text-base font-semibold tracking-tight">{current.name}</p>
        <p className="text-sm leading-6 text-muted-foreground">{current.summary}</p>
      </div>
      <p>
        <Link
          href={{ pathname: "/", hash: "catalog" }}
          className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer rounded-full px-4")}
        >
          {t("jobsMore")}
        </Link>
      </p>
    </section>
  );
}
