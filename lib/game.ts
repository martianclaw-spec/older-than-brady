import { PLAYERS, Player, BRADY_BIRTH } from "./players";

export type Choice = "older" | "younger";

export function isOlderThanBrady(birthDate: string): boolean {
  return birthDate < BRADY_BIRTH;
}

export function correctAnswer(birthDate: string): Choice {
  return isOlderThanBrady(birthDate) ? "older" : "younger";
}

export function ageOn(birthDate: string, on = new Date()): number {
  const b = new Date(birthDate + "T00:00:00Z");
  let age = on.getUTCFullYear() - b.getUTCFullYear();
  const m = on.getUTCMonth() - b.getUTCMonth();
  if (m < 0 || (m === 0 && on.getUTCDate() < b.getUTCDate())) age--;
  return age;
}

export function ageDiffLabel(birthDate: string): string {
  const b = new Date(birthDate + "T00:00:00Z").getTime();
  const brady = new Date(BRADY_BIRTH + "T00:00:00Z").getTime();
  const diffMs = Math.abs(b - brady);
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (days < 31) return `${days} day${days === 1 ? "" : "s"}`;
  const months = Math.round(days / 30.44);
  if (months < 24) return `${months} month${months === 1 ? "" : "s"}`;
  const years = Math.floor(days / 365.25);
  const remMonths = Math.round((days - years * 365.25) / 30.44);
  if (remMonths === 0 || remMonths === 12) return `${years} year${years === 1 ? "" : "s"}`;
  return `${years}y ${remMonths}mo`;
}

// --- Seeded random (Mulberry32) ----------------------------------------
function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seedNum: number) {
  let t = seedNum >>> 0;
  return function rand() {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleSeeded<T>(arr: T[], seed: string): T[] {
  const out = arr.slice();
  const rand = mulberry32(hashSeed(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffleRandom<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// --- Modes -------------------------------------------------------------
export const CHALLENGE_ROUNDS = 10;

export function buildChallengeQueue(seed: string): Player[] {
  return shuffleSeeded(PLAYERS, seed).slice(0, CHALLENGE_ROUNDS);
}

export function buildSoloQueue(): Player[] {
  return shuffleRandom(PLAYERS);
}

// Avoid immediate repeat: if last solo player matches first of new queue,
// rotate the queue by one.
export function avoidImmediateRepeat(queue: Player[], lastName?: string | null): Player[] {
  if (!lastName || queue.length < 2) return queue;
  if (queue[0]?.name === lastName) {
    const [first, ...rest] = queue;
    return [...rest, first];
  }
  return queue;
}

export function generateSeed(): string {
  // Short, URL-safe, base36
  const a = Math.floor(Math.random() * 36 ** 4).toString(36).padStart(4, "0");
  const b = Math.floor(Math.random() * 36 ** 4).toString(36).padStart(4, "0");
  return `${a}${b}`;
}
