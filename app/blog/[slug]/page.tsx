import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/posts";
import { ageOn } from "@/lib/game";
import { BRADY_BIRTH } from "@/lib/players";

export const revalidate = 86400;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

function formatDate(d: string): string {
  const [y, m, day] = d.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[m - 1]} ${day}, ${y}`;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.date
    }
  };
}

function PlayCTA() {
  return (
    <div className="my-10">
      <Link
        href="/"
        className="inline-block rounded-2xl bg-white text-black px-6 py-3 text-base font-semibold hover:bg-white/90 transition"
      >
        Play the Older Than Brady game →
      </Link>
    </div>
  );
}

// --- Article bodies -----------------------------------------------------

function ClosestFiveBody() {
  return (
    <>
      <p className="text-lg leading-relaxed text-white/85">
        Tom Brady was born on <strong>August 3, 1977</strong>. There are an
        astonishing number of NFL stars who arrived within weeks of that date —
        which is half the reason guessing their ages against Brady's is so
        deceptively hard. Here are the five athletes whose birthdays are closest
        to Brady's, ranked by total day-difference.
      </p>

      <h2 className="mt-10 text-2xl font-bold">1. Plaxico Burress — 9 days younger</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        The closest call. Plaxico Burress was born <strong>August 12, 1977</strong>,
        just nine days after Brady. The two are forever linked by Super Bowl XLII —
        Burress caught the game-winning touchdown in the final minute that handed
        Brady's 18-0 Patriots their only loss of the season. The win-probability
        twist is iconic; the fact that the receiver who beat Brady was almost
        exactly his age is a footnote most people miss.{" "}
        <Link href="/older-than-brady/plaxico-burress" className="underline hover:text-white">
          See the full comparison.
        </Link>
      </p>

      <h2 className="mt-10 text-2xl font-bold">2. Shaun Alexander — 27 days younger</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        The 2005 NFL MVP was born <strong>August 30, 1977</strong>, less than four
        weeks after Brady. Alexander led the league in rushing touchdowns three
        years in a row from 2002–2005 and ran for 27 TDs in his MVP season — a
        record at the time. He and Brady were drafted in the same 2000 class
        (Alexander 19th overall, Brady 199th).
      </p>

      <h2 className="mt-10 text-2xl font-bold">3. Olin Kreutz — about 8 weeks older</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        Born <strong>June 9, 1977</strong>, the longtime Bears center anchored
        Chicago's offensive line through six Pro Bowls. Kreutz is one of those
        names where casual fans get the older/younger guess wrong almost every
        time — he genuinely is older than Brady, just barely.
      </p>

      <h2 className="mt-10 text-2xl font-bold">4. Ricky Williams — about 10 weeks older</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        The 1998 Heisman Trophy winner was born <strong>May 21, 1977</strong>.
        Brady was a backup at Michigan when Ricky was running over Big 12
        defenses at Texas; eighteen months later, Brady was getting drafted in
        the sixth round and Williams was already the face of the Saints' future.
      </p>

      <h2 className="mt-10 text-2xl font-bold">5. Steve Hutchinson — about 13 weeks younger</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        The Hall of Fame guard was born <strong>November 1, 1977</strong>, three
        months after Brady. Hutchinson made seven Pro Bowls between Seattle and
        Minnesota and was a centerpiece of the early-2000s Seahawks offenses
        that Shaun Alexander rode to the MVP.
      </p>

      <hr className="my-10 border-white/10" />

      <h2 className="text-2xl font-bold">Honorable mentions</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        Move the window out to a calendar year or so and the list explodes.{" "}
        <Link href="/older-than-brady/randy-moss" className="underline">Randy Moss</Link> was born
        in February 1977. <Link href="/older-than-brady/peyton-manning" className="underline">Peyton Manning</Link>
        {" "}arrived in March 1976. Outside football,{" "}
        <Link href="/older-than-brady/kobe-bryant" className="underline">Kobe Bryant</Link> was born
        almost exactly a year after Brady (August 23, 1978), and{" "}
        <Link href="/older-than-brady/roger-federer" className="underline">Roger Federer</Link> shares
        Brady's birthday week — August 8 — but four years later in 1981.
      </p>

      <PlayCTA />

      <p className="text-sm text-white/50">
        See the{" "}
        <Link href="/who-is-older-than-tom-brady" className="underline">
          full athlete-vs-Brady comparison list
        </Link>{" "}
        for 30 more.
      </p>
    </>
  );
}

function GenerationBody() {
  const bradyAge = ageOn(BRADY_BIRTH);
  return (
    <>
      <p className="text-lg leading-relaxed text-white/85">
        Tom Brady is {bradyAge} years old. He played 23 NFL seasons. By the time
        he retired in 2023, almost every quarterback who entered the league with
        him had been out of football for a decade. But there was a real
        generation — a wave of QBs born within a handful of years of August 3,
        1977 — that defined the league for two decades. This is that group.
      </p>

      <h2 className="mt-10 text-2xl font-bold">The early-'70s wave</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        Drew Bledsoe (born <strong>February 14, 1972</strong>) is the patriarch of
        Brady's generation in the most literal sense — Brady's NFL career began
        because Bledsoe got hurt in 2001. Trent Dilfer (March 1972), Kerry Collins
        (December 1972), and Steve McNair (February 1973) all played in the same
        era and most started Super Bowls. Dilfer won one with Baltimore the year
        before Brady won his first with New England.
      </p>

      <h2 className="mt-10 text-2xl font-bold">The mid-'70s passers</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        Jake Plummer (1974), Jake Delhomme (1975), and Matt Hasselbeck (1975) all
        started at least one NFC Championship Game. Then comes 1976: a remarkable
        three quarterbacks share the year —{" "}
        <Link href="/older-than-brady/peyton-manning" className="underline">
          Peyton Manning
        </Link>{" "}
        (March), Donovan McNabb (November), and Aaron Brooks (March). Manning is
        the obvious headliner, but McNabb made six Pro Bowls and Brooks led the
        Saints to their first playoff win.
      </p>

      <h2 className="mt-10 text-2xl font-bold">1977: Brady's exact class</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        Brady's own birth year produced two QBs in our dataset: Brady himself and
        Daunte Culpepper, born about six months earlier on January 28, 1977.
        Culpepper's 2004 season — 4,717 yards, 39 touchdowns, 110.9 passer rating
        — was one of the great single-year quarterback performances of the era,
        and he and Brady spent the early 2000s as direct rivals at the top of the
        statistical leaderboards.
      </p>

      <h2 className="mt-10 text-2xl font-bold">The late-'70s closers</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        <Link href="/older-than-brady/drew-brees" className="underline">
          Drew Brees
        </Link>{" "}
        (January 1979) is the one most often paired with Brady in GOAT
        conversations. Carson Palmer (December 1979) and David Carr (July 1979)
        round out the year. By the time these QBs entered the league, Brady was
        already a multi-time Super Bowl winner — but they're all from the same
        generational cluster, just on its trailing edge.
      </p>

      <h2 className="mt-10 text-2xl font-bold">Why this matters for guessing ages</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        The reason quarterback comparisons are so hard isn't that the dates are
        random — it's that Brady's generation produced an absurd density of
        starting NFL quarterbacks across about an eight-year window. Almost any
        well-known QB from 1972 to 1980 is within months of being a coin-flip
        guess against Brady. That's exactly what we exploit in the{" "}
        <Link href="/" className="underline">guessing game</Link>.
      </p>

      <PlayCTA />

      <p className="text-sm text-white/50">
        For the cross-sport version of this look, see{" "}
        <Link href="/who-is-older-than-tom-brady" className="underline">
          Who Is Older Than Tom Brady?
        </Link>
        , covering 30 athletes across the NFL, NBA, MLB, golf, and tennis.
      </p>
    </>
  );
}

const BODY: Record<string, () => React.ReactElement> = {
  "5-athletes-born-within-days-of-tom-brady": ClosestFiveBody,
  "bradys-generation-nfl-quarterbacks-of-the-70s": GenerationBody
};

export default async function PostPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const Body = BODY[slug];
  if (!post || !Body) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Older Than Brady?" },
    mainEntityOfPage: `https://older-than-brady.vercel.app/blog/${post.slug}`
  };

  return (
    <article className="max-w-3xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd).replace(/</g, "\\u003c")
        }}
      />

      <nav className="mb-6 text-sm text-white/60 flex items-center gap-2">
        <Link href="/" className="hover:text-white">Older Than Brady?</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-white">Blog</Link>
      </nav>

      <p className="text-xs uppercase tracking-widest text-white/40">
        {formatDate(post.date)} · {post.readMins} min read
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
        {post.title}
      </h1>

      <div className="mt-6">
        <Body />
      </div>

      <footer className="mt-12 pt-6 border-t border-white/10 text-sm text-white/50">
        <p>
          More from the blog:{" "}
          {POSTS.filter((p) => p.slug !== slug).map((p, i, arr) => (
            <span key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="underline hover:text-white">
                {p.title}
              </Link>
              {i < arr.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
      </footer>
    </article>
  );
}
