# Older Than Brady?

A quick, addictive NFL trivia game. Show a player, ask: were they born before or after Tom Brady (Aug 3, 1977)?

- **Solo mode** — endless rounds, current + best streak (saved in `localStorage`).
- **Challenge mode** — 10 rounds, deterministic from a URL seed (`/challenge?seed=abc12def`). Same seed → same 10 players in the same order, so you and a friend get an identical run.
- **Copy challenge link** button on home and challenge pages.
- No backend, no accounts, no database.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 (or pass `-p PORT` to `next dev`).

```bash
npm run build && npm start   # production build
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main

# create an empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/older-than-brady.git
git push -u origin main
```

(Or use the GitHub CLI: `gh repo create older-than-brady --public --source=. --remote=origin --push`.)

## Deploy to Vercel

Two paths — pick whichever you like.

### Option A — Vercel dashboard (recommended, no CLI)

1. Go to https://vercel.com/new and sign in with GitHub.
2. Click **Import Git Repository** and select your `older-than-brady` repo.
3. Vercel auto-detects Next.js. Leave all defaults:
   - Framework: **Next.js**
   - Build command: `next build`
   - Output: `.next`
   - Install command: `npm install`
4. Click **Deploy**. First build takes ~1 minute.
5. You'll get a live URL like `https://older-than-brady.vercel.app`. Share it.

Every push to `main` triggers a redeploy automatically.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel           # first run: creates the project and deploys a preview
vercel --prod    # promote to production
```

The first `vercel` run prompts for project name and team. Accept the defaults.

## Sharing the live URL

Once deployed:

- The home page generates a fresh seed on every visit. Click **Copy challenge link** to copy `https://your-app.vercel.app/challenge?seed=<seed>` and paste it to a friend.
- Or play through and use the share button on the results page (uses the native share sheet on mobile, falls back to clipboard).

## File map

- `app/page.tsx` — home
- `app/solo/page.tsx` — endless mode
- `app/challenge/page.tsx` — seeded 10-round mode
- `app/results/page.tsx` — final score + share
- `lib/game.ts` — seeded RNG (Mulberry32 + FNV-1a), age compare
- `lib/players.ts` — runtime player list (computes avatar URLs from `data/players.json`)
- `lib/storage.ts` — `localStorage` helpers
- `data/players.json` — 100+ NFL players, weighted heavily toward birthdates near Brady's

## Notes

- Avatars are initials-on-navy via [ui-avatars.com](https://ui-avatars.com). To use real photos, add an `imageUrl` field to entries in `data/players.json` and update `lib/players.ts` to prefer it over the generated default.
- Brady's age and "X years old" labels reflect the current date — no maintenance needed.
