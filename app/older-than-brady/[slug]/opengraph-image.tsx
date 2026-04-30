import { ageDiffLabel, isOlderThanBrady } from "@/lib/game";
import { findFeatured, FEATURED_ATHLETES } from "@/lib/featured";
import { PLAYERS } from "@/lib/players";
import { OG_CONTENT_TYPE, OG_SIZE, renderOG } from "@/lib/og";

export const runtime = "edge";
export const alt = "Is X Older Than Tom Brady?";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateImageMetadata() {
  return FEATURED_ATHLETES.map(() => ({ id: "default" }));
}

export default async function OG({ params }: { params: { slug: string } }) {
  const f = findFeatured(params.slug);
  const p = f ? PLAYERS.find((x) => x.name === f.name) : null;
  if (!f || !p) {
    return renderOG({
      eyebrow: "Comparison",
      title: "Older Than Brady?",
      subtitle: "Was the player born before Tom Brady or after?",
      accent: "white"
    });
  }
  const older = isOlderThanBrady(p.birthDate);
  const verb = older ? "OLDER" : "YOUNGER";
  const diff = ageDiffLabel(p.birthDate);
  return renderOG({
    eyebrow: `Is ${f.name} older than Tom Brady?`,
    title: `${older ? "Yes" : "No"} — ${verb} by ${diff}`,
    subtitle: f.tagline,
    accent: older ? "emerald" : "red"
  });
}
