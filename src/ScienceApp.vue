<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" compact subpage />

    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <section class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-4 pb-8">
        <div class="border-t border-white/10"></div>
        <div class="mt-4 flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
          <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
          <span>Science</span>
        </div>
        <h1 class="mt-3 md:mt-4 text-[clamp(28px,4.4vw,54px)] leading-tight text-white">One Drop. Boundless Insight.</h1>
        <p class="mt-4 text-brand-muted text-[clamp(16px,1.6vw,18px)] leading-relaxed max-w-4xl">
          We’re building field‑ready biochemistry guided by modern machine learning. Daily signals in, clear guidance out. The how is engineered; the experience is simple.
        </p>
        <p class="mt-2 text-brand-muted text-[clamp(14px,1.4vw,16px)]"><strong>Chad Pozarycki, PhD · José Andrade, MS</strong></p>
      </section>

      <!-- Scrollable infographic: CE separation + ML intake -->
      <section class="max-w-none px-0 pt-0 pb-8 md:pb-12">
        <ScienceInfographic />
      </section>

      <!-- Why now / opportunity section -->
      <section class="max-w-[1280px] mx-auto px-4 pt-2 pb-14">
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-12 lg:col-span-5">
            <h2 class="text-white text-[clamp(22px,2.8vw,32px)] leading-tight">Why now</h2>
            <p class="mt-3 text-brand-muted max-w-[62ch]">
              Human performance is governed by chemistry. Reading it in the real world unlocks a step‑change for readiness and health.
            </p>
            <p class="mt-3 text-brand-muted max-w-[62ch]">
              A simple daily sample. A universal app. Guidance you can trust.
            </p>
          </div>
          <div class="col-span-12 lg:col-span-7 grid sm:grid-cols-2 gap-8">
            <div>
              <h3 class="text-white font-semibold tracking-tight">The status quo underperforms</h3>
              <ul class="mt-3 space-y-1 text-brand-muted leading-relaxed">
                <li>Fragmented workflows</li>
                <li>Shallow signals</li>
                <li>Opaque results</li>
              </ul>
            </div>
            <div>
              <h3 class="text-white font-semibold tracking-tight">Our approach</h3>
              <ul class="mt-3 space-y-1 text-brand-muted leading-relaxed">
                <li>Clean signals first, models second</li>
                <li>Daily, low‑friction testing in a universal app</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Why we’re different -->
      <section id="why-different" class="max-w-[1280px] mx-auto px-4 pt-2 pb-14">
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-12 lg:col-span-5">
            <h2 class="text-white text-[clamp(22px,2.8vw,32px)] leading-tight">Why we’re different</h2>
            <p class="mt-3 text-brand-muted max-w-[62ch]">
              We make signals clear, then let models learn from trends. The result: specific, trustworthy guidance in the field.
            </p>
          </div>
          <div class="col-span-12 lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <h3 class="text-white font-semibold">Signals made clear</h3>
              <p class="mt-1 text-brand-muted">Cut through noise before modeling.</p>
            </div>
            <div>
              <h3 class="text-white font-semibold">Trends over snapshots</h3>
              <p class="mt-1 text-brand-muted">Daily cadence beats one‑off readings.</p>
            </div>
            <div>
              <h3 class="text-white font-semibold">Interpretable outputs</h3>
              <p class="mt-1 text-brand-muted">Clear reasons. Actionable next steps.</p>
            </div>
            <div>
              <h3 class="text-white font-semibold">Built for the field</h3>
              <p class="mt-1 text-brand-muted">Portable, rapid, and robust.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Foundations -->
      <section class="max-w-[1280px] mx-auto px-4 pt-2 pb-14">
        <div class="grid grid-cols-12 gap-8">
          <div class="col-span-12 lg:col-span-5">
            <h2 class="text-white text-[clamp(22px,2.8vw,32px)] leading-tight">From signals to a foundation model</h2>
            <p class="mt-3 text-brand-muted max-w-[60ch]">
              A learning system that understands human recovery, hydration, and readiness—improving with every sample.
            </p>
          </div>
          <div class="col-span-12 lg:col-span-7 grid sm:grid-cols-2 gap-x-10 gap-y-6">
            <div>
              <h3 class="text-white font-semibold">States, not snapshots</h3>
              <p class="mt-1 text-brand-muted">Understand where you are, not just a reading.</p>
            </div>
            <div>
              <h3 class="text-white font-semibold">Built to be trusted</h3>
              <p class="mt-1 text-brand-muted">Stability, confidence, and error‑aware guidance.</p>
            </div>
            <div>
              <h3 class="text-white font-semibold">Explainable outputs</h3>
              <p class="mt-1 text-brand-muted">Every recommendation has a reason.</p>
            </div>
            <div>
              <h3 class="text-white font-semibold">Engineering heritage</h3>
              <p class="mt-1 text-brand-muted">Rigor first; details when they matter.</p>
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
import ScienceInfographic from './components/ScienceInfographic.vue';
import { onMounted, ref, provide, watch } from 'vue';
import EarlyAccessDrawer from './components/EarlyAccessDrawer.vue';
import { useEarlyAccessPanel } from './composables/useEarlyAccessPanel';
import { useSiteTheme } from './composables/useSiteTheme';

// Keep header colors/logo in sync with the global site theme (light/dark)
const initialTheme = (typeof localStorage !== 'undefined' && localStorage.getItem('site-theme')) || 'dark';
const headerTheme = ref(initialTheme === 'light' ? 'light' : 'dark');
provide('headerTheme', headerTheme);
const { theme: siteTheme } = useSiteTheme();
watch(siteTheme, (val) => { headerTheme.value = val === 'light' ? 'light' : 'dark'; }, { immediate: true });

const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => { if (typeof window !== 'undefined' && window.location.hash === '#updates') openEarly(); });
</script>
