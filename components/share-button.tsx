"use client";

import { useState } from "react";
import { ShareIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trackShare } from "@/lib/analytics";

type Props = {
  title: string;
  url?: string;
};

export function ShareButton({ title, url }: Props) {
  const t = useTranslations("bot");
  const [pending, setPending] = useState(false);

  const handleShare = async () => {
    const shareUrl = url ?? window.location.href;
    setPending(true);
    try {
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title, text: title, url: shareUrl });
          trackShare({ method: "web_share" });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }
      await navigator.clipboard.writeText(shareUrl);
      trackShare({ method: "clipboard" });
      toast.success(t("shareCopied"));
    } catch {
      toast.error(t("copyFailed"));
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleShare()}
      aria-label={t("share")}
      disabled={pending}
    >
      <ShareIcon />
      {t("share")}
    </Button>
  );
}
