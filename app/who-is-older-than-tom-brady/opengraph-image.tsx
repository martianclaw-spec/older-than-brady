import { OG_CONTENT_TYPE, OG_SIZE, renderOG } from "@/lib/og";

export const runtime = "edge";
export const alt = "Who Is Older Than Tom Brady?";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OG() {
  return renderOG({
    eyebrow: "Comparison",
    title: "Who Is Older Than Tom Brady?",
    subtitle: "30+ famous athletes ranked by birthdate vs. Tom Brady (Aug 3, 1977).",
    accent: "white"
  });
}
