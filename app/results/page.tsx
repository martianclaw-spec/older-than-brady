"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BradyHeader from "@/components/BradyHeader";
import { CHALLENGE_ROUNDS } from "@/lib/game";

function formatTime(ms: number) {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function ResultsInner() {
  const params = useSearchParams();
  const seed = params.get("seed") ?? "";
  const score = parseInt(params.get("score") ?? "0", 10) || 0;
  const time = parseInt(params.get("time") ?? "0", 10) || 0;
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && seed) {
      setShareUrl(`${window.location.origin}/challenge?seed=${seed}`);
    }
  }, [seed]);

  const verdict = useMemo(() => {
    if (score === CHALLENGE_ROUNDS) return "Perfect run!";
    if (score >= 8) return "Sharp.";
    if (score >= 6) return "Not bad.";
    if (score >= 4) return "Tough crowd.";
    return "Brutal. Try again?";
  }, [score]);

  const shareText = `Older Than Brady? — I scored ${score}/${CHALLENGE_ROUNDS} in ${formatTime(time)}. Beat me: ${shareUrl}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && (navigator as Navigator & { share?: (data: ShareData) => Promise<void> }).share) {
      try {
        await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({
          title: "Older Than Brady?",
          text: shareText,
          url: shareUrl
        });
        return;
      } catch {
        // fall through
      }
    }
    copy();
  };

  return (
    <div className="flex-1 flex flex-col">
      <BradyHeader subtitle="Results" />
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="max-w-md w-full text-center animate-pop glass rounded-3xl p-7">
          <p className="uppercase tracking-[0.3em] text-xs text-white/50">Final Score</p>
          <p className="mt-2 text-7xl font-black leading-none">
            {score}
            <span className="text-white/40 text-4xl">/{CHALLENGE_ROUNDS}</span>
          </p>
          <p className="mt-3 text-lg text-white/80">{verdict}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-white/50">Time</p>
              <p className="font-bold text-lg">{formatTime(time)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-white/50">Seed</p>
              <p className="font-bold text-lg break-all">{seed || "—"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              onClick={share}
              className="btn-base w-full rounded-2xl py-4 text-lg font-semibold bg-white text-black"
            >
              {copied ? "Copied!" : "Challenge a friend"}
            </button>
            <Link
              href={`/challenge?seed=${seed}`}
              className="btn-base w-full rounded-2xl py-3 text-base font-semibold border border-white/15 hover:bg-white/5"
            >
              Replay this seed
            </Link>
            <Link
              href="/"
              className="btn-base w-full rounded-2xl py-3 text-base font-semibold text-white/70 hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/50">Loading…</p>
        </div>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}
