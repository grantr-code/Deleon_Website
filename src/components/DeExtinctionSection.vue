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
      class="pointer-events-none absolute inset-0 opacity-30 z-0 hidden md:block"
      :style="gridLinesStyle"
    ></div>

    <!-- Video positioned to right edge, flush with top -->
    <div class="hidden md:block absolute top-0 right-0 z-10 w-[45%] lg:w-[48%] xl:w-[50%]">
      <div
        class="relative w-full bg-black/80 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] overflow-hidden"
        :style="videoHeightStyle"
      >
        <!-- Thematic left accent to match cards elsewhere -->
        <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-brand-green" aria-hidden="true"></div>
        <!-- First-frame canvas backdrop -->
        <canvas
          ref="posterCanvas"
          class="absolute inset-0 block w-full h-full pointer-events-none"
          :style="{ opacity: isPlaying ? 0 : 1, transition: 'opacity 200ms ease' }"
        ></canvas>
        <video
          ref="videoRef"
          class="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsinline
          preload="metadata"
          :style="{ opacity: isPlaying ? 1 : 0, transition: 'opacity 300ms ease' }"
          @loadeddata="onLoadedData"
          @canplay="onCanPlay"
          @playing="onPlaying"
        >
          <!-- Prefer MOV first; MP4 as fallback -->
          <source :src="'/BrandAssets/Video.mov'" type="video/quicktime" />
          <source :src="'/BrandAssets/Video.mp4'" type="video/mp4" />
        </video>
      </div>
    </div>

    <!-- Content wrapper with text on left -->
    <div class="relative z-30 mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-6 md:py-14 max-w-none">
      <!-- Text content -->
      <div ref="textContentRef" class="md:max-w-[48%] lg:max-w-[45%] xl:max-w-[42%]">
        <p class="text-white text-[clamp(18px,2.2vw,28px)] leading-[1.28] tracking-[-0.005em]">
          From a drop of urine to individualized guidance in minutes—optimize your performance, wellness, and training.
        </p>

        <!-- CTA pill -->
        <div class="mt-6 md:mt-10">
          <a href="mailto:chad@deleon-omics.com,jose@deleon-omics.com" class="group inline-flex md:inline-flex w-full md:w-auto items-center justify-between md:justify-start gap-4 md:gap-6 rounded-full border border-white/20 px-5 sm:px-7 py-4 sm:py-5 bg-white/[.02] hover:bg-white/[.05] hover:border-brand-green/60 transition-colors">
            <span class="text-left">
              <span class="block text-sm text-brand-muted">See Deleon in action</span>
              <span class="block text-[clamp(16px,1.3vw,18px)] text-white">Request a demo</span>
            </span>
            <span class="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 text-white group-hover:border-brand-green/60">
              +
            </span>
          </a>
        </div>
      </div>
    </div>

    <!-- Mobile: Full-width video stacked on top -->
    <div class="md:hidden px-4 pb-6">
      <div
        class="relative w-full bg-black/80 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] overflow-hidden"
        style="aspect-ratio: 5/3;"
      >
        <!-- Thematic left accent to match cards elsewhere -->
        <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-brand-green" aria-hidden="true"></div>
        <!-- First-frame canvas backdrop (mobile uses same refs) -->
        <canvas
          class="absolute inset-0 block w-full h-full pointer-events-none"
          :style="{ opacity: isPlaying ? 0 : 1, transition: 'opacity 200ms ease' }"
        ></canvas>
        <video
          class="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsinline
          preload="metadata"
          :style="{ opacity: isPlaying ? 1 : 0, transition: 'opacity 300ms ease' }"
        >
          <!-- Prefer MOV first; MP4 as fallback -->
          <source :src="'/BrandAssets/Video.mov'" type="video/quicktime" />
          <source :src="'/BrandAssets/Video.mp4'" type="video/mp4" />
        </video>
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

const sectionRef = ref(null);
const videoRef = ref(null);
const posterCanvas = ref(null);
const textContentRef = ref(null);
const isPlaying = ref(false);

// Track text content height to size video accordingly
const textContentHeight = ref(0);
const vw = ref(typeof window !== 'undefined' ? window.innerWidth : 1200);

function updateTextContentHeight() {
  if (textContentRef.value) {
    textContentHeight.value = textContentRef.value.offsetHeight;
  }
}

function onResize() {
  vw.value = window.innerWidth;
  updateTextContentHeight();
}

// Calculate video height to extend below the button by a bit
const videoHeightStyle = computed(() => {
  if (vw.value < 768) return { aspectRatio: '5/3' }; // Mobile uses aspect ratio

  // Add 100px below the content to ensure it extends well past the button
  const minVideoHeight = textContentHeight.value + 100;

  // Fallback to aspect ratio if no content height measured yet
  if (minVideoHeight < 100) {
    return { aspectRatio: '5/3' };
  }

  return {
    height: minVideoHeight + 'px',
    minHeight: minVideoHeight + 'px'
  };
});

// Calculate section min-height based on video height
const sectionStyle = computed(() => {
  if (vw.value < 768) return {}; // Mobile doesn't need min-height

  const videoHeight = textContentHeight.value + 100;

  // Add padding (py-14 = 3.5rem = 56px top + 56px bottom)
  const minHeight = Math.max(videoHeight + 112, 400);

  return { minHeight: minHeight + 'px' };
});

onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true });

  // Initial measurement of text content
  updateTextContentHeight();

  // Watch for text content size changes
  let resizeObserver;
  if (textContentRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateTextContentHeight();
    });
    resizeObserver.observe(textContentRef.value);
  }

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
      window.removeEventListener('resize', onResize);
      if (resizeObserver) resizeObserver.disconnect();
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

function drawFirstFrame() {
  const vid = videoRef.value;
  const cvs = posterCanvas.value;
  if (!vid || !cvs) return;

  // Get actual rendered dimensions from the video container
  const container = vid.parentElement;
  if (!container) return;

  const w = Math.floor(container.clientWidth);
  const h = Math.floor(container.clientHeight);
  if (!w || !h || !vid.videoWidth || !vid.videoHeight) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cvs.width = Math.floor(w * dpr);
  cvs.height = Math.floor(h * dpr);

  const ctx = cvs.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const vw = vid.videoWidth, vh = vid.videoHeight;
  const scale = Math.max(w / vw, h / vh);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (vw - sw) / 2;
  const sy = (vh - sh) / 2;

  try {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(vid, sx, sy, sw, sh, 0, 0, w, h);
  } catch {}
}

function onLoadedData() { drawFirstFrame(); }
function onCanPlay() { drawFirstFrame(); }
function onPlaying() { isPlaying.value = true; }
</script>

<style scoped>
/* No additional CSS; all visual details are Tailwind/inline styles. */
</style>
