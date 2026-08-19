import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  size?: number;
  decorative?: boolean;
  motion?: boolean;
  className?: string;
};

export function GrokBotFace({
  name,
  size,
  decorative = false,
  motion = false,
  className,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const sphereId = `${uid}-sphere`;
  const shadeId = `${uid}-shade`;
  const specId = `${uid}-spec`;

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full",
        motion && "grok-bot-face-motion",
        className,
      )}
      style={size ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 64 64"
        className="block size-full"
        role={decorative ? undefined : "img"}
        aria-hidden={decorative ? true : undefined}
        aria-label={decorative ? undefined : name}
      >
        <defs>
          <radialGradient id={sphereId} cx="36%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#f7f7f7" />
            <stop offset="78%" stopColor="#e4e4e4" />
            <stop offset="100%" stopColor="#c8c8c8" />
          </radialGradient>
          <radialGradient id={shadeId} cx="70%" cy="78%" r="55%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
            <stop offset="55%" stopColor="#000000" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={specId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="31" fill={`url(#${sphereId})`} />
        <circle cx="32" cy="32" r="31" fill={`url(#${shadeId})`} />
        <ellipse cx="23.5" cy="18.5" rx="9" ry="5.5" fill={`url(#${specId})`} />
        <g className="grok-bot-eyes">
          <rect x="21.5" y="23.5" width="7" height="15" rx="3.5" fill="#0a0a0a" />
          <rect x="35.5" y="23.5" width="7" height="15" rx="3.5" fill="#0a0a0a" />
          <rect x="23.2" y="25.2" width="1.6" height="4.2" rx="0.8" fill="#ffffff" opacity="0.28" />
          <rect x="37.2" y="25.2" width="1.6" height="4.2" rx="0.8" fill="#ffffff" opacity="0.28" />
        </g>
      </svg>
    </span>
  );
}
