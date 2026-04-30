import raw from "@/data/players.json";

export type Player = {
  name: string;
  birthDate: string;
  imageUrl: string;
};

const NFL_NAVY = "013369";

export function imageUrlFor(name: string): string {
  const q = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${q}&size=400&background=${NFL_NAVY}&color=ffffff&bold=true&format=svg`;
}

export const PLAYERS: Player[] = (raw as { name: string; birthDate: string }[]).map(
  (p) => ({ ...p, imageUrl: imageUrlFor(p.name) })
);

export const BRADY_BIRTH = "1977-08-03";
export const BRADY_NAME = "Tom Brady";
export const BRADY_IMAGE = imageUrlFor(BRADY_NAME);
