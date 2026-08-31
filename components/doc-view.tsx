import { DocInline } from "@/components/doc-inline";
import { PdfPreview } from "@/components/pdf-preview";
import { buttonVariants } from "@/components/ui/button";
import type { DocLang, DocNode } from "@/lib/doc-md";
import { loadDoc } from "@/lib/doc-md";
import { cn } from "@/lib/utils";

const TAG = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
} as const;

function Node({ node }: { node: DocNode }) {
  if (node.type === "h1" || node.type === "h2" || node.type === "h3") {
    const Tag = TAG[node.type];
    const cls =
      node.type === "h1"
        ? "text-4xl font-semibold tracking-tight"
        : node.type === "h2"
          ? "scroll-mt-20 pt-4 text-xl font-semibold tracking-tight"
          : "scroll-mt-20 pt-2 text-base font-semibold tracking-tight";
    return (
      <Tag id={node.id} className={cls}>
        {node.text}
      </Tag>
    );
  }
  if (node.type === "p") {
    return (
      <p className="text-sm leading-7 text-muted-foreground">
        <DocInline text={node.text} />
      </p>
    );
  }
  if (node.type === "quote") {
    return (
      <blockquote className="border-l pl-4 text-sm leading-7 text-muted-foreground">
        <DocInline text={node.text} />
      </blockquote>
    );
  }
  if (node.type === "hr") {
    return <hr className="border-border" />;
  }
  if (node.type === "img") {
    if (node.missing) {
      return (
        <p className="rounded-lg border border-dashed px-4 py-8 text-center font-mono text-xs text-muted-foreground">
          Image slot · {node.alt || node.src}
        </p>
      );
    }
    return (
      <figure className="overflow-hidden rounded-lg border bg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/101/${node.src}`} alt={node.alt} className="h-auto w-full" />
        {node.alt ? (
          <figcaption className="border-t px-4 py-2 text-xs text-muted-foreground">{node.alt}</figcaption>
        ) : null}
      </figure>
    );
  }
  if (node.type !== "ul" && node.type !== "ol") return null;
  const List = node.type === "ol" ? "ol" : "ul";
  return (
    <List className={`${node.type === "ol" ? "list-decimal" : "list-disc"} space-y-1.5 pl-5 text-sm leading-7 text-muted-foreground`}>
      {node.items.map((item, index) => (
        <li key={index}>
          <DocInline text={item} />
        </li>
      ))}
    </List>
  );
}

export function DocView({
  lang,
  otherLabel,
  eyebrow,
  tocLabel,
}: {
  lang: DocLang;
  otherLabel: string;
  eyebrow: string;
  tocLabel: string;
}) {
  const { meta, nodes, toc } = loadDoc(lang);
  const other: DocLang = lang === "en" ? "ko" : "en";
  const updated = meta.updated
    ? new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeZone: "Asia/Seoul" }).format(new Date(meta.updated))
    : "";

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{meta.title}</h1>
        <p className="font-mono text-xs text-muted-foreground">
          v{meta.version}
          {updated ? ` · ${updated}` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <a href={`/101/${lang}.md`} className={cn(buttonVariants())} download>
            Markdown
          </a>
          <PdfPreview lang={lang} />
          <a href={`/${other}/101`} className={cn(buttonVariants({ variant: "outline" }))}>
            {otherLabel}
          </a>
        </div>
      </header>
      <nav className="space-y-2 border-y py-6">
        <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">{tocLabel}</p>
        <ol className="list-none space-y-1 text-sm">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {nodes
        .filter((node) => node.type !== "h1")
        .map((node, index) => (
          <Node key={index} node={node} />
        ))}
    </article>
  );
}
