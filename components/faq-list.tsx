"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  q: string;
  a: string;
};

type Props = {
  items: Item[];
};

export function FaqList({ items }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  const handleToggle = (question: string) => {
    setOpen((current) => (current === question ? null : question));
  };

  return (
    <div className="divide-y rounded-lg border">
      {items.map((item) => {
        const isOpen = open === item.q;
        return (
          <div key={item.q} className="px-4">
            <button
              type="button"
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left font-medium focus-visible:ring-3 focus-visible:ring-ring/50"
              onClick={() => handleToggle(item.q)}
            >
              {item.q}
              <ChevronDownIcon
                aria-hidden
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-3 text-sm leading-6 text-muted-foreground">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
