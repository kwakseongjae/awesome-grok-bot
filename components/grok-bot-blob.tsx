"use client";

import { useEffect, useId, useRef } from "react";
import { renderBlob, type BotSkin } from "@/lib/grok-bot-blob";
import { cn } from "@/lib/utils";

type Props = {
  skin: BotSkin;
  name: string;
  size?: number;
  decorative?: boolean;
  motion?: boolean;
  play?: boolean;
  phase?: number;
  className?: string;
};

export function GrokBotBlob({
  skin,
  name,
  size,
  decorative = false,
  motion = false,
  play = false,
  phase = 0,
  className,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const clipId = `${uid}-blob`;
  const blob = renderBlob(skin);
  const bodyRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const eyeRefs = useRef<Array<SVGPathElement | null>>([]);

  useEffect(() => {
    if (!play) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const started = performance.now();
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      if (now - last < 33) return;
      last = now;
      const next = renderBlob(skin, (now - started) / 1000, phase);
      bodyRef.current?.setAttribute("d", next.bodyPath);
      clipRef.current?.setAttribute("d", next.bodyPath);
      next.eyes.forEach((eye, index) => {
        const node = eyeRefs.current[index];
        if (!node) return;
        node.setAttribute("d", eye.d);
        node.setAttribute("transform", eye.matrix);
      });
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phase, play, skin]);

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-visible",
        motion && "grok-bot-blob-motion",
        className,
      )}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox={blob.viewBox}
        className="block size-full overflow-visible"
        role={decorative ? undefined : "img"}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : name}
      >
        <defs>
          <clipPath id={clipId}>
            <path ref={clipRef} d={blob.bodyPath} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <path ref={bodyRef} d={blob.bodyPath} fill={blob.bodyFill} />
          <g className={play ? undefined : "grok-bot-blob-eyes"}>
            {blob.eyes.map((eye, index) => (
              <path
                key={`${eye.matrix}-${index}`}
                ref={(node) => {
                  eyeRefs.current[index] = node;
                }}
                d={eye.d}
                transform={eye.matrix}
                fill={blob.eyeFill}
              />
            ))}
          </g>
        </g>
      </svg>
    </span>
  );
}
