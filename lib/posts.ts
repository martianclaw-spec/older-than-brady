export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  readMins: number;
};

// Articles. Ordered newest-first. The body lives in the route file at
// app/blog/[slug]/page.tsx so we can use real JSX (links, components)
// without a markdown pipeline.
export const POSTS: Post[] = [
  {
    slug: "5-athletes-born-within-days-of-tom-brady",
    title: "5 Athletes Born Within Days of Tom Brady",
    description:
      "Plaxico Burress missed Brady's birthday by nine days. Roger Federer by five. The eerily-close birthdays of Brady's contemporaries.",
    date: "2026-04-30",
    readMins: 4
  },
  {
    slug: "bradys-generation-nfl-quarterbacks-of-the-70s",
    title: "Brady's Generation: NFL Quarterbacks Born in the '70s",
    description:
      "Manning, Brees, McNair, Romo, Roethlisberger — the QB class Brady grew up alongside, and how they stack up by birthdate.",
    date: "2026-04-30",
    readMins: 5
  }
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
