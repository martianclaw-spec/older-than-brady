"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BradyHeader from "@/components/BradyHeader";
import PlayerCard from "@/components/PlayerCard";
import ChoiceButtons from "@/components/ChoiceButtons";
import RoundReveal from "@/components/RoundReveal";
import {
  avoidImmediateRepeat,
  buildSoloQueue,
  Choice,
  correctAnswer
} from "@/lib/game";
import { Player } from "@/lib/players";
import {
  getBestStreak,
  getLastSoloPlayer,
  getRecentSeen,
  pushRecentSeen,
  setBestStreak,
  setLastSoloPlayer
} from "@/lib/storage";

type Phase = "answering" | "revealing" | "gameOver";

export default function SoloPage() {
  const [queue, setQueue] = useState<Player[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [roundElapsed, setRoundElapsed] = useState<number | null>(null);
  const [losingPlayer, setLosingPlayer] = useState<Player | null>(null);
  const roundStartRef = useRef<number | null>(null);

  const startRun = () => {
    const initial = avoidImmediateRepeat(
      buildSoloQueue(getRecentSeen()),
      getLastSoloPlayer()
    );
    setQueue(initial);
    setIndex(0);
    setStreak(0);
    setPhase("answering");
    setChosen(null);
    setRoundElapsed(null);
    setLosingPlayer(null);
    roundStartRef.current = Date.now();
  };

  useEffect(() => {
    setBest(getBestStreak());
    startRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = queue[index];

  const handle = (c: Choice) => {
    if (!current || phase !== "answering") return;
    const elapsed = roundStartRef.current ? Date.now() - roundStartRef.current : 0;
    setRoundElapsed(elapsed);
    setChosen(c);
    setPhase("revealing");
    const correct = c === correctAnswer(current.birthDate);
    setLastSoloPlayer(current.name);
    pushRecentSeen(current.name);
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > best) {
        setBest(newStreak);
        setBestStreak(newStreak);
      }
    } else {
      setLosingPlayer(current);
    }
  };

  const advance = () => {
    if (chosen && current && chosen !== correctAnswer(current.birthDate)) {
      setPhase("gameOver");
      return;
    }
    let nextIdx = index + 1;
    let nextQueue = queue;
    if (nextIdx >= queue.length) {
      nextQueue = avoidImmediateRepeat(
        buildSoloQueue(getRecentSeen()),
        queue[queue.length - 1]?.name ?? null
      );
      nextIdx = 0;
      setQueue(nextQueue);
    }
    setIndex(nextIdx);
    setPhase("answering");
    setChosen(null);
    setRoundElapsed(null);
    roundStartRef.current = Date.now();
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

  if (phase === "gameOver" && losingPlayer) {
    return (
      <div className="flex-1 flex flex-col">
        <BradyHeader subtitle="Solo" />
        <div className="flex-1 flex items-center justify-center px-5 py-8">
          <div className="max-w-md w-full text-center animate-pop glass rounded-3xl p-7">
            <p className="uppercase tracking-[0.3em] text-xs text-rose-300/80">Game Over</p>
            <p className="mt-2 text-6xl font-black leading-none">
              You lost at <span className="text-rose-300">{streak}</span>
            </p>
            <p className="mt-3 text-white/60 text-sm">
              {losingPlayer.name} was the one that got you.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-white/50">This run</p>
                <p className="font-bold text-lg">{streak}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-white/50">Best</p>
                <p className="font-bold text-lg">{best}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                onClick={startRun}
                className="btn-base w-full rounded-2xl py-4 text-lg font-semibold bg-white text-black hover:bg-white/90"
              >
                Play again
              </button>
              <a
                href="/"
                className="btn-base w-full rounded-2xl py-3 text-base font-semibold text-white/60 hover:text-white"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <PlayerCard player={current} />

        {phase === "answering" ? (
          <ChoiceButtons onChoose={handle} />
        ) : (
          <div className="w-full max-w-lg flex flex-col items-center gap-5">
            <RoundReveal
              player={current}
              correct={!!isCorrect}
              elapsedMs={roundElapsed ?? undefined}
            />
            <button
              onClick={advance}
              className={`btn-base w-full rounded-2xl py-4 text-lg font-semibold ${
                isCorrect ? "bg-white text-black" : "bg-rose-500 text-white"
              }`}
            >
              {isCorrect ? "Next →" : "See your run →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
