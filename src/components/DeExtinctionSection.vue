<template>
  <section
    ref="sectionRef"
    class="relative w-full overflow-hidden bg-background text-foreground mt-6 md:mt-8"
    :style="sectionStyle"
  >
    <!-- Top hairline full-bleed to match bottom line -->
    <div class="border-t border-border"></div>

    <!-- Grid lines removed per user request -->

    <!-- Video positioned to right edge, flush with top -->
    <div class="hidden md:block absolute top-0 right-0 z-10 w-[45%] lg:w-[48%] xl:w-[50%]">
      <div
        class="relative w-full bg-card dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] overflow-hidden"
        :style="videoHeightStyle"
      >
        <!-- Left accent removed per user request -->
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
          autoplay
          preload="auto"
          :style="{ opacity: isPlaying ? 1 : 0, transition: 'opacity 300ms ease' }"
          @loadeddata="onLoadedData"
          @canplay="onCanPlay"
          @playing="onPlaying"
          @error="onVideoError"
        >
          <!-- Prefer MP4 first for better browser compatibility; MOV as fallback -->
          <source :src="'/BrandAssets/Video.mp4'" type="video/mp4" />
          <source :src="'/BrandAssets/Video.mov'" type="video/quicktime" />
        </video>
      </div>
    </div>

    <!-- Content wrapper with text on left -->
    <div class="relative z-30 section-container py-6 md:py-14">
      <!-- Text content -->
      <div ref="textContentRef" class="md:max-w-[48%] lg:max-w-[45%] xl:max-w-[42%]">
        <p class="text-foreground text-[clamp(18px,2.2vw,28px)] leading-[1.28] tracking-[-0.005em]">
          From a drop of urine to individualized guidance in minutes—optimize your performance, wellness, and training.
        </p>

        <!-- CTA pill -->
        <div class="mt-6 md:mt-10">
          <CTAButton
            label="See Deleon in action"
            action="Request a demo"
            :clickHandler="openContactDrawer"
          />
        </div>
      </div>
    </div>

    <!-- Mobile: Full-width video stacked on top -->
    <div class="md:hidden px-4 pb-6">
      <div
        class="relative w-full bg-card dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] overflow-hidden"
        style="aspect-ratio: 5/3;"
      >
        <!-- Left accent removed per user request -->
        <!-- First-frame canvas backdrop (mobile uses same refs) -->
        <canvas
          ref="posterCanvasMobile"
          class="absolute inset-0 block w-full h-full pointer-events-none"
          :style="{ opacity: isPlaying ? 0 : 1, transition: 'opacity 200ms ease' }"
        ></canvas>
        <video
          ref="videoRefMobile"
          class="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsinline
          autoplay
          preload="auto"
          :style="{ opacity: isPlaying ? 1 : 0, transition: 'opacity 300ms ease' }"
          @loadeddata="onLoadedDataMobile"
          @canplay="onCanPlayMobile"
          @playing="onPlaying"
          @error="onVideoError"
        >
          <!-- Prefer MP4 first for better browser compatibility; MOV as fallback -->
          <source :src="'/BrandAssets/Video.mp4'" type="video/mp4" />
          <source :src="'/BrandAssets/Video.mov'" type="video/quicktime" />
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
import CTAButton from './CTAButton.vue';
import { useEarlyAccessPanel } from '../composables/useEarlyAccessPanel';

const { open: openContactDrawer } = useEarlyAccessPanel();

// Create subtle vertical column guides using CSS gradients
const gridLinesStyle = computed(() => ({
  backgroundImage:
    'linear-gradient(to right, hsl(var(--foreground) / 0.12) 1px, transparent 1px)',
  backgroundSize: '33.333% 100%',
  backgroundRepeat: 'repeat-x',
}));

// Lightweight contour-line pattern using multiple repeating gradients
const topoStyle = computed(() => ({
  backgroundImage: [
    'repeating-radial-gradient(circle at 60% 20%, hsl(var(--foreground) / 0.08) 0, hsl(var(--foreground) / 0.08) 2px, transparent 3px, transparent 12px)',
    'repeating-linear-gradient(135deg, hsl(var(--foreground) / 0.05) 0, hsl(var(--foreground) / 0.05) 1px, transparent 1px, transparent 12px)'
  ].join(','),
  backgroundBlendMode: 'screen',
}));

const sectionRef = ref(null);
const videoRef = ref(null);
const videoRefMobile = ref(null);
const posterCanvas = ref(null);
const posterCanvasMobile = ref(null);
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

  // Autoplay control for desktop and mobile videos
  const videos = [videoRef.value, videoRefMobile.value].filter(Boolean);
  const ios = [];
  const tryPlay = (el) => {
    if (!el) return;
    el.muted = true;
    const p = el.play();
    if (p && typeof p.then === 'function') p.catch(() => {});
  };

  if (typeof IntersectionObserver !== 'undefined') {
    for (const el of videos) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.15) {
            tryPlay(el);
          } else {
            el.pause();
          }
        }
      }, { threshold: [0, 0.15, 0.5, 1] });
      io.observe(el);
      ios.push(io);
    }

    const vis = () => {
      if (document.visibilityState === 'hidden') {
        for (const el of videos) el.pause();
      } else {
        for (const el of videos) tryPlay(el);
      }
    };
    document.addEventListener('visibilitychange', vis);

    onBeforeUnmount(() => {
      for (const io of ios) io.disconnect();
      document.removeEventListener('visibilitychange', vis);
      window.removeEventListener('resize', onResize);
      if (resizeObserver) resizeObserver.disconnect();
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize);
});

function drawFrame(vid, cvs) {
  if (!vid || !cvs) return;
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

function onLoadedData() { drawFrame(videoRef.value, posterCanvas.value); }
function onCanPlay() { drawFrame(videoRef.value, posterCanvas.value); }
function onLoadedDataMobile() { drawFrame(videoRefMobile.value, posterCanvasMobile.value); }
function onCanPlayMobile() {
  drawFrame(videoRefMobile.value, posterCanvasMobile.value);
  isPlaying.value = true;
}
function onPlaying() { isPlaying.value = true; }
function onVideoError() { /* no-op: ignore autoplay errors */ }
</script>

<style scoped>
/* No additional CSS; all visual details are Tailwind/inline styles. */
</style>
