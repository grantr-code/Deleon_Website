<template>
  <!-- Header + full-bleed hero (no side margins) -->
  <div class="w-screen">
    <SiteHeader :data="data.header" :overlap="true" />
    <HeroBand />
  </div>

  <!-- Constrained content area (16:10 ratio) -->
  <div class="aspect-guard">
    <main id="main-content" tabindex="-1" class="relative bg-background text-foreground">
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
import { computed, provide, onMounted } from 'vue';
import { siteData as data } from '../content/siteData';
import SiteHeader from '../components/SiteHeader.vue';
import SiteFooter from '../components/SiteFooter.vue';
import HeroBand from '../components/HeroBand.vue';
import OurPlatforms from '../components/OurPlatforms.vue';
import DeExtinctionSection from '../components/DeExtinctionSection.vue';
import { useSiteTheme } from '../composables/useSiteTheme';
import EarlyAccessDrawer from '../components/EarlyAccessDrawer.vue';
import { useEarlyAccessPanel } from '../composables/useEarlyAccessPanel';

const platforms = computed(() => data.sections.find(s => s.type === 'platforms'));

// Site-wide theme
const { theme: siteTheme } = useSiteTheme();
provide('siteTheme', siteTheme);

// Open Early Access panel if URL hash requests it
const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hash === '#updates') {
    openEarly();
  }
});
</script>
