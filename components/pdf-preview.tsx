"use client";

import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DocLang } from "@/lib/doc-md";

export function PdfPreview({ lang }: { lang: DocLang }) {
  const t = useTranslations("bible");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className={cn(buttonVariants({ variant: "outline" }))}>
          {t("print")}
        </button>
      </DialogTrigger>
      <DialogContent
        className="flex h-[90vh] w-[min(100%-1.5rem,56rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none"
        showCloseButton
      >
        <DialogHeader className="flex-row items-center justify-between border-b px-4 py-3">
          <DialogTitle className="text-base">{t("previewTitle")}</DialogTitle>
          <a
            href={`/101/${lang}.pdf`}
            download
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mr-8")}
          >
            {t("downloadPdf")}
          </a>
        </DialogHeader>
        <iframe
          src={`/101/${lang}.pdf`}
          title={t("previewTitle")}
          className="min-h-0 w-full flex-1 bg-background"
        />
      </DialogContent>
    </Dialog>
  );
}
