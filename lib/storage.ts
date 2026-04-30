const BEST_STREAK_KEY = "otb:bestStreak";
const LAST_PLAYER_KEY = "otb:lastSoloPlayer";
const LAST_RESULT_KEY = "otb:lastChallenge";
const RECENT_SEEN_KEY = "otb:recentSeen";
const DAILY_KEY_PREFIX = "otb:daily:";

export const RECENT_SEEN_LIMIT = 50;

export type StoredChallenge = {
  seed: string;
  score: number;
  total: number;
  timeMs: number;
  completedAt: number;
};

function safeWindow(): Window | null {
  return typeof window !== "undefined" ? window : null;
}

export function getBestStreak(): number {
  const w = safeWindow();
  if (!w) return 0;
  const v = w.localStorage.getItem(BEST_STREAK_KEY);
  return v ? parseInt(v, 10) || 0 : 0;
}

export function setBestStreak(n: number) {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.setItem(BEST_STREAK_KEY, String(n));
}

export function getLastSoloPlayer(): string | null {
  const w = safeWindow();
  if (!w) return null;
  return w.localStorage.getItem(LAST_PLAYER_KEY);
}

export function setLastSoloPlayer(name: string) {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.setItem(LAST_PLAYER_KEY, name);
}

export function saveChallengeResult(r: StoredChallenge) {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(r));
}

export function getChallengeResult(): StoredChallenge | null {
  const w = safeWindow();
  if (!w) return null;
  const v = w.localStorage.getItem(LAST_RESULT_KEY);
  if (!v) return null;
  try {
    return JSON.parse(v) as StoredChallenge;
  } catch {
    return null;
  }
}

// Recently-seen player names. Most-recent is at the END of the array.
// Capped at RECENT_SEEN_LIMIT; pushing an existing name moves it to the end.
export function getRecentSeen(): string[] {
  const w = safeWindow();
  if (!w) return [];
  const v = w.localStorage.getItem(RECENT_SEEN_KEY);
  if (!v) return [];
  try {
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function pushRecentSeen(name: string): string[] {
  const w = safeWindow();
  if (!w) return [];
  const cur = getRecentSeen().filter((n) => n !== name);
  cur.push(name);
  const trimmed = cur.length > RECENT_SEEN_LIMIT ? cur.slice(-RECENT_SEEN_LIMIT) : cur;
  w.localStorage.setItem(RECENT_SEEN_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearRecentSeen() {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.removeItem(RECENT_SEEN_KEY);
}

// Daily-challenge per-day result. Key includes the YYYY-MM-DD date.
export function getDailyResult(dateKey: string): StoredChallenge | null {
  const w = safeWindow();
  if (!w) return null;
  const v = w.localStorage.getItem(DAILY_KEY_PREFIX + dateKey);
  if (!v) return null;
  try {
    return JSON.parse(v) as StoredChallenge;
  } catch {
    return null;
  }
}

export function saveDailyResult(dateKey: string, r: StoredChallenge) {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.setItem(DAILY_KEY_PREFIX + dateKey, JSON.stringify(r));
}
