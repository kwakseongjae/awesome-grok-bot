import { getTranslations } from "next-intl/server";
import { CopyButton } from "@/components/copy-button";
import { VISITOR_MARK_WRITE_URL, visitorMarkCurl } from "@/lib/visitor-mark-paste";

export const VisitorMarkPaste = async () => {
  const t = await getTranslations("visitors");
  const bot = await getTranslations("bot");
  const curl = visitorMarkCurl();

  return (
    <section id="leave-a-mark" className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{t("pasteTitle")}</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        {t("pasteLead", { url: VISITOR_MARK_WRITE_URL })}
      </p>
      <p className="text-sm leading-6 text-muted-foreground">{t("pasteHint")}</p>
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex justify-end">
          <CopyButton
            text={curl}
            label={bot("copy")}
            copiedLabel={bot("copied")}
            ariaLabel={t("copyPaste")}
            size="sm"
          />
        </div>
        <pre className="overflow-x-auto font-mono text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
          {curl}
        </pre>
      </div>
    </section>
  );
};
