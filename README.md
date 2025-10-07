Deployment version - https://music-frontend-iota.vercel.app/
# Music Frontend (Next.js + TS + Tailwind)

1) `.env.local` and set `NEXT_PUBLIC_BACKEND_URL` (default http://localhost:4000).
2) Run:
```bash
npm install
npm run dev
# open http://localhost:3000
```
Frontend (Next.js + TypeScript + Tailwind CSS)
Loads data immediately on first render—no button needed.

Top toolbar (single row) with:
        Language selector (at least English and German).
        Seed input and “Random” seed action.
        Likes slider (0–10, fractional allowed).
        View toggle on the right: Table or Gallery.

Live updates: any change refreshes the data instantly.
        Changing language or seed regenerates titles, artists, albums, genres, covers, and audio.
        Changing likes only updates the like counts.
Table view resets to page 1; Gallery view resets scroll to top.
Table View: paginated list; clicking a row expands details with cover, play button, and (if enabled) live-scrolling lyrics.
Gallery View: card grid with infinite scrolling.
Localization: all names/genres come from locale data files; adding a new region only requires a new locale file.
Export ZIP was intentionally removed (optional task).

Deployment note
Frontend expects the backend URL via an environment variable (NEXT_PUBLIC_BACKEND_URL).
No auth, no database, and no external services are required.
