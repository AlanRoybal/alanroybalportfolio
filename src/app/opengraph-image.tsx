import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = "Alan Roybal — AI & Systems Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card generated at build time — no imported image asset. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0d0f",
          backgroundImage:
            "radial-gradient(60% 80% at 12% 18%, rgba(233,162,59,0.16), transparent 60%)",
          padding: "72px 80px",
          color: "#e7e3da",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#a7a294",
          }}
        >
          alanroybal.com
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 118,
              fontWeight: 700,
              lineHeight: 1.02,
              color: "#f5f1e8",
            }}
          >
            Alan Roybal
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 46,
              marginTop: 18,
              color: "#e9a23b",
            }}
          >
            {SITE.role}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              marginTop: 26,
              maxWidth: 900,
              color: "#a7a294",
            }}
          >
            New-grad SWE · MCP gateways · LLM evals · real-time GPU systems
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 24,
            color: "#6f6c63",
          }}
        >
          <span>github.com/alanroybal</span>
          <span>·</span>
          <span>Gemini Developer Spotlight</span>
          <span>·</span>
          <span>UT Dallas CS</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
