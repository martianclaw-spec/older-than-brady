const BEST_STREAK_KEY = "otb:bestStreak";
const LAST_PLAYER_KEY = "otb:lastSoloPlayer";
const LAST_RESULT_KEY = "otb:lastChallenge";

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
