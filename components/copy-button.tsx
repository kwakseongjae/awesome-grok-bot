"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  text: string;
  label: string;
  copiedLabel: string;
  ariaLabel: string;
  botId?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
};

export function CopyButton({
  text,
  label,
  copiedLabel,
  ariaLabel,
  botId,
  size = "default",
  variant = "default",
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (botId) {
        void fetch("/api/copy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ botId }),
        });
      }
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? copiedLabel : label}
    </Button>
  );
}
