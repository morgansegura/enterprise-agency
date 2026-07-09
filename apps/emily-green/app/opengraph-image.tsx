import { ImageResponse } from "next/og";

import { site } from "@/site.config";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card — brand teal, live text (no asset dependency). */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "96px",
        background: "#064952",
        color: "#ffffff",
        fontFamily: "serif",
      }}
    >
      <div
        style={{
          fontSize: 34,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#e7dfd4",
        }}
      >
        {site.name}
      </div>
      <div style={{ fontSize: 88, lineHeight: 1.05, marginTop: 24 }}>
        {site.tagline}
      </div>
      <div
        style={{
          fontSize: 30,
          marginTop: 40,
          color: "#aab8b4",
          fontFamily: "sans-serif",
        }}
      >
        {`Boise-area mortgage broker · Churchill Mortgage · NMLS #${site.founder.nmls}`}
      </div>
    </div>,
    size,
  );
}
