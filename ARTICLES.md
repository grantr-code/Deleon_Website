# Articles & News – Author Guide

This site renders News/Press articles from Markdown files stored in `src/articles` and serves them to two pages:

- `news.html` – lists articles (9 per page) with pagination
- `article.html?slug=…` – renders a single article by slug

## Create a new article

1. Add a new Markdown file in `src/articles/` with a filename-based slug. Example:
   - `src/articles/2025-11-05-new-partnership.md`
2. Include YAML front‑matter at the top:

   ```yaml
   ---
   # Optional: if omitted, slug is the filename without .md
   slug: 2025-11-05-new-partnership

   # Required
   shortTitle: Brief headline for cards
   longTitle: Full headline for the article page
   date: 2025-11-05            # ISO format (YYYY-MM-DD)
   tag: Press                   # e.g., Press, News, Update
   author: Deleon Newsroom
   source: Press                # Small label shown on the image
   image: /articles/2025-11-05-new-partnership/hero.jpg
   # Optional: if present, shows a CTA button at the end of the article
   linkedin: https://www.linkedin.com/your-post
   ---
   ```

3. Write the body content in standard Markdown below the front‑matter. Basic formatting (headings, lists, links, images, code fences) is supported.

## Images

- Place article images under `public/articles/<slug>/…` so they deploy statically. Example:
  - `public/articles/2025-11-05-new-partnership/hero.jpg`
- Reference them from front‑matter and content with absolute paths, e.g. `/articles/2025-11-05-new-partnership/hero.jpg`.

## Slugs & linking

- The article slug defaults to the filename (without `.md`). You can override with `slug:` in front‑matter.
- Each article is accessible at:
  - `/article.html?slug=<your-slug>`
- The News listing is at:
  - `/news.html`

## Short vs. long titles

- `shortTitle` appears on cards and the homepage news row.
- `longTitle` appears as the main H1 on the article page.

## Pagination

- The News page shows 9 articles per page. Use the Previous/Next controls or `?page=N` in the URL to navigate.

## LinkedIn button

- Add a `linkedin:` URL in front‑matter to render a centered “View on LinkedIn” button at the end of the article. If omitted, the button is hidden.

## Tips

- Use standard Markdown; headings (`#`), lists, links, and images are supported.
- Keep hero images ~16:9 for best alignment in cards.
- Dates determine order (newest first). Use `date:` in front‑matter.
