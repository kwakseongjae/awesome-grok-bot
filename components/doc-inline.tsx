import type { ReactNode } from "react";

const LINK = /\[([^\]]+)\]\((https?:[^)]+|\/[^)]+)\)/g;
const BOLD = /\*\*([^*]+)\*\*/g;
const CODE = /`([^`]+)`/g;

export function DocInline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const cursor = { i: 0 };
  const push = (s: string) => {
    if (!s) return;
    const withCode: ReactNode[] = [];
    let last = 0;
    for (const m of s.matchAll(CODE)) {
      if (m.index === undefined) continue;
      if (m.index > last) withCode.push(s.slice(last, m.index));
      withCode.push(
        <code key={`c-${cursor.i++}`} className="font-mono text-[0.85em]">
          {m[1]}
        </code>,
      );
      last = m.index + m[0].length;
    }
    if (last < s.length) withCode.push(s.slice(last));
    const bolded: ReactNode[] = [];
    for (const chunk of withCode) {
      if (typeof chunk !== "string") {
        bolded.push(chunk);
        continue;
      }
      let bLast = 0;
      for (const m of chunk.matchAll(BOLD)) {
        if (m.index === undefined) continue;
        if (m.index > bLast) bolded.push(chunk.slice(bLast, m.index));
        bolded.push(
          <strong key={`b-${cursor.i++}`} className="font-semibold text-foreground">
            {m[1]}
          </strong>,
        );
        bLast = m.index + m[0].length;
      }
      if (bLast < chunk.length) bolded.push(chunk.slice(bLast));
    }
    parts.push(...bolded);
  };

  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (m.index === undefined) continue;
    if (m.index > last) push(text.slice(last, m.index));
    const href = m[2];
    const external = href.startsWith("http");
    parts.push(
      <a
        key={`a-${cursor.i++}`}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="font-medium underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {m[1]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) push(text.slice(last));
  return <>{parts}</>;
}
