import { isAppLocale } from "@/lib/locales";
import { assertSkillMarkdown, renderSkillMarkdown } from "@/lib/migrate/skill-md";
import { isHandoffSource } from "@/lib/migrate/source";
import type { ListingLocale } from "@/lib/types";

type Props = {
  params: Promise<{ source: string }>;
};

export const GET = async (request: Request, { params }: Props) => {
  const { source } = await params;
  if (!isHandoffSource(source)) {
    return Response.json({ error: "Unknown source." }, { status: 404 });
  }

  const localeParam = new URL(request.url).searchParams.get("locale");
  const locale: ListingLocale = isAppLocale(localeParam) ? localeParam : "en";
  const markdown = renderSkillMarkdown(source, locale);
  const missing = assertSkillMarkdown(markdown, source);
  if (missing.length > 0) {
    return Response.json({ error: "Skill failed checks.", missing }, { status: 500 });
  }

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      "Content-Disposition": `inline; filename="${source}-grok-bot-migrate.SKILL.md"`,
    },
  });
};
