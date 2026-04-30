import type { MetadataRoute } from "next";
import { FEATURED_ATHLETES } from "@/lib/featured";
import { POSTS } from "@/lib/posts";
import { SITE_URL as BASE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE}/who-is-older-than-tom-brady`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9
    },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/solo`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/challenge`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/daily`, lastModified: now, changeFrequency: "daily", priority: 0.6 }
  ];

  const players: MetadataRoute.Sitemap = FEATURED_ATHLETES.map((a) => ({
    url: `${BASE}/older-than-brady/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  const articles: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7
  }));

  return [...core, ...players, ...articles];
}
