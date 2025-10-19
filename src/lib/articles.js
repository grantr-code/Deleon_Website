import { marked } from 'marked';

// Configure marked for GitHub-like markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

// Import all markdown files from the articles directory as raw strings
// Vite will inline these at build time.
const rawModules = import.meta.glob('../articles/*.md', { query: '?raw', import: 'default', eager: true });

function slugFromPath(path) {
  // Example: '../articles/2025-10-19-boost-vc.md' -> '2025-10-19-boost-vc'
  const base = path.split('/').pop() || '';
  return base.replace(/\.md$/i, '');
}

function toDisplayDate(iso) {
  try {
    const d = new Date(iso);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('en-US');
  } catch {}
  return iso;
}

function parseFrontMatter(raw) {
  const out = { data: {}, content: raw || '' };
  if (!raw) return out;
  const lines = raw.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (!lines.length || lines[0].trim() !== '---') return out;
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
  if (end === -1) return out;
  const fmLines = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n');
  const data = {};
  for (const line of fmLines) {
    if (!line || /^\s*#/.test(line)) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    // Basic type coercion
    if (/^(true|false)$/i.test(val)) val = /^true$/i.test(val);
    data[key] = val;
  }
  out.data = data;
  out.content = body;
  return out;
}

// Build the in-memory article index once at import time
const allArticles = Object.entries(rawModules).map(([path, raw]) => {
  const { data: fm, content } = parseFrontMatter(raw || '');
  const slug = fm.slug || slugFromPath(path);
  const html = marked.parse(content || '');
  const date = fm.date || new Date().toISOString().slice(0, 10);
  const dateDisplay = fm.dateDisplay || toDisplayDate(date);

  return {
    slug,
    // Titles
    shortTitle: fm.shortTitle || fm.title || slug,
    longTitle: fm.longTitle || fm.title || fm.shortTitle || slug,
    // Meta
    date,
    dateDisplay,
    tag: fm.tag || 'News',
    author: fm.author || 'Deleon Newsroom',
    source: fm.source || fm.tag || 'News',
    linkedin: fm.linkedin || '',
    // Media
    image: fm.image || '/BrandAssets/news/analyzer.svg',
    // Content
    content: html,
    // Link target used across the site
    href: `/article.html?slug=${encodeURIComponent(slug)}`,
  };
}).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function getAllArticles() {
  return allArticles;
}

export function getArticleBySlug(slug) {
  return allArticles.find(a => a.slug === slug);
}
