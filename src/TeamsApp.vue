<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" compact subpage />
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <section class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-4 pb-6">
        <div class="border-t border-white/10"></div>
        <div class="mt-4 flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
          <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
          <span>For Athletes</span>
        </div>
        <h1 class="mt-3 md:mt-4 text-[clamp(28px,4.4vw,54px)] leading-tight text-white">Pro, Olympic, and Collegiate Performance</h1>
        <p class="mt-4 text-brand-muted text-[clamp(16px,1.6vw,18px)] leading-relaxed max-w-4xl">
          Get personalized biochemical data on training load and understand trends in your urine metabolome related to recovery time and injury risk. Be the first among your friends to use cutting‑edge technology—originally developed for astronauts.
        </p>
      </section>

      <VideoOverlay
        heading="Metabolomics for Elite Performance"
        :overlay-text="'Personalized biochemical data on training load with daily trends in your urine metabolome tied to recovery time and injury risk—powered by space‑grade tech.'"
        :video="video"
        :enable-switcher="false"
        :ignore-tester-mode="true"
      />

      <!-- Outcomes / value grid -->
      <section class="max-w-[1280px] mx-auto px-4 pt-10 pb-4">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-12 lg:col-span-4">
            <h2 class="text-white text-[clamp(22px,2.8vw,32px)] leading-tight">Make better decisions, daily</h2>
            <p class="mt-3 text-brand-muted">
              Deleon translates biochemical signals into actions staff can take immediately—before training, during travel, and in the 48 hours post‑competition.
            </p>
          </div>
          <div class="col-span-12 lg:col-span-8">
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Readiness & Load</h3>
                <p class="mt-2 text-brand-muted">
                  Detect under‑recovery and metabolic strain to tune session intensity and volume by athlete.
                </p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Fueling & Nutrition</h3>
                <p class="mt-2 text-brand-muted">
                  Optimize carbohydrate periodization, protein timing, and micronutrients based on actual utilization.
                </p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Hydration & Electrolytes</h3>
                <p class="mt-2 text-brand-muted">
                  Guide fluid and sodium strategies to stabilize output, especially in heat and back‑to‑backs.
                </p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Travel & Recovery</h3>
                <p class="mt-2 text-brand-muted">
                  Adjust sleep, light, and nutrition protocols for time zones and compressed schedules.
                </p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Injury Risk Signals</h3>
                <p class="mt-2 text-brand-muted">
                  Spot early biochemical patterns tied to injury risk and energy imbalance.
                </p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Return‑to‑Play</h3>
                <p class="mt-2 text-brand-muted">
                  Validate readiness milestones biochemically alongside GPS and force‑plate data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How it fits in the workflow -->
      <section class="max-w-[1280px] mx-auto px-4 pt-6 pb-12">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-12 lg:col-span-4"></div>
          <div class="col-span-12 lg:col-span-8">
            <div class="rounded-[10px] border border-white/10 p-5 md:p-6">
              <h2 class="text-white text-[clamp(20px,2.6vw,28px)]">Where it lands, every day</h2>
              <ul class="mt-3 space-y-2 text-brand-muted">
                <li>• A 2‑minute test after weigh‑in or pre‑session</li>
                <li>• Instant recommendations for staff and athlete (mobile + dashboard)</li>
                <li>• Color‑coded flags for readiness, fueling, hydration, and recovery</li>
                <li>• Trends in recovery time and injury risk across microcycles</li>
              </ul>
            </div>
          </div>
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
import { ref, provide, watch, onMounted } from 'vue';
import { useSiteTheme } from './composables/useSiteTheme';
import EarlyAccessDrawer from './components/EarlyAccessDrawer.vue';
import { useEarlyAccessPanel } from './composables/useEarlyAccessPanel';

const video = {
  // Provide MOV and optionally MP4 when available for wider browser support
  srcMp4: '/BrandAssets/Video.mp4',
  srcMov: '/BrandAssets/Video.mov',
  poster: '/BrandAssets/Deleon_Logo_light.svg',
};

// Provide header theme and keep it in sync with site theme
const initialTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('site-theme')) || 'light';
const headerTheme = ref(initialTheme === 'light' ? 'light' : 'dark');
provide('headerTheme', headerTheme);
const { theme: siteTheme } = useSiteTheme();
watch(siteTheme, (val) => { headerTheme.value = val === 'light' ? 'light' : 'dark'; }, { immediate: true });

const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => { if (typeof window !== 'undefined' && window.location.hash === '#updates') openEarly(); });
</script>
