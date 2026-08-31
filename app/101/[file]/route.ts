import { readFileSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { isDocLang, loadDocMarkdown } from "@/lib/doc-md";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ file: string }> };

export async function GET(_req: Request, { params }: Props) {
  const { file } = await params;
  const match = /^(en|ko)\.(md|pdf)$/.exec(file);
  if (!match || !isDocLang(match[1])) {
    return new NextResponse("Not found", { status: 404 });
  }
  const lang = match[1];
  const kind = match[2];
  if (kind === "md") {
    const body = loadDocMarkdown(lang);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="grok-bot-101-${lang}.md"`,
      },
    });
  }
  const pdfPath = join(process.cwd(), "public/101", `${lang}.pdf`);
  try {
    const buf = readFileSync(pdfPath);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="grok-bot-101-${lang}.pdf"`,
      },
    });
  } catch {
    return new NextResponse("PDF not built yet. Use Markdown and export.", { status: 404 });
  }
}
