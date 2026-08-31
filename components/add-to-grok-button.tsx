"use client";

import { ExternalLinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { trackAddToGrok } from "@/lib/analytics";
import { canonicalGrokShareUrl } from "@/lib/share-link";
import { cn } from "@/lib/utils";

type Props = {
  shareUrl: string;
  source: "listing" | "community";
  size?: "default" | "sm" | "lg";
  hideIcon?: boolean;
  className?: string;
};

export function AddToGrokButton({
  shareUrl,
  source,
  size = "default",
  hideIcon = false,
  className,
}: Props) {
  const t = useTranslations("bot");
  const href = canonicalGrokShareUrl(shareUrl);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ size }), className)}
      onClick={() => trackAddToGrok({ source })}
    >
      {hideIcon ? null : <ExternalLinkIcon />}
      {t("addToGrok")}
    </a>
  );
}
