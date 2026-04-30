import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog · Older Than Brady?",
  description:
    "Stories, comparisons, and birthday trivia from the Older Than Brady? game.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Older Than Brady? — Blog",
    description: "Stories and comparisons from the Older Than Brady? game.",
    type: "website",
    url: "/blog"
  }
};

function formatDate(d: string): string {
  const [y, m, day] = d.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[m - 1]} ${day}, ${y}`;
}

export default function BlogIndex() {
  return (
    <article className="max-w-3xl mx-auto px-5 py-10">
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-white/60 hover:text-white">
          ← Older Than Brady?
        </Link>
      </nav>

      <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Blog</h1>
      <p className="mt-3 text-white/70 leading-relaxed">
        Stories, comparisons, and birthday trivia from the Older Than Brady? game.
      </p>

      <div className="mt-10 space-y-8">
        {POSTS.map((p) => (
          <article key={p.slug} className="border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-widest text-white/40">
              {formatDate(p.date)} · {p.readMins} min read
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              <Link href={`/blog/${p.slug}`} className="hover:underline">
                {p.title}
              </Link>
            </h2>
            <p className="mt-2 text-white/70 leading-relaxed">{p.description}</p>
            <p className="mt-3">
              <Link
                href={`/blog/${p.slug}`}
                className="text-white underline hover:no-underline"
              >
                Read →
              </Link>
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/"
          className="inline-block rounded-2xl bg-white text-black px-6 py-3 text-base font-semibold hover:bg-white/90"
        >
          Play the game →
        </Link>
      </div>
    </article>
  );
}
