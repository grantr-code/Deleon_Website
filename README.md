Deleon — Vue + Tailwind (Vite)

This is the Vue 3 conversion of your static Tailwind site. The design and Tailwind classes are preserved; content is now object‑based and rendered via Vue components for the header, footer, and page blocks.

What’s Included
- `index.html` — Vite entry; mounts Vue app
- `src/` — Vue app (components + content objects)
  - `src/content/siteData.js` — single source of truth for header/footer/nav and page blocks
  - `src/components/*` — Header, Footer, Hero canvas, Steps canvas, Mission, Secondary, Video overlay
  - `src/styles/tailwind.css` — Tailwind entry
- `public/BrandAssets` — served at `/BrandAssets/*`
- Tailwind + PostCSS + Vite config

Develop
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Open the printed local URL; edits hot‑reload.

Build
- `npm run build` outputs to `dist/`
- `npm run preview` serves the built app locally

Deploy to Vercel
- Import the repo in Vercel. It auto‑detects Vite and runs `npm run build`; output directory is `dist`.
- `vercel.json` is optional; we keep `cleanUrls` only.

Customize Content
- Update `src/content/siteData.js` to change nav links, section copy, steps, overlay text, and footer links. No template edits required.

Notes
- Fonts are loaded from Google Fonts.
- Tailwind design tokens (brand colors, font) are in `tailwind.config.js`.
