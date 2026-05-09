import Link from "next/link";

type Props = {
  /** Override the headline. Defaults to a generic guess-first prompt. */
  title?: string;
  /** Override the supporting line. */
  subtitle?: string;
};

export default function GuessFirstHero({ title, subtitle }: Props) {
  return (
    <section className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-400/15 to-amber-500/5 p-6 sm:p-8 mb-8">
      <p className="uppercase tracking-[0.3em] text-xs text-amber-200/80 font-bold">
        Wait — don&apos;t peek
      </p>
      <h2 className="mt-2 text-2xl sm:text-3xl font-black text-white leading-tight">
        {title ?? "Can you actually guess without looking it up?"}
      </h2>
      <p className="mt-2 text-white/80 text-base sm:text-lg max-w-prose">
        {subtitle ??
          "Take the 10-round Older Than Brady quiz. Most people get fewer than 6 right — the cheat sheet is below if you give up."}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 text-black px-6 py-3 text-base sm:text-lg font-bold hover:bg-amber-300 transition shadow-lg shadow-amber-500/20"
        >
          Play the 10-round quiz →
        </Link>
        <span className="text-sm text-white/55">Or scroll for the answer ↓</span>
      </div>
    </section>
  );
}
