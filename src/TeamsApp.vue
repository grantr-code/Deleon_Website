<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" compact subpage />
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <section class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-4 pb-6">
        <div class="border-t border-white/10"></div>
        <div class="mt-4 flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
          <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
          <span>For Teams</span>
        </div>
        <h1 class="mt-3 md:mt-4 text-[clamp(28px,4.4vw,54px)] leading-tight text-white">Pro, Olympic, and Collegiate Performance</h1>
        <p class="mt-4 text-brand-muted text-[clamp(16px,1.6vw,18px)] leading-relaxed max-w-4xl">
          Real-time metabolomics to guide training, fueling, and recovery—so athletes adapt faster, reduce risk, and deliver when it matters.
        </p>
      </section>

      <VideoOverlay
        heading="Metabolomics for Elite Performance"
        :overlay-text="'Turn a daily, 2‑minute test into precise recommendations for readiness, fueling, hydration, and recovery—tailored to each athlete, every day.'"
        :video="video"
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
                <h3 class="text-white font-semibold">Illness & Risk Flags</h3>
                <p class="mt-2 text-brand-muted">
                  Catch early signs of immune stress and energy imbalance to reduce soft‑tissue risk.
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
                <li>• Trends across microcycles, travel, and return‑to‑play phases</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter :data="data.footer" />
  </div>
</template>

<script setup>
import { siteData as data } from './content/siteData';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import VideoOverlay from './components/VideoOverlay.vue';

const video = {
  // Provide MOV and optionally MP4 when available for wider browser support
  srcMov: '/BrandAssets/Video.mov',
  poster: '/BrandAssets/Deleon_Logo_light.svg',
};
</script>
