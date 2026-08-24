import { getTranslations } from "next-intl/server";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { SEO_FAQ_KEYS, faqJsonLd } from "@/lib/seo";

export async function SiteFaq() {
  const t = await getTranslations("seo");
  const items = SEO_FAQ_KEYS.map((key) => ({
    q: t(`faq.${key}.q`),
    a: t(`faq.${key}.a`),
  }));

  return (
    <section className="space-y-4" aria-labelledby="faq-heading">
      <JsonLd data={faqJsonLd(items)} />
      <h2 id="faq-heading" className="text-xl font-semibold tracking-tight">
        {t("faqTitle")}
      </h2>
      <FaqList items={items} />
    </section>
  );
}
