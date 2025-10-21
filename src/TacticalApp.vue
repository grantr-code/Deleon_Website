<template>
  <BasePageLayout compact subpage>
    <SectionHeader
      label="Defense"
      title="For Military Wellness Operations"
      description="Understand force wellness in real time. Surface metabolic strain and emerging risks before they degrade readiness."
      padding-bottom="pb-6"
    />

    <VideoOverlay
      heading="Operational Metabolomics"
      :overlay-text="'A 2‑minute test translates into readiness and recovery guidance—plus anomaly detection that can flag emerging risks across units.'"
      :video="video"
      :enable-switcher="false"
      :ignore-tester-mode="true"
    />

    <!-- Analysis / Insights / Command (military copy) -->
    <section class="bg-white/[.02] border-y border-border">
      <OurPlatforms
        :headline="milPlatforms.headline"
        :emphasis="milPlatforms.emphasis"
        :items="milPlatforms.items"
        hide-header
      />
    </section>

    <!-- Operational capabilities -->
    <section class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-8 pb-10">
      <div class="border-t border-border mb-4"></div>
      <div class="flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-muted-foreground">
        <span class="inline-block h-2 w-2 rounded-full bg-accent"></span>
        <span>Capabilities</span>
      </div>
      <h2 class="mt-3 text-foreground text-[clamp(22px,2.8vw,32px)] leading-tight">What it enables in the field</h2>
      <div class="mt-4">
        <CapabilitiesList :items="capabilityItems" />
      </div>
    </section>
  </BasePageLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import BasePageLayout from './components/BasePageLayout.vue';
import SectionHeader from './components/SectionHeader.vue';
import VideoOverlay from './components/VideoOverlay.vue';
import OurPlatforms from './components/OurPlatforms.vue';
import CapabilitiesList from './components/CapabilitiesList.vue';
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

const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => { if (typeof window !== 'undefined' && window.location.hash === '#updates') openEarly(); });
</script>
