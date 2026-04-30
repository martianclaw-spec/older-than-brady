"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import BradyHeader from "@/components/BradyHeader";
import PlayerCard from "@/components/PlayerCard";
import ChoiceButtons from "@/components/ChoiceButtons";
import RoundReveal from "@/components/RoundReveal";
import {
  buildChallengeQueue,
  CHALLENGE_ROUNDS,
  Choice,
  correctAnswer,
  dailySeed,
  generateSeed,
  todayDateKey
} from "@/lib/game";
import { Player } from "@/lib/players";
import {
  getDailyResult,
  saveDailyResult,
  StoredChallenge
} from "@/lib/storage";

type Phase = "answering" | "revealing";

function formatTime(ms: number) {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m === 0 ? `${s}s` : `${m}m ${s.toString().padStart(2, "0")}s`;
}

function verdictFor(score: number) {
  if (score === CHALLENGE_ROUNDS) return "Perfect run!";
  if (score >= 8) return "Sharp.";
  if (score >= 6) return "Not bad.";
  if (score >= 4) return "Tough crowd.";
  return "Brutal. Try again tomorrow?";
}

function DailyResultCard({ result }: { result: StoredChallenge }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const shareText = `I got ${result.score}/${result.total} on today's Older Than Brady daily challenge. Can you beat me?`;
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/daily`
      : "/daily";
  const fullText = `${shareText} ${url}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = fullText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  type NavWithShare = Navigator & { share?: (data: ShareData) => Promise<void> };
  const share = async () => {
    const nav: NavWithShare | undefined =
      typeof navigator !== "undefined" ? (navigator as NavWithShare) : undefined;
    if (nav?.share) {
      try {
        await nav.share({
          title: "Older Than Brady? — Daily",
          text: shareText,
          url
        });
        setShared(true);
        setTimeout(() => setShared(false), 1600);
        return;
      } catch {
        /* fall through */
      }
    }
    copy();
  };

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-8">
      <div className="max-w-md w-full text-center animate-pop glass rounded-3xl p-7">
        <p className="uppercase tracking-[0.3em] text-xs text-white/50">Today's Daily</p>
        <p className="mt-2 text-7xl font-black leading-none">
          {result.score}
          <span className="text-white/40 text-4xl">/{result.total}</span>
        </p>
        <p className="mt-3 text-lg text-white/80">{verdictFor(result.score)}</p>
        <p className="mt-1 text-sm text-white/50">
          Done in {formatTime(result.timeMs)} · come back tomorrow for a new one
        </p>

        <div className="mt-6 grid gap-3">
          <button
            onClick={share}
            className="btn-base w-full rounded-2xl py-4 text-lg font-semibold bg-white text-black hover:bg-white/90"
          >
            {shared ? "Shared!" : "Challenge a friend"}
          </button>
          <button
            onClick={copy}
            className="btn-base w-full rounded-2xl py-3 text-base font-semibold border border-white/15 text-white/85 hover:bg-white/5"
          >
            {copied ? "Copied!" : "Copy result"}
          </button>
          <Link
            href={`/challenge?seed=${generateSeed()}`}
            className="btn-base w-full rounded-2xl py-3 text-base font-semibold border border-white/10 text-white/70 hover:bg-white/5"
          >
            Try a custom challenge
          </Link>
          <Link
            href="/"
            className="btn-base w-full rounded-2xl py-3 text-base font-semibold text-white/60 hover:text-white"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DailyPage() {
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [savedResult, setSavedResult] = useState<StoredChallenge | null>(null);
  const [queue, setQueue] = useState<Player[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [roundElapsed, setRoundElapsed] = useState<number | null>(null);
  const startRef = useRef<number | null>(null);
  const roundStartRef = useRef<number | null>(null);

  useEffect(() => {
    const today = todayDateKey();
    setDateKey(today);
    const existing = getDailyResult(today);
    if (existing) {
      setSavedResult(existing);
      return;
    }
    setQueue(buildChallengeQueue(dailySeed()));
    startRef.current = Date.now();
    roundStartRef.current = Date.now();
  }, []);

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
    if (!dateKey) return;
    const next = index + 1;
    if (next >= queue.length) {
      const totalTime = Date.now() - (startRef.current ?? Date.now());
      const result: StoredChallenge = {
        seed: dailySeed(),
        score,
        total: CHALLENGE_ROUNDS,
        timeMs: totalTime,
        completedAt: Date.now()
      };
      saveDailyResult(dateKey, result);
      setSavedResult(result);
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

  if (savedResult) {
    return (
      <div className="flex-1 flex flex-col">
        <BradyHeader subtitle="Daily Challenge" />
        <DailyResultCard result={savedResult} />
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white/50">Loading today's challenge…</p>
      </div>
    );
  }

  const round = index + 1;

  return (
    <div className="flex-1 flex flex-col">
      <BradyHeader subtitle={`Daily · ${dateKey ?? ""}`} />

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
            style={{
              width: `${((round - (phase === "answering" ? 1 : 0)) / CHALLENGE_ROUNDS) * 100}%`
            }}
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
