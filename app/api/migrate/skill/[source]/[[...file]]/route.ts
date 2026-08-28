import { isAppLocale } from "@/lib/locales";
import { SKILL_FILE, assertSkillMarkdown, renderSkillMarkdown } from "@/lib/migrate/skill-md";
import { isHandoffSource } from "@/lib/migrate/source";
import type { ListingLocale } from "@/lib/types";

type Props = {
  params: Promise<{ source: string; file?: string[] }>;
};

const skillHeaders = (source: string) => ({
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=60",
  "Content-Disposition": `inline; filename="${source}-grok-bot-migrate.${SKILL_FILE}"`,
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "X-Content-Type-Options": "nosniff",
});

const extraPathOk = (file?: string[]) => {
  if (!file || file.length === 0) return true;
  return file.length === 1 && file[0].toLowerCase() === SKILL_FILE.toLowerCase();
};

export const GET = async (request: Request, { params }: Props) => {
  const { source, file } = await params;
  if (!isHandoffSource(source) || !extraPathOk(file)) {
    return Response.json({ error: "Unknown source." }, { status: 404 });
  }

  const localeParam = new URL(request.url).searchParams.get("locale");
  const locale: ListingLocale = isAppLocale(localeParam) ? localeParam : "en";
  const markdown = renderSkillMarkdown(source, locale);
  const missing = assertSkillMarkdown(markdown, source);
  if (missing.length > 0) {
    return Response.json({ error: "Skill failed checks.", missing }, { status: 500 });
  }

  return new Response(markdown, { headers: skillHeaders(source) });
};

export const HEAD = async (request: Request, ctx: Props) => {
  const response = await GET(request, ctx);
  return new Response(null, { status: response.status, headers: response.headers });
};

export const OPTIONS = () =>
  new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
