"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { generateSeed } from "@/lib/game";
import { getBestStreak } from "@/lib/storage";
import CopyLinkButton from "@/components/CopyLinkButton";

export default function Home() {
  const [best, setBest] = useState<number | null>(null);
  const [seed, setSeed] = useState<string>("");

  useEffect(() => {
    setBest(getBestStreak());
    setSeed(generateSeed());
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
      <div className="max-w-md w-full text-center animate-pop">
        <p className="uppercase tracking-[0.3em] text-xs text-white/50 mb-3">NFL Trivia</p>
        <h1 className="text-5xl sm:text-6xl font-black leading-none">
          Older Than <span className="text-nfl-red">Brady</span>?
        </h1>
        <p className="mt-4 text-white/70 text-base sm:text-lg">
          One player. Two choices. Were they born before Tom Brady (Aug 3, 1977) or after?
        </p>

        <div className="mt-8 grid gap-3">
          <Link
            href="/solo"
            className="btn-base block rounded-2xl py-4 text-lg font-semibold bg-white text-black hover:bg-white/90"
          >
            Play Solo
          </Link>
          <Link
            href={seed ? `/challenge?seed=${seed}` : "/challenge"}
            className="btn-base block rounded-2xl py-4 text-lg font-semibold bg-nfl-navy hover:bg-nfl-navy/80 border border-white/10"
          >
            Challenge a Friend
          </Link>
          <CopyLinkButton seed={seed} />
        </div>

        {seed && (
          <p className="mt-3 text-xs text-white/40 break-all">
            /challenge?seed={seed}
          </p>
        )}

        {best != null && best > 0 && (
          <p className="mt-6 text-sm text-white/50">
            Best streak: <span className="text-white font-semibold">{best}</span>
          </p>
        )}
      </div>

      <footer className="mt-12 text-[11px] text-white/30 text-center">
        <p>Tap fast. Don&apos;t overthink it.</p>
        <p className="mt-2">
          <Link href="/who-is-older-than-tom-brady" className="underline hover:text-white/60">
            Who is older than Tom Brady? →
          </Link>
        </p>
      </footer>
    </div>
  );
}
