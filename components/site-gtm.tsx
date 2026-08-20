import { GoogleTagManager } from "@next/third-parties/google";
import { getGtmId } from "@/lib/env";

export function SiteGtm() {
  const gtmId = getGtmId();
  if (!gtmId) return null;
  return <GoogleTagManager gtmId={gtmId} />;
}
