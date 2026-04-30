"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BradyHeader from "@/components/BradyHeader";
import PlayerCard from "@/components/PlayerCard";
import ChoiceButtons from "@/components/ChoiceButtons";
import CopyLinkButton from "@/components/CopyLinkButton";
import {
  ageDiffLabel,
  ageOn,
  buildChallengeQueue,
  CHALLENGE_ROUNDS,
  Choice,
  correctAnswer,
  generateSeed
} from "@/lib/game";
import { BRADY_BIRTH, BRADY_NAME, Player } from "@/lib/players";
import { saveChallengeResult } from "@/lib/storage";

type Phase = "answering" | "revealing";

function ChallengeInner() {
  const params = useSearchParams();
  const router = useRouter();
  const seedFromUrl = params.get("seed");

  const [queue, setQueue] = useState<Player[]>([]);
  const [seed, setSeed] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [chosen, setChosen] = useState<Choice | null>(null);
  const startRef = useRef<number | null>(null);

  // Ensure we always have a seed (redirect to canonical URL if missing)
  useEffect(() => {
    if (!seedFromUrl) {
      const fresh = generateSeed();
      router.replace(`/challenge?seed=${fresh}`);
      return;
    }
    setSeed(seedFromUrl);
    setQueue(buildChallengeQueue(seedFromUrl));
    startRef.current = Date.now();
  }, [seedFromUrl, router]);

  const current = queue[index];

  const handle = (c: Choice) => {
    if (!current || phase !== "answering") return;
    setChosen(c);
    setPhase("revealing");
    const correct = c === correctAnswer(current.birthDate);
    if (correct) setScore((s) => s + 1);
  };

  const advance = () => {
    if (!seed) return;
    const next = index + 1;
    if (next >= queue.length) {
      const elapsed = Date.now() - (startRef.current ?? Date.now());
      const finalScore = score; // already incorporates current round
      saveChallengeResult({
        seed,
        score: finalScore,
        total: CHALLENGE_ROUNDS,
        timeMs: elapsed,
        completedAt: Date.now()
      });
      router.push(`/results?seed=${seed}&score=${finalScore}&time=${elapsed}`);
      return;
    }
    setIndex(next);
    setPhase("answering");
    setChosen(null);
  };

  const isCorrect = useMemo(() => {
    if (!current || !chosen) return null;
    return chosen === correctAnswer(current.birthDate);
  }, [current, chosen]);

  if (!current || !seed) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/50">Loading…</p>
      </div>
    );
  }

  const playerAge = ageOn(current.birthDate);
  const bradyAge = ageOn(BRADY_BIRTH);
  const diffLabel = ageDiffLabel(current.birthDate);
  const round = index + 1;

  return (
    <div className="flex-1 flex flex-col">
      <BradyHeader subtitle={`Challenge · seed ${seed}`} />

      <div className="flex items-center justify-between max-w-2xl w-full mx-auto px-5">
        <div className="text-sm">
          <span className="text-white/50">Round </span>
          <span className="font-bold text-white">{round}/{CHALLENGE_ROUNDS}</span>
        </div>
        <div className="text-sm">
          <span className="text-white/50">Score </span>
          <span className="font-bold text-white">{score}</span>
        </div>
      </div>

      <div className="max-w-2xl w-full mx-auto px-5 mt-2">
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-white/80 transition-all duration-300"
            style={{ width: `${((round - (phase === "answering" ? 1 : 0)) / CHALLENGE_ROUNDS) * 100}%` }}
          />
        </div>
        <div className="mt-3">
          <CopyLinkButton
            seed={seed}
            label="Copy challenge link"
            className="btn-base w-full rounded-xl py-2 text-sm font-medium border border-white/10 text-white/75 hover:bg-white/5"
          />
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
              {round >= CHALLENGE_ROUNDS ? "Finish →" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChallengePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/50">Loading…</p>
        </div>
      }
    >
      <ChallengeInner />
    </Suspense>
  );
}
