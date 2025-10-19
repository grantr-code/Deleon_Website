import { ref, watch, computed } from 'vue';

const THEME_KEY = 'site-theme';
const themeRef = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY)) || 'dark'
);

function applyTheme(val) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (val === 'light') root.classList.add('theme-light');
  else root.classList.remove('theme-light');
}

// Apply current theme immediately
applyTheme(themeRef.value);

// Persist + re-apply on change
watch(themeRef, (val) => {
  try { localStorage.setItem(THEME_KEY, val); } catch {}
  applyTheme(val);
}, { immediate: false });

export function useSiteTheme() {
  return {
    theme: themeRef,
    isLight: computed(() => themeRef.value === 'light'),
    setTheme: (val) => (themeRef.value = val),
    toggleTheme: () => (themeRef.value = themeRef.value === 'light' ? 'dark' : 'light'),
  };
}