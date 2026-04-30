import type { Metadata } from "next";
import Link from "next/link";
import { ageDiffLabel, ageOn, isOlderThanBrady } from "@/lib/game";
import { BRADY_BIRTH, BRADY_NAME, PLAYERS } from "@/lib/players";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Who Is Older Than Tom Brady? Birthdates of 30 Famous Athletes",
  description:
    "See which famous athletes were born before or after Tom Brady (August 3, 1977). Quick yes/no answers for Peyton Manning, LeBron James, Tiger Woods, and 25+ more.",
  alternates: { canonical: "/who-is-older-than-tom-brady" },
  openGraph: {
    title: "Who Is Older Than Tom Brady?",
    description:
      "Quick birthdate comparisons for 30 famous athletes vs. Tom Brady (born August 3, 1977).",
    type: "article",
    url: "/who-is-older-than-tom-brady"
  }
};

const FEATURED: string[] = [
  // NFL
  "Peyton Manning",
  "Aaron Rodgers",
  "Drew Brees",
  "Patrick Mahomes",
  "Eli Manning",
  "Ben Roethlisberger",
  "Joe Montana",
  "Brett Favre",
  "Tony Romo",
  "Michael Vick",
  "Randy Moss",
  "Marvin Harrison",
  "Jerry Rice",
  "Dan Marino",
  "Ray Lewis",
  "Adrian Peterson",
  "Calvin Johnson",
  "Lamar Jackson",
  "Joe Burrow",
  // NBA
  "LeBron James",
  "Kobe Bryant",
  "Shaquille O'Neal",
  "Tim Duncan",
  "Allen Iverson",
  // MLB
  "Derek Jeter",
  "Alex Rodriguez",
  // Golf
  "Tiger Woods",
  "Phil Mickelson",
  // Tennis
  "Roger Federer",
  "Serena Williams"
];

function formatBirthDate(d: string): string {
  // d is YYYY-MM-DD; render as "Month Day, Year" without timezone drift.
  const [y, m, day] = d.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[m - 1]} ${day}, ${y}`;
}

type Compared = {
  name: string;
  birthDate: string;
  birthDatePretty: string;
  age: number;
  older: boolean;
  diff: string;
};

function compare(name: string): Compared | null {
  const p = PLAYERS.find((x) => x.name === name);
  if (!p) return null;
  return {
    name: p.name,
    birthDate: p.birthDate,
    birthDatePretty: formatBirthDate(p.birthDate),
    age: ageOn(p.birthDate),
    older: isOlderThanBrady(p.birthDate),
    diff: ageDiffLabel(p.birthDate)
  };
}

function PlayCTA() {
  return (
    <div className="my-8">
      <Link
        href="/"
        className="inline-block rounded-2xl bg-white text-black px-6 py-3 text-base font-semibold hover:bg-white/90 transition"
      >
        Play the Older Than Brady game →
      </Link>
    </div>
  );
}

export default function Page() {
  const featured = FEATURED.map(compare).filter((x): x is Compared => x !== null);
  const bradyAge = ageOn(BRADY_BIRTH);
  const bradyBornPretty = formatBirthDate(BRADY_BIRTH);

  const olderCount = featured.filter((p) => p.older).length;
  const youngerCount = featured.length - olderCount;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: featured.map((p) => ({
      "@type": "Question",
      name: `Is ${p.name} older than Tom Brady?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: p.older
          ? `Yes. ${p.name} was born on ${p.birthDatePretty}, ${p.diff} before Tom Brady (born ${bradyBornPretty}).`
          : `No. ${p.name} was born on ${p.birthDatePretty}, ${p.diff} after Tom Brady (born ${bradyBornPretty}).`
      }
    }))
  };

  return (
    <article className="max-w-3xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <nav className="mb-6 text-sm">
        <Link href="/" className="text-white/60 hover:text-white">
          ← Older Than Brady?
        </Link>
      </nav>

      <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
        Who Is Older Than Tom Brady?
      </h1>
      <p className="mt-3 text-white/60 text-sm">
        Last updated: {formatBirthDate(new Date().toISOString().slice(0, 10))}
      </p>

      <PlayCTA />

      <p className="text-lg leading-relaxed text-white/85">
        Tom Brady was born on <strong>{bradyBornPretty}</strong>, which makes him{" "}
        <strong>{bradyAge} years old</strong> today. He played 23 NFL seasons and won seven Super
        Bowls — more than any single franchise — finally retiring in 2023 at age 45. Because his
        career stretched across nearly every notable football generation, comparing his age to
        other famous athletes is a surprisingly tricky guessing game. Below is a quick reference
        of {featured.length} well-known athletes and whether each was born before or after Brady.
      </p>

      <p className="mt-4 text-white/70 leading-relaxed">
        Of the {featured.length} athletes listed here, <strong>{olderCount} are older</strong>{" "}
        than Tom Brady and <strong>{youngerCount} are younger</strong>. Some are within weeks of
        his birthdate; others are decades apart. Scroll through, then{" "}
        <Link href="/" className="underline hover:text-white">
          play the full game
        </Link>{" "}
        to test your instincts on 100+ more.
      </p>

      <hr className="my-10 border-white/10" />

      <div className="space-y-6">
        {featured.map((p) => (
          <section key={p.name} id={p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
            <h2 className="text-xl sm:text-2xl font-bold">
              Is {p.name} older than Tom Brady?
            </h2>
            <p className="mt-2 text-white/85 leading-relaxed">
              <strong className={p.older ? "text-emerald-300" : "text-rose-300"}>
                {p.older ? "Yes" : "No"}.
              </strong>{" "}
              {p.name} was born on <strong>{p.birthDatePretty}</strong>, which makes them{" "}
              {p.diff} {p.older ? "older" : "younger"} than Tom Brady. {p.name} is{" "}
              {p.age} years old; Brady is {bradyAge}.
            </p>
          </section>
        ))}
      </div>

      <hr className="my-10 border-white/10" />

      <h2 className="text-2xl font-bold">Tom Brady's birthdate, in context</h2>
      <p className="mt-3 text-white/85 leading-relaxed">
        Brady's August 3, 1977 birthdate falls in the heart of Generation X. He's slightly
        younger than Peyton Manning, slightly older than Drew Brees, and almost a full
        generation older than the current crop of starting quarterbacks like Patrick Mahomes
        and Joe Burrow. The fun of guessing comes from the close calls — especially other
        1977-born stars like Plaxico Burress (just 9 days younger) and Olin Kreutz (about
        2 months older).
      </p>

      <PlayCTA />

      <footer className="mt-10 pt-6 border-t border-white/10 text-sm text-white/50">
        <p>
          Birthdate data sourced from public records. Ages update automatically. This page is
          part of the{" "}
          <Link href="/" className="underline hover:text-white">
            Older Than Brady?
          </Link>{" "}
          guessing game.
        </p>
      </footer>
    </article>
  );
}
