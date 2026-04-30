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
  red: "#ff5b5b",
  amber: "#fbbf24",
  emerald: "#34d399"
} as const;

// Solid colors only — Satori is picky about gradients in the edge runtime,
// and custom fonts require an explicit fetch (omitted for reliability and
// faster first-paint; system fallback is fine for short, large headlines).
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
          backgroundColor: "#013369",
          color: "#f5f7fb"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "9999px",
              backgroundColor: "#D50A0A",
              marginRight: "16px"
            }}
          />
          <div
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.75)",
              display: "flex"
            }}
          >
            OLDER THAN BRADY?
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {props.eyebrow ? (
            <div
              style={{
                fontSize: "26px",
                fontWeight: 600,
                letterSpacing: "3px",
                color: "rgba(255,255,255,0.6)",
                marginBottom: "20px",
                display: "flex"
              }}
            >
              {props.eyebrow.toUpperCase()}
            </div>
          ) : null}
          <div
            style={{
              fontSize: props.title.length > 40 ? "72px" : "92px",
              fontWeight: 900,
              lineHeight: 1.05,
              color: accent,
              display: "flex"
            }}
          >
            {props.title}
          </div>
          {props.subtitle ? (
            <div
              style={{
                fontSize: "30px",
                lineHeight: 1.3,
                color: "rgba(255,255,255,0.78)",
                maxWidth: "950px",
                marginTop: "24px",
                display: "flex"
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
            fontSize: "22px"
          }}
        >
          <div style={{ display: "flex" }}>older-than-brady.vercel.app</div>
          <div
            style={{
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              display: "flex"
            }}
          >
            Tap. Guess. Win.
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
