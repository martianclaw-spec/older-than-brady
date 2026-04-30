"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BradyHeader from "@/components/BradyHeader";
import { CHALLENGE_ROUNDS, generateSeed } from "@/lib/game";
import { getBestStreak } from "@/lib/storage";

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
  const [copiedShort, setCopiedShort] = useState(false);
  const [shared, setShared] = useState(false);
  const [bestStreak, setBestStreak] = useState<number | null>(null);
  const [newSeed, setNewSeed] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined" && seed) {
      setShareUrl(`${window.location.origin}/challenge?seed=${seed}`);
    }
    setBestStreak(getBestStreak());
    setNewSeed(generateSeed());
  }, [seed]);

  const verdict = useMemo(() => {
    if (score === CHALLENGE_ROUNDS) return "Perfect run!";
    if (score >= 8) return "Sharp.";
    if (score >= 6) return "Not bad.";
    if (score >= 4) return "Tough crowd.";
    return "Brutal. Try again?";
  }, [score]);

  const shortText = `I got ${score}/${CHALLENGE_ROUNDS} guessing who is older than Tom Brady. Can you beat me?`;
  const fullText = `${shortText} ${shareUrl}`;

  const writeClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
      return ok;
    }
  };

  const copyResult = async () => {
    await writeClipboard(fullText);
    setCopiedShort(true);
    setTimeout(() => setCopiedShort(false), 1600);
  };

  type NavWithShare = Navigator & { share?: (data: ShareData) => Promise<void> };
  const share = async () => {
    const nav: NavWithShare | undefined =
      typeof navigator !== "undefined" ? (navigator as NavWithShare) : undefined;
    if (nav?.share) {
      try {
        await nav.share({
          title: "Older Than Brady?",
          text: shortText,
          url: shareUrl
        });
        setShared(true);
        setTimeout(() => setShared(false), 1600);
        return;
      } catch {
        /* fall through */
      }
    }
    await writeClipboard(fullText);
    setShared(true);
    setTimeout(() => setShared(false), 1600);
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

          <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-white/50 text-xs">Time</p>
              <p className="font-bold">{formatTime(time)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-white/50 text-xs">Seed</p>
              <p className="font-bold break-all leading-tight text-sm">{seed || "—"}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-white/50 text-xs">Best streak</p>
              <p className="font-bold">{bestStreak != null ? bestStreak : "—"}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              onClick={share}
              className="btn-base w-full rounded-2xl py-4 text-lg font-semibold bg-white text-black hover:bg-white/90"
            >
              {shared ? "Shared!" : "Challenge a friend"}
            </button>
            <button
              onClick={copyResult}
              className="btn-base w-full rounded-2xl py-3 text-base font-semibold border border-white/15 text-white/85 hover:bg-white/5"
            >
              {copiedShort ? "Copied!" : "Copy result"}
            </button>
            <Link
              href={newSeed ? `/challenge?seed=${newSeed}` : "/challenge"}
              className="btn-base w-full rounded-2xl py-3 text-base font-semibold bg-nfl-navy hover:bg-nfl-navy/80 border border-white/10"
            >
              Play again (new seed)
            </Link>
            <Link
              href={`/challenge?seed=${seed}`}
              className="btn-base w-full rounded-2xl py-3 text-sm text-white/60 hover:text-white"
            >
              Replay this seed
            </Link>
            <Link
              href="/"
              className="btn-base w-full rounded-2xl py-2 text-sm text-white/40 hover:text-white"
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
