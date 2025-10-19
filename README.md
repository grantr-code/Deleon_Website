Deleon — Vue + Tailwind (Vite)

This is a Vue 3, multi‑page Vite site. The design and Tailwind classes are preserved; content is object‑based and rendered via reusable components.

What’s Included
- `index.html` — Home entry (mounts `src/main.js`/`App.vue`)
- `teams.html`, `tactical.html`, `science.html`, `press.html`, `news.html`, `article.html` — additional entries
- `src/` — Vue app code
  - `src/content/siteData.js` — header/footer/nav and shared copy
  - `src/content/teamData.js` — team roster data
  - `src/components/*` — Header/Footer, Hero, background effects, sections
  - `src/lib/articles.js` — Markdown loader + article index
  - `src/styles/tailwind.css` — Tailwind entry (imports `theme.css`)
- `public/BrandAssets/*` — static assets served from root (`/BrandAssets/...`)
- Tailwind + PostCSS + Vite config

Develop
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Open the printed local URL; edits hot‑reload.

Build
- `npm run build` outputs to `dist/`
- `npm run preview` serves the built app locally

Deploy to Vercel
- Import in Vercel; it runs `npm run build` and serves `dist`.
- `vercel.json` sets clean URLs and redirects to pretty routes.

Customize Content
- Update `src/content/siteData.js` for nav, footer, and home sections.
- Articles live in `src/articles/*.md` (front‑matter supported).

Notes
- Theme: site theme state is persisted (`site-theme`) and applied early via `src/themeBoot.js`.
- Accessibility: Early Access panel uses focus‑safe drawer patterns and Escape/overlay to close.
- Cleanup: removed unused components (e.g., old blocks/tests not referenced) to keep bundle lean.
