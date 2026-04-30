"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BradyHeader from "@/components/BradyHeader";
import PlayerCard from "@/components/PlayerCard";
import ChoiceButtons from "@/components/ChoiceButtons";
import CopyLinkButton from "@/components/CopyLinkButton";
import RoundReveal from "@/components/RoundReveal";
import {
  buildChallengeQueue,
  CHALLENGE_ROUNDS,
  Choice,
  correctAnswer,
  generateSeed
} from "@/lib/game";
import { Player } from "@/lib/players";
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
  const [roundElapsed, setRoundElapsed] = useState<number | null>(null);
  const startRef = useRef<number | null>(null);
  const roundStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!seedFromUrl) {
      const fresh = generateSeed();
      router.replace(`/challenge?seed=${fresh}`);
      return;
    }
    setSeed(seedFromUrl);
    setQueue(buildChallengeQueue(seedFromUrl));
    startRef.current = Date.now();
    roundStartRef.current = Date.now();
  }, [seedFromUrl, router]);

  const current = queue[index];

  const handle = (c: Choice) => {
    if (!current || phase !== "answering") return;
    const elapsed = roundStartRef.current ? Date.now() - roundStartRef.current : 0;
    setRoundElapsed(elapsed);
    setChosen(c);
    setPhase("revealing");
    if (c === correctAnswer(current.birthDate)) setScore((s) => s + 1);
  };

  const advance = () => {
    if (!seed) return;
    const next = index + 1;
    if (next >= queue.length) {
      const elapsed = Date.now() - (startRef.current ?? Date.now());
      saveChallengeResult({
        seed,
        score,
        total: CHALLENGE_ROUNDS,
        timeMs: elapsed,
        completedAt: Date.now()
      });
      router.push(`/results?seed=${seed}&score=${score}&time=${elapsed}`);
      return;
    }
    setIndex(next);
    setPhase("answering");
    setChosen(null);
    setRoundElapsed(null);
    roundStartRef.current = Date.now();
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

  const round = index + 1;

  return (
    <div className="flex-1 flex flex-col">
      <BradyHeader subtitle={`Challenge · seed ${seed}`} />

      <div className="flex items-center justify-between max-w-2xl w-full mx-auto px-5">
        <div className="text-sm">
          <span className="text-white/50">Round </span>
          <span className="font-bold text-white">
            {round}/{CHALLENGE_ROUNDS}
          </span>
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
            style={{
              width: `${((round - (phase === "answering" ? 1 : 0)) / CHALLENGE_ROUNDS) * 100}%`
            }}
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
