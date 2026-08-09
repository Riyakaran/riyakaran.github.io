import { ImageResponse } from "next/og";
import { profile } from "@/data/resume";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#FAF9FB",
          color: "#2E2A3D",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 24,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#C2410C",
            marginBottom: 24,
          }}
        >
          {profile.name}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          Turning ambiguity into shipped roadmaps.
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 32, color: "#635D72" }}>
          {profile.role} · {profile.location}
        </div>
      </div>
    ),
    { ...size }
  );
}
