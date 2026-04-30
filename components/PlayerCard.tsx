"use client";

import { useState } from "react";
import { Player } from "@/lib/players";

type Props = {
  player: Player;
  reveal?: boolean;
  ageLabel?: string;
};

export default function PlayerCard({ player, reveal, ageLabel }: Props) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="w-full flex flex-col items-center animate-pop">
      <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden glass shadow-2xl ring-2 ring-white/10">
        {!loaded && (
          <div className="absolute inset-0 bg-white/5 animate-pulse" aria-hidden />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={player.imageUrl}
          src={player.imageUrl}
          alt={player.name}
          width={400}
          height={400}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-center px-3">
        {player.name}
      </h2>
      {reveal && ageLabel && (
        <p className="mt-2 text-white/70 text-base animate-slideUp">{ageLabel}</p>
      )}
    </div>
  );
}
