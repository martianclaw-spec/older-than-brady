import { OG_CONTENT_TYPE, OG_SIZE, renderOG } from "@/lib/og";

export const runtime = "edge";
export const alt = "Older Than Brady?";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OG() {
  return renderOG({
    eyebrow: "NFL trivia game",
    title: "Older Than Brady?",
    subtitle: "Was the player born before Tom Brady (Aug 3, 1977) or after?",
    accent: "red"
  });
}
