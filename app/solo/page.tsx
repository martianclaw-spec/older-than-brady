"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import BradyHeader from "@/components/BradyHeader";
import PlayerCard from "@/components/PlayerCard";
import ChoiceButtons from "@/components/ChoiceButtons";
import {
  ageDiffLabel,
  ageOn,
  avoidImmediateRepeat,
  buildSoloQueue,
  Choice,
  correctAnswer
} from "@/lib/game";
import { BRADY_BIRTH, BRADY_NAME, Player } from "@/lib/players";
import {
  getBestStreak,
  getLastSoloPlayer,
  setBestStreak,
  setLastSoloPlayer
} from "@/lib/storage";

type Phase = "answering" | "revealing";

export default function SoloPage() {
  const [queue, setQueue] = useState<Player[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [chosen, setChosen] = useState<Choice | null>(null);

  // Init: build a queue, avoid immediate repeat from prior session
  useEffect(() => {
    const initial = avoidImmediateRepeat(buildSoloQueue(), getLastSoloPlayer());
    setQueue(initial);
    setBest(getBestStreak());
  }, []);

  const current = queue[index];

  const reshuffleIfNeeded = useCallback(
    (q: Player[], i: number) => {
      if (i < q.length) return { q, i };
      const next = avoidImmediateRepeat(buildSoloQueue(), q[q.length - 1]?.name ?? null);
      return { q: next, i: 0 };
    },
    []
  );

  const advance = () => {
    const next = reshuffleIfNeeded(queue, index + 1);
    setQueue(next.q);
    setIndex(next.i);
    setPhase("answering");
    setChosen(null);
  };

  const handle = (c: Choice) => {
    if (!current || phase !== "answering") return;
    setChosen(c);
    setPhase("revealing");
    const correct = c === correctAnswer(current.birthDate);
    setLastSoloPlayer(current.name);
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > best) {
        setBest(newStreak);
        setBestStreak(newStreak);
      }
    } else {
      setStreak(0);
    }
  };

  const isCorrect = useMemo(() => {
    if (!current || !chosen) return null;
    return chosen === correctAnswer(current.birthDate);
  }, [current, chosen]);

  if (!current) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </div>
    );
  }

  const playerAge = ageOn(current.birthDate);
  const bradyAge = ageOn(BRADY_BIRTH);
  const diffLabel = ageDiffLabel(current.birthDate);

  return (
    <div className="flex-1 flex flex-col">
      <BradyHeader subtitle="Solo" />

      <div className="flex items-center justify-between max-w-2xl w-full mx-auto px-5">
        <div className="text-sm">
          <span className="text-white/50">Streak </span>
          <span className="font-bold text-white">{streak}</span>
        </div>
        <div className="text-sm">
          <span className="text-white/50">Best </span>
          <span className="font-bold text-white">{best}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 gap-8">
        <PlayerCard
          player={current}
          reveal={phase === "revealing"}
          ageLabel={phase === "revealing" ? `${playerAge} years old` : undefined}
        />

        {phase === "answering" ? (
          <ChoiceButtons onChoose={handle} />
        ) : (
          <div className="w-full max-w-lg flex flex-col items-center gap-5 animate-slideUp">
            <div
              className={`w-full text-center rounded-2xl py-4 px-5 font-semibold text-lg border ${
                isCorrect
                  ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"
                  : "bg-rose-500/15 border-rose-400/40 text-rose-200"
              }`}
            >
              {isCorrect ? "Correct!" : "Wrong."}{" "}
              <span className="text-white/80 font-normal">
                {current.name} is {correctAnswer(current.birthDate)} than Brady by {diffLabel}.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-white/50">{current.name}</p>
                <p className="font-bold text-lg">{playerAge}</p>
                <p className="text-xs text-white/40">{current.birthDate}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                <p className="text-white/50">{BRADY_NAME}</p>
                <p className="font-bold text-lg">{bradyAge}</p>
                <p className="text-xs text-white/40">{BRADY_BIRTH}</p>
              </div>
            </div>

            <button
              onClick={advance}
              className="btn-base w-full rounded-2xl py-4 text-lg font-semibold bg-white text-black"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
