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
          In the age of AI, we must push the limits of human potential—by reprogramming our biochemistry. Deleon pairs capillary electrophoresis (CE) with modern ML to read the metabolites that track exercise, nutrition, sleep, and disease—every second of every day.
        </p>
        <p class="mt-2 text-brand-muted text-[clamp(14px,1.4vw,16px)]">Chad Pozarycki, PhD · José Andrade, MS</p>
      </section>

      <!-- Scrollable infographic: CE separation + ML intake -->
      <section class="max-w-none px-0 pt-0 pb-8 md:pb-12">
        <ScienceInfographic />
      </section>

      <!-- Why now / opportunity section -->
      <section class="max-w-[1280px] mx-auto px-4 pt-2 pb-14">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-12 lg:col-span-5">
            <h2 class="text-white text-[clamp(22px,2.8vw,32px)] leading-tight">Why now</h2>
            <p class="mt-3 text-brand-muted max-w-[62ch]">
              Billions of chemical reactions describe what you do and how you recover. Whoever maps them will unlock radically improved health for all—and build a generational company. But today, data is still trapped in biology.
            </p>
            <p class="mt-3 text-brand-muted max-w-[62ch]">
              Deleon’s Copilot for your biochemistry makes it practical: one drop of urine each day, at home, in a universal app.
            </p>
          </div>
          <div class="col-span-12 lg:col-span-7">
            <div class="rounded-lg border border-white/10 p-5 bg-white/5">
              <h3 class="text-white font-semibold mb-3">The status quo underperforms</h3>
              <ul class="list-disc pl-5 space-y-2 text-brand-muted">
                <li>Service labs: poor time resolution and fragmented workflows</li>
                <li>Wearables & CGMs: shallow signals; error rates too high for insight</li>
              </ul>
              <h3 class="text-white font-semibold mt-5 mb-3">Deleon’s approach</h3>
              <ul class="list-disc pl-5 space-y-2 text-brand-muted">
                <li>Daily, low‑cost CE chemistry with NASA‑grade rigor</li>
                <li>Compact, user‑friendly device (Otea) + universal app</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Foundations -->
      <section class="max-w-[1280px] mx-auto px-4 pt-2 pb-14">
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-12 lg:col-span-5">
            <h2 class="text-white text-[clamp(22px,2.8vw,32px)] leading-tight">From signals to a foundation model</h2>
            <p class="mt-3 text-brand-muted max-w-[60ch]">
              Our goal is a metabolomics foundation model—tailoring treatment, detecting disease years in advance, and accelerating research. We start with robust CE chemistry used on astronauts, then apply state‑of‑the‑art ML.
            </p>
          </div>
          <div class="col-span-12 lg:col-span-7">
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">From signals to states</h3>
                <p class="mt-2 text-brand-muted">Bayesian and state‑space models fuse multiple analytes into interpretable physiological states (readiness, hydration, recovery kinetics).</p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Robust to noise</h3>
                <p class="mt-2 text-brand-muted">Edge filtering, outlier suppression, and confidence bands ensure reliable trends—even with field data.</p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">Explainable outputs</h3>
                <p class="mt-2 text-brand-muted">Every recommendation traces back to contributing biomarkers and model features for auditability.</p>
              </div>
              <div class="rounded-lg border border-white/10 p-4 bg-white/5">
                <h3 class="text-white font-semibold">NASA heritage</h3>
                <p class="mt-2 text-brand-muted">CE‑LIF instrumentation and systems thinking proven in space programs, adapted for compact, daily use at low cost.</p>
              </div>
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
import ScienceInfographic from './components/ScienceInfographic.vue';
</script>
