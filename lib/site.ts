// Single source of truth for the site's public URL. Override with the
// NEXT_PUBLIC_SITE_URL env var (set in Vercel project settings) once you
// move to a custom domain — no code changes needed elsewhere.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://older-than-brady.vercel.app";

export const SITE_NAME = "Older Than Brady?";
