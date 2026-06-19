import { ImageResponse } from "next/og";

// Default social card for every route (1200×630). Routes can override with
// their own opengraph-image. No binary asset needed — rendered on demand.
export const alt = "Chula Vista FC — Shaping Players. Inspiring Futures.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#061c48",
        padding: "80px",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#a08629",
          fontSize: 28,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Est. 1982 · Chula Vista, California
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          Chula Vista FC
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 42,
            color: "#a08629",
            marginTop: 16,
          }}
        >
          Shaping Players. Inspiring Futures.
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#c7d0e0" }}>
        MLS NEXT · Elite Academy · DPL · NPL — South Bay San Diego
      </div>
    </div>,
    { ...size },
  );
}
