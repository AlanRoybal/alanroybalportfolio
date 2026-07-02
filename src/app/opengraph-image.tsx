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
          background: "#f5f1e8",
          backgroundImage:
            "radial-gradient(60% 80% at 12% 18%, rgba(185,125,34,0.18), transparent 60%)",
          padding: "72px 80px",
          color: "#2f3338",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#85806f",
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
              color: "#16181b",
            }}
          >
            Alan Roybal
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 46,
              marginTop: 18,
              color: "#b97d22",
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
              color: "#5d5a50",
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
            color: "#85806f",
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
