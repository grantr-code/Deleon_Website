const THEME_KEY = 'site-theme';

function applyTheme(val) {
  const root = document.documentElement;
  // Apply Tailwind's dark mode class strategy
  if (val === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

try {
  const val = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(val);
} catch {}

window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY) applyTheme(e.newValue);
});
