import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ageDiffLabel, ageOn, diffDaysVsBrady, isOlderThanBrady } from "@/lib/game";
import { BRADY_BIRTH, BRADY_NAME, PLAYERS } from "@/lib/players";
import { FEATURED_ATHLETES, findFeatured } from "@/lib/featured";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

export function generateStaticParams() {
  return FEATURED_ATHLETES.map((a) => ({ slug: a.slug }));
}

function formatBirthDate(d: string): string {
  const [y, m, day] = d.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${months[m - 1]} ${day}, ${y}`;
}

type Resolved = {
  slug: string;
  name: string;
  tagline: string;
  sport: string;
  birthDate: string;
  birthDatePretty: string;
  age: number;
  older: boolean;
  diff: string;
};

function resolve(slug: string): Resolved | null {
  const featured = findFeatured(slug);
  if (!featured) return null;
  const p = PLAYERS.find((x) => x.name === featured.name);
  if (!p) return null;
  return {
    slug: featured.slug,
    name: featured.name,
    tagline: featured.tagline,
    sport: featured.sport,
    birthDate: p.birthDate,
    birthDatePretty: formatBirthDate(p.birthDate),
    age: ageOn(p.birthDate),
    older: isOlderThanBrady(p.birthDate),
    diff: ageDiffLabel(p.birthDate)
  };
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) return { title: "Not found" };
  const verb = r.older ? "older" : "younger";
  return {
    title: `Is ${r.name} Older Than Tom Brady?`,
    description: `${r.name} was born ${r.birthDatePretty}, making them ${r.diff} ${verb} than Tom Brady. ${r.tagline}.`,
    alternates: { canonical: `/older-than-brady/${r.slug}` },
    openGraph: {
      title: `Is ${r.name} Older Than Tom Brady?`,
      description: `${r.name} is ${r.diff} ${verb} than Tom Brady.`,
      type: "article",
      url: `/older-than-brady/${r.slug}`
    }
  };
}

function relatedAthletes(slug: string, n = 4): Resolved[] {
  const target = resolve(slug);
  if (!target) return [];
  const targetDays = diffDaysVsBrady(target.birthDate);
  const others = FEATURED_ATHLETES
    .filter((a) => a.slug !== slug)
    .map((a) => resolve(a.slug))
    .filter((r): r is Resolved => r !== null);
  others.sort((a, b) => {
    const da = Math.abs(diffDaysVsBrady(a.birthDate) - targetDays);
    const db = Math.abs(diffDaysVsBrady(b.birthDate) - targetDays);
    return da - db;
  });
  return others.slice(0, n);
}

function PlayCTA() {
  return (
    <Link
      href="/"
      className="inline-block rounded-2xl bg-white text-black px-6 py-3 text-base font-semibold hover:bg-white/90 transition"
    >
      Play the Older Than Brady game →
    </Link>
  );
}

export default async function PlayerPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();

  const bradyAge = ageOn(BRADY_BIRTH);
  const bradyBornPretty = formatBirthDate(BRADY_BIRTH);
  const verb = r.older ? "older" : "younger";
  const yesNo = r.older ? "Yes" : "No";
  const related = relatedAthletes(slug);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${r.name} older than Tom Brady?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${yesNo}. ${r.name} was born ${r.birthDatePretty}, ${r.diff} ${verb} than Tom Brady (born ${bradyBornPretty}).`
        }
      }
    ]
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Older Than Brady?", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Who Is Older Than Tom Brady?", item: `${SITE_URL}/who-is-older-than-tom-brady` },
      { "@type": "ListItem", position: 3, name: `Is ${r.name} Older Than Tom Brady?`, item: `${SITE_URL}/older-than-brady/${r.slug}` }
    ]
  };

  return (
    <article className="max-w-3xl mx-auto px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c")
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c")
        }}
      />

      <nav className="mb-6 text-sm text-white/60 flex items-center gap-2">
        <Link href="/" className="hover:text-white">Older Than Brady?</Link>
        <span>›</span>
        <Link href="/who-is-older-than-tom-brady" className="hover:text-white">
          Athlete comparisons
        </Link>
        <span>›</span>
        <span className="text-white/80">{r.name}</span>
      </nav>

      <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
        Is {r.name} Older Than Tom Brady?
      </h1>

      <p className="mt-6 text-2xl leading-snug">
        <strong className={r.older ? "text-emerald-300" : "text-rose-300"}>
          {yesNo}.
        </strong>{" "}
        <span className="text-white/85">
          {r.name} is <strong>{r.diff} {verb}</strong> than Tom Brady.
        </span>
      </p>

      <p className="mt-4 text-white/70 leading-relaxed">
        {r.name} was born on <strong>{r.birthDatePretty}</strong>, while Brady was born
        on <strong>{bradyBornPretty}</strong>. {r.tagline}. Today, {r.name} is{" "}
        <strong>{r.age} years old</strong> and Brady is <strong>{bradyAge}</strong>.
      </p>

      <div className="mt-8">
        <PlayCTA />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-white/50">{r.name}</p>
          <p className="font-bold text-2xl mt-1">{r.age}</p>
          <p className="text-xs text-white/50 mt-1">Born {r.birthDatePretty}</p>
          <p className="text-xs text-white/40 mt-1">{r.sport}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-white/50">{BRADY_NAME}</p>
          <p className="font-bold text-2xl mt-1">{bradyAge}</p>
          <p className="text-xs text-white/50 mt-1">Born {bradyBornPretty}</p>
          <p className="text-xs text-white/40 mt-1">NFL</p>
        </div>
      </div>

      <hr className="my-10 border-white/10" />

      <h2 className="text-2xl font-bold">Closest birthdays to {r.name}</h2>
      <p className="mt-2 text-white/65 text-sm">
        Other athletes born around the same time, sorted by how close their birthdate is to {r.name}'s.
      </p>
      <ul className="mt-4 grid sm:grid-cols-2 gap-3">
        {related.map((rel) => {
          const relVerb = rel.older ? "older" : "younger";
          return (
            <li key={rel.slug} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Link
                href={`/older-than-brady/${rel.slug}`}
                className="font-semibold hover:underline"
              >
                {rel.name}
              </Link>
              <p className="text-sm text-white/65 mt-1">
                {rel.diff} {relVerb} than Brady · born {rel.birthDatePretty}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex justify-center">
        <PlayCTA />
      </div>

      <footer className="mt-10 pt-6 border-t border-white/10 text-sm text-white/50">
        <p>
          See more comparisons on the{" "}
          <Link href="/who-is-older-than-tom-brady" className="underline hover:text-white">
            full athlete list
          </Link>
          {" "}or read the{" "}
          <Link href="/blog" className="underline hover:text-white">
            blog
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
