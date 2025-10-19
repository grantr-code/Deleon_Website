<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" compact subpage />
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <section class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-4 pb-10">
        <div class="border-t border-white/10"></div>
        <div class="mt-4 flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
          <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
          <span>Team</span>
        </div>
        <h1 class="mt-3 md:mt-4 text-[clamp(28px,4.4vw,54px)] leading-tight text-white">Meet the Team</h1>
        <p class="mt-4 text-brand-muted text-[clamp(16px,1.6vw,18px)] leading-relaxed max-w-4xl">
          Our journey began in Atlanta, and our expertise is rooted in our training at Georgia Tech. With guidance from respected Georgia Tech professors on our advisory board, our team brings technical precision and real-world experience to Deleon.
        </p>
      </section>

      <TeamGrid :groups="groups" />
    </main>
    <SiteFooter :data="data.footer" />
  </div>
  <EarlyAccessDrawer />
</template>

<script setup>
import { computed, ref, provide, watch, onMounted } from 'vue';
import { siteData as data } from './content/siteData';
import { teamData } from './content/teamData';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import TeamGrid from './components/TeamGrid.vue';
import { useSiteTheme } from './composables/useSiteTheme';
import EarlyAccessDrawer from './components/EarlyAccessDrawer.vue';
import { useEarlyAccessPanel } from './composables/useEarlyAccessPanel';

const groups = computed(() => teamData.groups || []);

const headerTheme = ref('dark');
provide('headerTheme', headerTheme);
const { theme: siteTheme } = useSiteTheme();
watch(siteTheme, (val) => { headerTheme.value = val === 'light' ? 'light' : 'dark'; }, { immediate: true });

const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => { if (typeof window !== 'undefined' && window.location.hash === '#updates') openEarly(); });
</script>
