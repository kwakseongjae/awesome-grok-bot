import { ImageResponse } from "next/og";
import en from "@/messages/en.json";

export const runtime = "nodejs";
export const alt = "Grok Bot — sponsor-free directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#0a0a0a",
          padding: "72px",
          border: "1px solid #e5e5e5",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#525252",
          }}
        >
          GROK BOT
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 80, letterSpacing: -2, fontWeight: 600 }}>Grok Bot</div>
          <div style={{ fontSize: 28, color: "#525252", maxWidth: 860 }}>
            {en.meta.description}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
