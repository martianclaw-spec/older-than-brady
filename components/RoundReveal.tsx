"use client";

import {
  ageOn,
  ageDiffLabel,
  closeCallMessage,
  correctAnswer,
  isSpeedBonus,
  SPEED_BONUS_MS
} from "@/lib/game";
import { BRADY_BIRTH, BRADY_NAME, Player } from "@/lib/players";

type Props = {
  player: Player;
  correct: boolean;
  elapsedMs?: number;
};

export default function RoundReveal({ player, correct, elapsedMs }: Props) {
  const playerAge = ageOn(player.birthDate);
  const bradyAge = ageOn(BRADY_BIRTH);
  const diffLabel = ageDiffLabel(player.birthDate);
  const close = closeCallMessage(player.birthDate);
  const speed = elapsedMs != null && isSpeedBonus(elapsedMs, correct);

  return (
    <div className="w-full max-w-lg flex flex-col items-center gap-3 animate-slideUp">
      <div
        className={`w-full text-center rounded-2xl py-4 px-5 font-semibold text-lg border ${
          correct
            ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
            : "bg-rose-500/15 border-rose-400/40 text-rose-200"
        }`}
      >
        {correct ? "Correct!" : "Wrong."}{" "}
        <span className="text-white/80 font-normal">
          {player.name} is {correctAnswer(player.birthDate)} than Brady by {diffLabel}.
        </span>
      </div>

      {(close || speed) && (
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          {speed && (
            <span className="rounded-full px-3 py-1 bg-amber-400/15 border border-amber-300/40 text-amber-200">
              ⚡ Speed bonus — under {SPEED_BONUS_MS / 1000}s
            </span>
          )}
          {close && (
            <span className="rounded-full px-3 py-1 bg-fuchsia-400/15 border border-fuchsia-300/40 text-fuchsia-200">
              {close}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full text-sm mt-1">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
          <p className="text-white/50">{player.name}</p>
          <p className="font-bold text-lg">{playerAge}</p>
          <p className="text-xs text-white/40">{player.birthDate}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
          <p className="text-white/50">{BRADY_NAME}</p>
          <p className="font-bold text-lg">{bradyAge}</p>
          <p className="text-xs text-white/40">{BRADY_BIRTH}</p>
        </div>
      </div>
    </div>
  );
}
