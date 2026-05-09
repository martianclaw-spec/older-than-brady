import { ageDiffLabel, isOlderThanBrady } from "@/lib/game";
import { resolveAthlete } from "@/lib/featured";
import { PLAYERS } from "@/lib/players";
import { OG_CONTENT_TYPE, OG_SIZE, renderOG } from "@/lib/og";

export const runtime = "edge";
export const alt = "Is X Older Than Tom Brady?";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OG({ params }: { params: { slug: string } }) {
  const a = resolveAthlete(params.slug);
  const p = a ? PLAYERS.find((x) => x.name === a.name) : null;
  if (!a || !p) {
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
    eyebrow: `Is ${a.name} older than Tom Brady?`,
    title: `${older ? "Yes" : "No"} — ${verb} by ${diff}`,
    subtitle: a.tagline || `Born ${p.birthDate}`,
    accent: older ? "emerald" : "red"
  });
}
