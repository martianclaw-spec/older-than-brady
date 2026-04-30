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
    slug: "how-old-is-tom-brady",
    title: "How Old Is Tom Brady? Birthday, Career, and the Math on His Age",
    description:
      "Tom Brady was born August 3, 1977. Here's exactly how old he is today, his career timeline, and how his age compares to other quarterbacks of his generation.",
    date: "2026-04-30",
    readMins: 4
  },
  {
    slug: "tom-brady-vs-lebron-james-whos-older",
    title: "Tom Brady vs LeBron James: Who's Older?",
    description:
      "Born seven years apart, the two GOATs of their sports represent different generations. Here's the side-by-side birthdate breakdown.",
    date: "2026-04-30",
    readMins: 3
  },
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
