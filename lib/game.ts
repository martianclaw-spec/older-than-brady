import { PLAYERS, Player, Category, BRADY_BIRTH } from "./players";

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

// --- Weighted category selection ---------------------------------------
// Top-level weights: 75% NFL, 15% other athlete, 10% celebrity.
// Within "other athlete", the four leagues split equally.
type GroupKey = "nfl" | "other" | "celebrity";

const TOP_WEIGHTS: Array<[GroupKey, number]> = [
  ["nfl", 0.75],
  ["other", 0.15],
  ["celebrity", 0.10]
];

const OTHER_CATEGORIES: Category[] = ["nba", "mlb", "golf", "tennis"];

function weightedPick<T>(rand: () => number, options: Array<[T, number]>): T {
  const total = options.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [val, w] of options) {
    r -= w;
    if (r <= 0) return val;
  }
  return options[options.length - 1][0];
}

function pickCategory(rand: () => number): Category {
  const group = weightedPick(rand, TOP_WEIGHTS);
  if (group === "nfl") return "nfl";
  if (group === "celebrity") return "celebrity";
  return OTHER_CATEGORIES[Math.floor(rand() * OTHER_CATEGORIES.length)];
}

function shuffleWith<T>(arr: T[], rand: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Each category holds two stacks: `fresh` (not recently seen) and `stale`
// (recently seen). We always prefer fresh; stale is a fallback so the pool
// can still be exhausted when freshness alone runs out within a bucket.
type Bucket = { fresh: Player[]; stale: Player[] };
type Buckets = Record<Category, Bucket>;

function bucketByCategory(rand: () => number, recent: Set<string>): Buckets {
  const groups: Buckets = {
    nfl: { fresh: [], stale: [] },
    nba: { fresh: [], stale: [] },
    mlb: { fresh: [], stale: [] },
    golf: { fresh: [], stale: [] },
    tennis: { fresh: [], stale: [] },
    celebrity: { fresh: [], stale: [] }
  };
  for (const p of PLAYERS) {
    const b = groups[p.category];
    (recent.has(p.name) ? b.stale : b.fresh).push(p);
  }
  for (const k of Object.keys(groups) as Category[]) {
    groups[k].fresh = shuffleWith(groups[k].fresh, rand);
    groups[k].stale = shuffleWith(groups[k].stale, rand);
  }
  return groups;
}

function bucketSize(b: Bucket): number {
  return b.fresh.length + b.stale.length;
}

function nonEmpty(buckets: Buckets): Category[] {
  return (Object.keys(buckets) as Category[]).filter((k) => bucketSize(buckets[k]) > 0);
}

function popFromBucket(b: Bucket): Player {
  // Prefer fresh; fall back to stale within the same category.
  return (b.fresh.length > 0 ? b.fresh.pop() : b.stale.pop()) as Player;
}

// Build a queue of length `n` (capped at pool size) using weighted-by-category
// sampling without repeats. Within each category, not-recently-seen players
// come first; recently-seen players are appended as fallback. If the chosen
// category is exhausted, fall back to any remaining category so the pool is
// fully consumed.
function buildWeightedQueue(
  rand: () => number,
  n: number,
  recent: Set<string> = new Set()
): Player[] {
  const buckets = bucketByCategory(rand, recent);
  const out: Player[] = [];
  const cap = Math.min(n, PLAYERS.length);
  while (out.length < cap) {
    const remaining = nonEmpty(buckets);
    if (remaining.length === 0) break;
    let cat = pickCategory(rand);
    if (bucketSize(buckets[cat]) === 0) {
      cat = remaining[Math.floor(rand() * remaining.length)];
    }
    out.push(popFromBucket(buckets[cat]));
  }
  return out;
}

// --- Modes -------------------------------------------------------------
export const CHALLENGE_ROUNDS = 10;

// Challenge is intentionally NOT filtered by recently-seen: two players with
// the same seed must get an identical 10-player lineup.
export function buildChallengeQueue(seed: string): Player[] {
  const rand = mulberry32(hashSeed(seed));
  return buildWeightedQueue(rand, CHALLENGE_ROUNDS);
}

export function buildSoloQueue(recentlySeen: Iterable<string> = []): Player[] {
  return buildWeightedQueue(Math.random, PLAYERS.length, new Set(recentlySeen));
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
