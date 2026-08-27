import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND_MARK_DIR, BRAND_MARK_FILE } from "@/lib/brand";

export const runtime = "nodejs";
export const alt = "Awesome Grok Bot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const mark = await readFile(
    join(/* turbopackIgnore: true */ process.cwd(), BRAND_MARK_DIR, BRAND_MARK_FILE),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff",
          color: "#0a0a0a",
          padding: "72px",
          border: "1px solid #e5e5e5",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 720 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#525252",
            }}
          >
            GET YOUR GROK BOT.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 36,
              fontSize: 64,
              letterSpacing: -2,
              fontWeight: 600,
            }}
          >
            Awesome Grok Bot
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 26, color: "#525252" }}>
            Specialists and teams you put into Grok Bot.
          </div>
          <div style={{ display: "flex", marginTop: 8, fontSize: 26, color: "#525252" }}>
            Copy setup text. Hand off from Hermes or OpenClaw.
          </div>
          <div style={{ display: "flex", marginTop: 48, fontSize: 20 }}>getgrokbot.com</div>
        </div>
        <img
          src={`data:image/png;base64,${mark.toString("base64")}`}
          width={360}
          height={360}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
