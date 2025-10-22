<template>
  <div class="aspect-guard">
    <SiteHeader
      :data="headerData"
      :compact="compact"
      :subpage="subpage"
      :overlap="overlap"
    />
    <main id="main-content" tabindex="-1" class="relative bg-background text-foreground">
      <slot />
    </main>
    <SiteFooter :data="footerData" />
  </div>
  <EarlyAccessDrawer />
</template>

<script setup>
import { onMounted } from 'vue';
import { siteData } from '../content/siteData';
import SiteHeader from './SiteHeader.vue';
import SiteFooter from './SiteFooter.vue';
import EarlyAccessDrawer from './EarlyAccessDrawer.vue';
import { useEarlyAccessPanel } from '../composables/useEarlyAccessPanel';

const props = defineProps({
  // Whether header should be compact
  compact: {
    type: Boolean,
    default: false
  },
  // Whether this is a subpage
  subpage: {
    type: Boolean,
    default: false
  },
  // Whether header should overlap content
  overlap: {
    type: Boolean,
    default: false
  }
});

// Site data for header and footer
const headerData = siteData.header;
const footerData = siteData.footer;

// Open Early Access panel if URL hash requests it
const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hash === '#updates') {
    openEarly();
  }
});
</script>
