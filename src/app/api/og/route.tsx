import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const wpm = searchParams.get("wpm") || "0";
  const acc = searchParams.get("acc") || "0";
  const raw = searchParams.get("raw") || "0";
  const con = searchParams.get("con") || "0";
  const mode = searchParams.get("mode") || "time";
  const dur = searchParams.get("dur") || "30";
  const time = searchParams.get("time") || dur;
  const fixes = searchParams.get("fixes") || "0";

  const testLabel =
    mode === "time"
      ? `TIME ${dur}`
      : mode === "words"
      ? `WORDS ${dur}`
      : mode.toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 60px",
          fontFamily: "monospace",
          backgroundColor: "#121214",
          color: "#e8e6e3",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#6C93D9",
            }}
          >
            clackr
          </span>
          <span style={{ fontSize: "18px", color: "#8a8a8a" }}>
            clackr-plum.vercel.app
          </span>
        </div>

        {/* Main Stats */}
        <div
          style={{
            display: "flex",
            gap: "80px",
            alignItems: "flex-end",
          }}
        >
          {/* WPM */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "18px", color: "#8a8a8a", letterSpacing: "2px" }}
            >
              WPM
            </span>
            <span
              style={{
                fontSize: "120px",
                fontWeight: 800,
                color: "#6C93D9",
                lineHeight: "1",
                marginTop: "4px",
              }}
            >
              {wpm}
            </span>
          </div>

          {/* Accuracy */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "18px", color: "#8a8a8a", letterSpacing: "2px" }}
            >
              ACCURACY
            </span>
            <span
              style={{
                fontSize: "64px",
                fontWeight: 700,
                color: "#e8e6e3",
                lineHeight: "1",
                marginTop: "4px",
              }}
            >
              {acc}%
            </span>
          </div>

          {/* Test Type */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "18px", color: "#8a8a8a", letterSpacing: "2px" }}
            >
              TEST TYPE
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#6C93D9",
                lineHeight: "1",
                marginTop: "12px",
              }}
            >
              {testLabel}
            </span>
          </div>
        </div>

        {/* Bottom Stats */}
        <div
          style={{
            display: "flex",
            gap: "80px",
            borderTop: "1px solid #2a2a30",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "14px", color: "#8a8a8a", letterSpacing: "2px" }}
            >
              RAW
            </span>
            <span style={{ fontSize: "28px", fontWeight: 700 }}>{raw}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "14px", color: "#8a8a8a", letterSpacing: "2px" }}
            >
              CONSISTENCY
            </span>
            <span style={{ fontSize: "28px", fontWeight: 700 }}>{con}%</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "14px", color: "#8a8a8a", letterSpacing: "2px" }}
            >
              TIME
            </span>
            <span style={{ fontSize: "28px", fontWeight: 700 }}>{time}s</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "14px", color: "#8a8a8a", letterSpacing: "2px" }}
            >
              FIXES
            </span>
            <span style={{ fontSize: "28px", fontWeight: 700 }}>{fixes}</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
