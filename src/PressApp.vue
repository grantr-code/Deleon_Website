<template>
  <BasePageLayout compact subpage>
    <section class="relative w-full">
      <div class="section-container py-10 md:py-14">
        <!-- Meta -->
        <div class="flex items-center justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>{{ date }}</span>
            <span>Press</span>
          </div>
          <IconButton href="/" aria-label="Back to home" size="sm">
            <IconBackArrow />
          </IconButton>
        </div>

          <!-- Title -->
          <h1 class="mt-6 text-foreground text-[clamp(28px,3.2vw,40px)] leading-[1.15] tracking-[-0.01em] max-w-4xl">
            Deleon secures $500,000 investment from Boost VC to advance at‑home biochemical sensing
          </h1>

          <!-- Hero media card -->
          <div class="mt-8">
            <MediaCard
              src="/BrandAssets/news/analyzer.svg"
              alt="Deleon analyzer illustration"
              aspect-ratio="46%"
              image-class="opacity-95"
            />
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
              <a class="text-accent hover:underline" href="mailto:chad@deleon-omics.com">chad@deleon-omics.com</a>.
            </p>
          </article>

        <!-- Byline / footer meta -->
        <div class="mt-10 pt-6 border-t border-border text-sm text-muted-foreground">
          <div>Source: Deleon Newsroom</div>
        </div>
      </div>
    </section>
  </BasePageLayout>
</template>

<script setup>
import BasePageLayout from './components/BasePageLayout.vue';
import IconButton from './components/IconButton.vue';
import IconBackArrow from './components/icons/IconBackArrow.vue';
import MediaCard from './components/MediaCard.vue';

const date = new Date().toLocaleDateString('en-US');
</script>

<style scoped>
/* Use prose to make paragraphs readable on dark background */
.prose :where(a) { text-decoration: none; }
</style>
