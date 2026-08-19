"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  label: string;
  copiedLabel: string;
  ariaLabel: string;
  botId?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary" | "ghost";
  className?: string;
  onCopied?: () => void;
};

export function CopyButton({
  text,
  label,
  copiedLabel,
  ariaLabel,
  botId,
  size = "default",
  variant = "default",
  className,
  onCopied,
}: Props) {
  const t = useTranslations("bot");
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      if (botId) {
        void fetch("/api/copy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ botId }),
        });
      }
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyFailed"));
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
