import { GrokBotMark } from "@/components/grok-bot-mark";
import { MigrateLockup } from "@/components/migrate-lockup";
import type { GuideCardMediaKind } from "@/lib/guides";

type Props = {
  kind: GuideCardMediaKind;
};

export function GuideCardMedia({ kind }: Props) {
  if (kind === "hermes") return <MigrateLockup source="hermes" />;
  if (kind === "openclaw") return <MigrateLockup source="openclaw" />;
  return <GrokBotMark motion className="size-16" />;
}
