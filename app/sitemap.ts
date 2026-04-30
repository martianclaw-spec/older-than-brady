import type { MetadataRoute } from "next";

const BASE = "https://older-than-brady.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE}/who-is-older-than-tom-brady`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9
    },
    { url: `${BASE}/solo`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/challenge`, lastModified: now, changeFrequency: "monthly", priority: 0.5 }
  ];
}
