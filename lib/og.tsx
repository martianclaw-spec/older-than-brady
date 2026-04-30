import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

type OGProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  accent?: "white" | "red" | "amber" | "emerald";
};

const ACCENTS = {
  white: "#ffffff",
  red: "#ff4d4d",
  amber: "#fbbf24",
  emerald: "#34d399"
} as const;

export function renderOG(props: OGProps) {
  const accent = ACCENTS[props.accent ?? "white"];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(circle at 80% 110%, #013369 0%, #07080b 55%), #07080b",
          color: "#f5f7fb",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "9999px",
              background: "#D50A0A"
            }}
          />
          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)"
            }}
          >
            Older Than Brady?
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {props.eyebrow ? (
            <div
              style={{
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)"
              }}
            >
              {props.eyebrow}
            </div>
          ) : null}
          <div
            style={{
              fontSize: props.title.length > 38 ? "76px" : "92px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: accent
            }}
          >
            {props.title}
          </div>
          {props.subtitle ? (
            <div
              style={{
                fontSize: "32px",
                lineHeight: 1.3,
                color: "rgba(255,255,255,0.78)",
                maxWidth: "950px"
              }}
            >
              {props.subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "rgba(255,255,255,0.55)",
            fontSize: "24px"
          }}
        >
          <div>older-than-brady.vercel.app</div>
          <div style={{ fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
            Tap. Guess. Win.
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
