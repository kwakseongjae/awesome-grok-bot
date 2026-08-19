import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Grok Book — sponsor-free Grok Bot directory";
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
          background: "#2c2118",
          color: "#f4ead7",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 84,
            height: 84,
            borderRadius: 18,
            background: "#f4ead7",
            alignItems: "center",
            justifyContent: "center",
            color: "#c45c26",
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          GB
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 88, letterSpacing: -2 }}>Grok Book</div>
          <div style={{ fontSize: 32, color: "#e2d2b8", maxWidth: 860 }}>
            A sponsor-free Grok Bot directory. Copy a charter. Paste it into Grok Bot.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
