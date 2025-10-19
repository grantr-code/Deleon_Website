const THEME_KEY = 'site-theme';

function apply(val) {
  const root = document.documentElement;
  if (val === 'light') root.classList.add('theme-light');
  else root.classList.remove('theme-light');
}

try {
  const val = localStorage.getItem(THEME_KEY) || 'dark';
  apply(val);
} catch {}

window.addEventListener('storage', (e) => {
  if (e.key === THEME_KEY) apply(e.newValue);
});