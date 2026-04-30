import Link from "next/link";

export default function BradyHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="w-full px-4 pt-5 pb-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-sm text-white/60 hover:text-white transition">
          ← Home
        </Link>
        <div className="text-right">
          <h1 className="text-base font-bold tracking-tight">Older Than Brady?</h1>
          {subtitle && <p className="text-xs text-white/50">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
