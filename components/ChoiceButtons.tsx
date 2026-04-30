"use client";

import { Choice } from "@/lib/game";

type Props = {
  onChoose: (c: Choice) => void;
  disabled?: boolean;
  highlight?: { choice: Choice; correct: boolean } | null;
};

export default function ChoiceButtons({ onChoose, disabled, highlight }: Props) {
  const stateClass = (c: Choice) => {
    if (!highlight) return "";
    const isThisChosen = highlight.choice === c;
    const isCorrectChoice = highlight.correct ? isThisChosen : (c !== highlight.choice);
    if (isCorrectChoice) return "!bg-emerald-500/90 !border-emerald-300";
    if (isThisChosen && !highlight.correct) return "!bg-rose-500/90 !border-rose-300";
    return "opacity-50";
  };

  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
      <button
        disabled={disabled}
        onClick={() => onChoose("older")}
        className={`btn-base rounded-2xl py-5 text-xl font-semibold border border-white/15 bg-nfl-navy/80 hover:bg-nfl-navy disabled:cursor-not-allowed ${stateClass("older")}`}
      >
        ↑ Older
      </button>
      <button
        disabled={disabled}
        onClick={() => onChoose("younger")}
        className={`btn-base rounded-2xl py-5 text-xl font-semibold border border-white/15 bg-nfl-red/80 hover:bg-nfl-red disabled:cursor-not-allowed ${stateClass("younger")}`}
      >
        ↓ Younger
      </button>
    </div>
  );
}
