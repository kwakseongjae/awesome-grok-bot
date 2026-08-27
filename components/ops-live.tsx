import { cn } from "@/lib/utils";

type Props = {
  label: string;
  className?: string;
};

export const OpsLiveDot = ({ label, className }: Props) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.14em] text-foreground uppercase",
      className,
    )}
  >
    <span className="ops-live-dot size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden="true" />
    {label}
  </span>
);
