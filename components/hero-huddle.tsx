"use client";

import { useEffect, useId, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GrokBotFace } from "@/components/grok-bot-face";
import { cn } from "@/lib/utils";

export type HuddleListing = {
  slug: string;
  name: string;
};

type Props = {
  listings: HuddleListing[];
};

type FaceItem = {
  id: string;
  href: string | null;
  name: string;
};

const FAN_MS = 420;
const SETTLE_MS = 880;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

function huddleRadius() {
  if (typeof window === "undefined") return 132;
  return window.matchMedia("(min-width: 640px)").matches ? 148 : 118;
}

function huddleTransform(index: number, total: number, isMascot: boolean, radius: number) {
  if (isMascot) return "translate(-50%, -50%) rotate(0deg)";
  const angle = -Math.PI / 2 + (index / Math.max(total, 1)) * Math.PI * 2;
  const x = Math.round(Math.cos(angle) * radius);
  const y = Math.round(Math.sin(angle) * radius * 0.92);
  return `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`;
}

function fanTransform(index: number, total: number) {
  const mid = (total - 1) / 2;
  const offset = index - mid;
  const rotate = offset * 7.5;
  const x = Math.round(offset * 26);
  const y = Math.round(Math.abs(offset) * 6 + 64);
  return `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg)`;
}

export function HeroHuddle({ listings }: Props) {
  const t = useTranslations("home");
  const a11y = useTranslations("a11y");
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const faces: FaceItem[] = [
    {
      id: "mascot",
      href: null,
      name: t("mascotName"),
    },
    ...listings.map((listing) => ({
      id: listing.slug,
      href: `/bots/${listing.slug}`,
      name: listing.name,
    })),
  ];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = [...root.querySelectorAll<HTMLElement>("[data-huddle-face]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const listingCount = Math.max(listings.length, 1);
    const radius = huddleRadius();

    const applyHuddle = () => {
      nodes.forEach((node, index) => {
        const isMascot = node.dataset.mascot === "true";
        const huddleIndex = isMascot ? 0 : index - 1;
        node.style.transform = huddleTransform(huddleIndex, listingCount, isMascot, radius);
      });
    };

    if (reduced) {
      applyHuddle();
      return;
    }

    nodes.forEach((node, index) => {
      node.style.transform = fanTransform(index, nodes.length);
    });

    const animations: Animation[] = [];
    const timer = window.setTimeout(() => {
      nodes.forEach((node, index) => {
        const isMascot = node.dataset.mascot === "true";
        const huddleIndex = isMascot ? 0 : index - 1;
        const animation = node.animate(
          [
            { transform: fanTransform(index, nodes.length) },
            { transform: huddleTransform(huddleIndex, listingCount, isMascot, radius) },
          ],
          { duration: SETTLE_MS, easing: EASE, fill: "forwards" },
        );
        animations.push(animation);
      });
    }, FAN_MS);

    return () => {
      window.clearTimeout(timer);
      animations.forEach((animation) => animation.cancel());
    };
  }, [listings.length]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto h-[22rem] w-full max-w-xl overflow-x-clip overflow-y-hidden sm:h-[24rem]"
      role="group"
      aria-labelledby={labelId}
    >
      <p id={labelId} className="sr-only">
        {a11y("huddle")}
      </p>
      {faces.map((face, index) => {
        const className = cn(
          "absolute top-1/2 left-1/2 block size-[4.5rem] overflow-hidden rounded-full border border-border bg-muted sm:size-20",
          "focus-visible:ring-3 focus-visible:ring-ring/50",
          face.href ? "cursor-pointer" : "cursor-default",
        );
        const image = <GrokBotFace name={face.name} decorative className="size-full" />;

        if (!face.href) {
          return (
            <div
              key={face.id}
              data-huddle-face
              data-mascot="true"
              className={className}
              style={{ zIndex: 20, transform: huddleTransform(0, listings.length, true, 132) }}
            >
              {image}
            </div>
          );
        }

        return (
          <Link
            key={face.id}
            href={face.href}
            data-huddle-face
            className={className}
            style={{ zIndex: 10 + index, transform: huddleTransform(index - 1, listings.length, false, 132) }}
            aria-label={face.name}
            tabIndex={0}
          >
            {image}
          </Link>
        );
      })}
    </div>
  );
}
