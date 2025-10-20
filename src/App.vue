<template>
  <!-- Header + full-bleed hero (no side margins) -->
  <div class="w-screen">
    <SiteHeader :data="data.header" :overlap="true" />
    <HeroBand />
  </div>

  <!-- Constrained content area (16:10 ratio) -->
  <div class="aspect-guard">
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <OurPlatforms
        v-if="platforms"
        :headline="platforms.headline"
        :emphasis="platforms.emphasis"
        :items="platforms.items"
      />

      <!-- De‑Extinction styled section (custom for this site) -->
      <DeExtinctionSection />
    </main>
    <SiteFooter :data="data.footer" />
  </div>

  <!-- Global Early Access Drawer -->
  <EarlyAccessDrawer />
  
</template>

<script setup>
import { computed, provide, ref, watch, onMounted } from 'vue';
import { siteData as data } from './content/siteData';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import HeroBand from './components/HeroBand.vue';
import OurPlatforms from './components/OurPlatforms.vue';
import DeExtinctionSection from './components/DeExtinctionSection.vue';
import { useSiteTheme } from './composables/useSiteTheme';
import EarlyAccessDrawer from './components/EarlyAccessDrawer.vue';
import { useEarlyAccessPanel } from './composables/useEarlyAccessPanel';

const platforms = computed(() => data.sections.find(s => s.type === 'platforms'));

// Provide a shared header theme so the hero can request a light header
// for bright backgrounds (e.g., Brownian Diffusion test background)
const initialTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('site-theme')) || 'light';
const headerTheme = ref(initialTheme === 'light' ? 'light' : 'dark');
provide('headerTheme', headerTheme);

// Site-wide theme (BETA)
const { theme: siteTheme } = useSiteTheme();
provide('siteTheme', siteTheme);

// Keep header theme aligned with site theme when light mode is active
watch(siteTheme, (val) => {
  headerTheme.value = val === 'light' ? 'light' : 'dark';
}, { immediate: true });

// Open Early Access panel if URL hash requests it
const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hash === '#updates') {
    openEarly();
  }
});
</script>

<style>
/* Light mode BETA overrides */
.theme-light body {
  background-color: #f7f8fa;
  color: #0b0b0f;
}

/* Map common brand tokens to light surfaces */
.theme-light .bg-brand-dark { background-color: #ffffff !important; }
.theme-light .bg-brand-card { background-color: #f3f4f6 !important; }

.theme-light .text-brand-text { color: #0b0b0f !important; }
.theme-light .text-brand-muted { color: #4b5563 !important; }

/* Common border/text utilities used across the site */
.theme-light .border-white\/10 { border-color: rgba(0,0,0,0.08) !important; }
.theme-light .border-white\/15 { border-color: rgba(0,0,0,0.12) !important; }
.theme-light .border-white\/20 { border-color: rgba(0,0,0,0.16) !important; }

.theme-light .text-white { color: #0b0b0f !important; }
.theme-light .text-white\/90 { color: rgba(11,11,15,0.90) !important; }
.theme-light .text-white\/80 { color: rgba(11,11,15,0.80) !important; }
.theme-light .text-white\/70 { color: rgba(11,11,15,0.70) !important; }

.theme-light .bg-black { background-color: #ffffff !important; }
.theme-light .bg-black\/50 { background-color: rgba(255,255,255,0.50) !important; }
.theme-light .bg-black\/40 { background-color: rgba(255,255,255,0.40) !important; }
.theme-light .hover\:bg-white\/10:hover { background-color: rgba(0,0,0,0.06) !important; }

/* Ensure header uses dark text in light mode */
.theme-light #site-header { color: #0b0b0f; }

/* Footer */
.theme-light #site-footer { background-color: #ffffff !important; }
</style>
