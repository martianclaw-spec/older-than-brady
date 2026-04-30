import raw from "@/data/players.json";

export type Category = "nfl" | "nba" | "mlb" | "golf" | "tennis" | "celebrity";

export type Player = {
  name: string;
  birthDate: string;
  category: Category;
  imageUrl: string;
};

const NFL_NAVY = "013369";

export function imageUrlFor(name: string): string {
  const q = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${q}&size=400&background=${NFL_NAVY}&color=ffffff&bold=true&format=svg`;
}

type RawPlayer = { name: string; birthDate: string; category?: Category };

export const PLAYERS: Player[] = (raw as RawPlayer[]).map((p) => ({
  name: p.name,
  birthDate: p.birthDate,
  category: p.category ?? "nfl",
  imageUrl: imageUrlFor(p.name)
}));

export const BRADY_BIRTH = "1977-08-03";
export const BRADY_NAME = "Tom Brady";
export const BRADY_IMAGE = imageUrlFor(BRADY_NAME);
