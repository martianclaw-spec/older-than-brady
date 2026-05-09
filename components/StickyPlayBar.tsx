import Link from "next/link";

// Mobile-only floating CTA. Always visible while scrolling SEO/blog pages so
// "look it up" search visitors are one tap from playing the game.
export default function StickyPlayBar() {
  return (
    <>
      {/* Spacer so trailing content isn't hidden behind the fixed bar on mobile */}
      <div className="h-20 sm:hidden" aria-hidden />
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/85 backdrop-blur-md p-3 sm:hidden">
        <Link
          href="/"
          className="block w-full text-center rounded-2xl bg-amber-400 text-black py-3 text-base font-bold hover:bg-amber-300 transition"
        >
          🎮 Play the Older Than Brady game
        </Link>
      </div>
    </>
  );
}
