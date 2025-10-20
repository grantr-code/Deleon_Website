<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" compact subpage />
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <section class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-4 pb-6">
        <div class="border-t border-white/10"></div>
        <div class="mt-4 flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
          <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
          <span>Defense</span>
        </div>
        <h1 class="mt-3 md:mt-4 text-[clamp(28px,4.4vw,54px)] leading-tight text-white">For Military Wellness Operations</h1>
        <p class="mt-4 text-brand-muted text-[clamp(16px,1.6vw,18px)] leading-relaxed max-w-4xl">
          Understand force wellness in real time. Surface metabolic strain and emerging risks before they degrade readiness.
        </p>
      </section>

      <VideoOverlay
        heading="Operational Metabolomics"
        :overlay-text="'A 2‑minute test translates into readiness and recovery guidance—plus anomaly detection that can flag emerging risks across units.'"
        :video="video"
        :enable-switcher="false"
        :ignore-tester-mode="true"
      />

      <!-- Analysis / Insights / Command (military copy) -->
      <section class="bg-white/[.02] border-y border-white/10">
        <OurPlatforms
          :headline="milPlatforms.headline"
          :emphasis="milPlatforms.emphasis"
          :items="milPlatforms.items"
          hide-header
        />
      </section>

      <!-- Operational capabilities: simplified list to match site language -->
      <section class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-8 pb-10">
        <div class="border-t border-white/10 mb-4"></div>
        <div class="flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
          <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
          <span>Capabilities</span>
        </div>
        <h2 class="mt-3 text-white text-[clamp(22px,2.8vw,32px)] leading-tight">What it enables in the field</h2>

        <div class="mt-4">
          <CapabilitiesList :items="capabilityItems" />
        </div>
      </section>
    </main>
    <SiteFooter :data="data.footer" />
  </div>
  <EarlyAccessDrawer />
</template>

<script setup>
import { siteData as data } from './content/siteData';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import VideoOverlay from './components/VideoOverlay.vue';
import OurPlatforms from './components/OurPlatforms.vue';
import CapabilitiesList from './components/CapabilitiesList.vue';
import { ref, provide, watch, onMounted } from 'vue';
import { useSiteTheme } from './composables/useSiteTheme';
import EarlyAccessDrawer from './components/EarlyAccessDrawer.vue';
import { useEarlyAccessPanel } from './composables/useEarlyAccessPanel';

const video = {
  srcMp4: '/BrandAssets/Video_Military.mp4',
  srcMov: '/BrandAssets/Video_Military.mov',
  poster: '/BrandAssets/Deleon_Logo_light.svg',
};

// Military-focused copy mirroring the home page layout
const milPlatforms = {
  headline: 'Bring field biochemistry into daily operations for readiness and early warning.',
  emphasis: 'daily operations',
  items: [
    {
      name: 'Detection',
      tag: 'Portable Device',
      title: 'Field‑ready biochemical analysis in minutes',
      description: 'Portable analyzer runs metabolomics at point of need.',
      long: 'Ruggedized, portable analyzer processes a drop of urine and returns mission‑relevant biomarkers in minutes—no shipping, no lab queue. Built for training sites and deployed environments.',
      effect: 'grid',
    },
    {
      name: 'Guidance',
      tag: 'Unit + Individual',
      title: 'Turn biomarkers into operational guidance',
      description: 'Actionable guidance on heat risk and recovery.',
      long: 'Models translate analytes into guidance for medics, leaders, and service members—readiness, fatigue, and early illness signals—tuned to mission tempo.',
      effect: 'orbits',
    },
    {
      name: 'Operations',
      tag: 'Workflow',
      title: 'A common operating picture for force wellness',
      description: 'Trends, risk flags, and anomaly detection across units.',
      long: 'Dashboards show trends, highlight emerging illness clusters and heat risk, and surface outliers for intervention. Works in low‑connectivity environments with sync when available.',
      effect: 'radar',
    },
  ],
};

const capabilityItems = [
  { title: 'Readiness & Load', text: 'Identify under‑recovery and elevated strain; align tasking and training in near‑real time.' },
  { title: 'Heat Risk', text: 'Reduce heat‑related incidents during high‑tempo ops with targeted guidance.' },
  { title: 'Illness Early Warning', text: 'Flag biochemical patterns indicative of infection for earlier isolation and care.' },
  { title: 'Sleep & Fatigue', text: 'Spot cumulative fatigue; schedule rest windows without compromising mission tempo.' },
  { title: 'Nutrition Under Load', text: 'Optimize fueling under rations to sustain output across days in field conditions.' },
  { title: 'Anomaly Detection', text: 'Surface unusual signatures that may signal environmental or novel threats across units.' },
];

const initialTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('site-theme')) || 'light';
const headerTheme = ref(initialTheme === 'light' ? 'light' : 'dark');
provide('headerTheme', headerTheme);
const { theme: siteTheme } = useSiteTheme();
watch(siteTheme, (val) => { headerTheme.value = val === 'light' ? 'light' : 'dark'; }, { immediate: true });

const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => { if (typeof window !== 'undefined' && window.location.hash === '#updates') openEarly(); });
</script>
