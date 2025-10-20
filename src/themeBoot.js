const THEME_KEY = 'site-theme';

function applyTheme(val) {
  const root = document.documentElement;
  if (val === 'light') root.classList.add('theme-light');
  else root.classList.remove('theme-light');
}

try {
  const val = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(val);
} catch {}

window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY) applyTheme(e.newValue);
});
