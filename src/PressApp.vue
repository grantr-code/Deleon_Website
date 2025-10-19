<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" compact subpage />
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <section class="relative w-full">
        <div class="mx-auto max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-10 md:py-14">
          <!-- Meta -->
          <div class="flex items-center justify-between gap-6 border-b border-white/10 pb-4">
            <div class="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-brand-muted">
              <span>{{ date }}</span>
              <span>Press</span>
            </div>
            <a href="/" class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-brand-green hover:border-brand-green/60 transition-colors" aria-label="Back to home">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6l-6 6 6 6"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16"/>
              </svg>
            </a>
          </div>

          <!-- Title -->
          <h1 class="mt-6 text-white text-[clamp(28px,3.2vw,40px)] leading-[1.15] tracking-[-0.01em] max-w-4xl">
            Deleon secures $500,000 investment from Boost VC to advance at‑home biochemical sensing
          </h1>

          <!-- Hero media card style (consistent with News cards) -->
          <div class="mt-8">
            <div class="relative overflow-hidden bg-brand-card border border-white/10 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.6)]">
              <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-brand-green"></div>
              <div class="relative pt-[46%]">
                <img
                  src="/BrandAssets/news/analyzer.svg"
                  alt="Deleon analyzer illustration"
                  class="absolute inset-0 h-full w-full object-cover opacity-95"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          <!-- Body copy -->
          <article class="prose prose-invert max-w-3xl mt-10 leading-relaxed">
            <p>
              Deleon Technologies today announced a $500,000 investment from Boost VC. The
              financing strengthens Deleon’s momentum as the company builds a palm‑size device that
              turns a single drop of urine into clear, daily health insights.
            </p>
            <p>
              The Deleon platform brings real‑time biochemistry out of the laboratory and into daily
              workflows. In minutes, the device measures key metabolomic signals and translates them
              into simple guidance—supporting decisions around training, recovery, nutrition, and early
              indicators of health risk.
            </p>
            <p>
              Deleon’s engineering approach draws on experience building advanced instruments with NASA
              to detect hard‑to‑measure chemistry. The team is applying that rigor to a system designed
              for reliability, portability, and ease of use in the field.
            </p>
            <p>
              Funding will be used to accelerate product engineering, expand pilot deployments with
              partners, and grow the team across hardware, software, and applied science.
            </p>
            <p class="mt-6">
              For collaboration or recruiting inquiries, contact
              <a class="text-brand-green hover:underline" href="mailto:chad@deleon-omics.com">chad@deleon-omics.com</a>.
            </p>
          </article>

          <!-- Byline / footer meta -->
          <div class="mt-10 pt-6 border-t border-white/10 text-sm text-brand-muted">
            <div>Source: Deleon Newsroom</div>
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

const date = new Date().toLocaleDateString('en-US');
</script>

<style scoped>
/* Use prose to make paragraphs readable on dark background */
.prose :where(a) { text-decoration: none; }
</style>
