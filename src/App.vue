<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" />
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <HeroBand :enable-switcher="true" />


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
  
</template>

<script setup>
import { computed } from 'vue';
import { siteData as data } from './content/siteData';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import HeroBand from './components/HeroBand.vue';
import OurPlatforms from './components/OurPlatforms.vue';
import DeExtinctionSection from './components/DeExtinctionSection.vue';

const platforms = computed(() => data.sections.find(s => s.type === 'platforms'));
</script>
