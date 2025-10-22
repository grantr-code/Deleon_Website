Deleon — Vue + Tailwind (Vite)

## Project Structure

### HTML Entry Points
- `index.html` — Home page (mounts `src/main.js` → `src/pages/HomePage.vue`)
- `about-us.html` — Company team page (formerly `team.html`)
- `for-athletes.html` — Athletes solution page (formerly `teams.html`)
- `tactical.html` — Military solution page
- `science.html` — Science/technology page
- `news.html` — News listing page
- `article.html` — Dynamic article viewer
- `press.html` — Redirect to latest press release (uses article system)
- `defense.html`, `military.html` — Legacy redirects to `tactical.html`

### Source Structure (`src/`)

#### Pages (`src/pages/`)
All page-level Vue components follow the `*Page.vue` naming pattern:
- `HomePage.vue` — Main landing page
- `AboutUsPage.vue` — Company team page
- `ForAthletesPage.vue` — Athletes solution page
- `TacticalPage.vue` — Military solution page
- `SciencePage.vue` — Science/technology page
- `NewsPage.vue` — News listing page
- `ArticlePage.vue` — Article viewer page

#### Entry Points (`src/`)
Each HTML file has a corresponding JS entry point:
- `main.js` → `HomePage.vue`
- `about-us.js` → `AboutUsPage.vue`
- `for-athletes.js` → `ForAthletesPage.vue`
- `tactical.js` → `TacticalPage.vue`
- `science.js` → `SciencePage.vue`
- `news.js` → `NewsPage.vue`
- `article.js` → `ArticlePage.vue`

#### Components (`src/components/`)
- `layout/` — BasePageLayout, SiteHeader, SiteFooter
- `effects/` — Visual effect components (BrownianEffect, ChemLatticeEffect, FlowFieldEffect, PulseGridEffect)
- `icons/` — Icon components (IconBackArrow, IconClose, IconHamburger, IconMoon, IconSun)
- Canvas components: GridCanvas, OrbitsCanvas, RadarCanvas
- Other UI components: CTAButton, ContactForm, MediaCard, TeamGrid, VideoOverlay, etc.

#### Content (`src/content/`)
- `siteData.js` — Navigation, footer, and shared site content
- `teamData.js` — Team member roster data

#### Articles (`src/articles/`)
Markdown files with frontmatter for news/press releases:
- Naming convention: `YYYY-MM-DD-slug.md`
- Processed by `src/lib/articles.js`
- Viewable at `/article.html?slug=YYYY-MM-DD-slug`

#### Other
- `composables/` — Vue composables (useEarlyAccessPanel, useSiteTheme)
- `lib/` — Utility functions (articles.js for markdown processing)
- `styles/` — Global styles (tailwind.css)
- `themeBoot.js` — Early theme initialization

## Development

### Quick Start
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (hot reload enabled)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Adding a New Page
1. Create HTML entry: `new-page.html` (copy from existing)
2. Create entry point: `src/new-page.js` (import from `src/pages/`)
3. Create page component: `src/pages/NewPagePage.vue`
4. Add to `vite.config.js` input object
5. Update navigation in `src/content/siteData.js`

### Adding a New Article
1. Create markdown file: `src/articles/YYYY-MM-DD-title.md`
2. Add frontmatter:
   ```yaml
   ---
   title: "Article Title"
   shortTitle: "Short Title"
   date: "YYYY-MM-DD"
   tag: "News"
   author: "Author Name"
   image: "/path/to/image.jpg"
   ---
   ```
3. Article automatically appears in news feed
4. Access at: `/article.html?slug=YYYY-MM-DD-title`

## Deployment

### Vercel
- Auto-deploys from main branch
- `vercel.json` configures:
  - Clean URLs (removes `.html` extensions)
  - Legacy URL redirects (team → about-us, teams → for-athletes)
  - Solution page redirects (military, defense → tactical)

## Customization

### Content Updates
- **Navigation**: Edit `src/content/siteData.js` → `header.nav`
- **Footer**: Edit `src/content/siteData.js` → `footer`
- **Home Sections**: Edit `src/content/siteData.js` → `sections`
- **Team Members**: Edit `src/content/teamData.js`

### Styling
- Theme colors: Defined in `src/styles/tailwind.css` using CSS variables
- Tailwind config: `tailwind.config.js`
- Dark mode: Uses class strategy (`dark:` prefix)

## File Naming Conventions

### Pages
- HTML files: `kebab-case.html` (e.g., `about-us.html`, `for-athletes.html`)
- Vue pages: `PascalCasePage.vue` (e.g., `AboutUsPage.vue`, `ForAthletesPage.vue`)
- Entry points: `kebab-case.js` matching HTML file names

### Components
- Reusable: `PascalCase.vue` (e.g., `CTAButton.vue`, `MediaCard.vue`)
- Effects: `PascalCaseEffect.vue` (e.g., `FlowFieldEffect.vue`)
- Icons: `Icon*.vue` (e.g., `IconBackArrow.vue`)

### Articles
- Format: `YYYY-MM-DD-kebab-case-title.md`
- Example: `2025-10-19-boost-vc.md`

## Technical Notes
- **Theme Persistence**: Theme preference stored in localStorage as `site-theme`
- **Accessibility**: Focus management, ARIA labels, keyboard navigation support
- **SEO**: Proper meta tags, canonical URLs, Open Graph tags
- **Performance**: Code splitting per page, lazy loading, optimized assets
