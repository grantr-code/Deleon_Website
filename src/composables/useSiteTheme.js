import { ref, watch, computed } from 'vue';

const THEME_KEY = 'site-theme';
const themeRef = ref(
  (typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY)) || 'light'
);

function applyTheme(val) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  // Apply Tailwind's dark mode class strategy
  if (val === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
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
