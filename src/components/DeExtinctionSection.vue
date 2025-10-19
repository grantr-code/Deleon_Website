<template>
  <section
    ref="sectionRef"
    class="relative w-full overflow-hidden bg-brand-dark text-brand-text mt-6 md:mt-8"
    :style="sectionStyle"
  >
    <!-- Top hairline full-bleed to match bottom line -->
    <div class="border-t border-white/10"></div>

    <!-- Full‑width subtle grid guide lines -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-30 z-0"
      :style="gridLinesStyle"
    ></div>

    <!-- Right-aligned video with only a left border (site hairline style) -->
    <div
      class="absolute top-0 right-0 z-10 overflow-hidden border-l-2 border-white/10 bg-black/80 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)]"
      :style="squareStyle"
    >
      <video
        ref="videoRef"
        class="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsinline
        preload="metadata"
      >
        <source :src="'/BrandAssets/Video.mp4'" type="video/mp4" />
        <source :src="'/BrandAssets/Video.mov'" type="video/quicktime" />
      </video>
    </div>

    <!-- Horizontal divider aligned to the bottom of the video -->
    <div
      class="pointer-events-none absolute left-0 right-0 border-t border-white/10 z-10"
      :style="videoBottomLineStyle"
      aria-hidden="true"
    ></div>

    <!-- Content wrapper (wide) -->
    <div class="relative z-20 mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-0 md:pt-14 pb-0 md:pb-0 max-w-none">
      <!-- Two-column layout: copy left, media right -->
      <div class="grid grid-cols-12 gap-x-6 md:gap-x-8 items-center md:items-start" :style="{ minHeight: videoHeightPx + 'px' }">
        <!-- Left copy block (sticky so it doesn't move while scrolling) -->
        <div class="col-span-12 md:col-span-7 lg:pr-8 xl:pr-12 2xl:pr-16 md:sticky md:top-24 md:max-w-[640px] xl:max-w-[700px] 2xl:max-w-[720px] w-full">
          <p class="text-white text-[clamp(20px,2.2vw,28px)] leading-[1.22] tracking-[-0.005em]">
            Real‑time biochemistry for people and teams. From a drop of urine to
            individualized guidance in minutes—for performance, health, and operations.
          </p>

          <!-- CTA pill -->
          <div class="mt-8 md:mt-10">
            <a href="mailto:chad@deleon-omics.com,jose@deleon-omics.com" class="group inline-flex items-center gap-6 rounded-full border border-white/20 px-6 sm:px-7 py-4 sm:py-5 bg-white/[.02] hover:bg-white/[.05] hover:border-brand-green/60 transition-colors">
              <span class="text-left">
                <span class="block text-sm text-brand-muted">See Deleon in action</span>
                <span class="block text-[clamp(16px,1.3vw,18px)] text-white">Request a demo</span>
              </span>
              <span class="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white group-hover:border-brand-green/60">
                +
              </span>
            </a>
          </div>
          <!-- Bottom left caption like the reference mark -->
          <div class="mt-6 md:mt-8 flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
            <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
            <span>For Teams, Clinics, and Labs</span>
          </div>
        </div>

        <!-- Right media collage -->
        <!-- Spacer column kept for large layouts; media is absolute so this is empty but preserves grid rhythm -->
        <div class="hidden md:block col-span-12 md:col-span-5 mt-10 md:mt-0"></div>
      </div>
    </div>
  </section>

  <!-- News/blog section directly following the video block -->
  <NewsSection />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import NewsSection from './NewsSection.vue';

// Create subtle vertical column guides using CSS gradients
const gridLinesStyle = computed(() => ({
  backgroundImage:
    'linear-gradient(to right, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0) 1px)',
  backgroundSize: '33.333% 100%',
  backgroundRepeat: 'repeat-x',
}));

// Lightweight contour-line pattern using multiple repeating gradients
const topoStyle = computed(() => ({
  backgroundImage: [
    'repeating-radial-gradient(circle at 60% 20%, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 3px, transparent 12px)',
    'repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 12px)'
  ].join(','),
  backgroundBlendMode: 'screen',
}));

// Keep a ref on the section (not required for sizing now but harmless)
const sectionRef = ref(null);
const videoRef = ref(null);

// Track viewport to size video with both height and width
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);
const vh = ref(typeof window !== 'undefined' ? window.innerHeight : 800);
function onResize() { vw.value = window.innerWidth; vh.value = window.innerHeight; }
onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true });

  // Play/pause the video only when visible to save CPU/bandwidth
  const el = videoRef.value;
  if (el && typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > 0.3) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      }
    }, { threshold: [0, 0.3, 0.6, 1] });
    io.observe(el);

    const vis = () => {
      if (document.visibilityState === 'hidden') el.pause();
    };
    document.addEventListener('visibilitychange', vis);

    // Cleanup
    onBeforeUnmount(() => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    });
  }
});
onBeforeUnmount(() => window.removeEventListener('resize', onResize));

// Video dimensions and dependent positions
const isMobile = computed(() => vw.value <= 767);
const videoWidthPx = computed(() => isMobile.value ? vw.value : Math.max(0.70 * vh.value, 0.45 * vw.value));
const videoHeightPx = computed(() => videoWidthPx.value * 0.60);

const squareStyle = computed(() => ({
  width: videoWidthPx.value + 'px',
  height: videoHeightPx.value + 'px',
}));

// Horizontal divider position at the bottom of the video
const videoBottomLineStyle = computed(() => ({ top: videoHeightPx.value + 'px' }));

// Make the section’s min-height match the video height to remove excess gap
const sectionStyle = computed(() => ({ minHeight: videoHeightPx.value + 'px' }));
</script>

<style scoped>
/* No additional CSS; all visual details are Tailwind/inline styles. */
</style>
