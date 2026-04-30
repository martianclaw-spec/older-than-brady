import { OG_CONTENT_TYPE, OG_SIZE, renderOG } from "@/lib/og";

export const runtime = "edge";
export const alt = "Older Than Brady? — Blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OG() {
  return renderOG({
    eyebrow: "Blog",
    title: "Stories, comparisons, and birthday trivia",
    subtitle: "From the Older Than Brady? guessing game.",
    accent: "amber"
  });
}
