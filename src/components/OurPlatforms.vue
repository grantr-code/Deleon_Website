<template>
  <section>
    <div
      id="our-platforms"
      ref="containerRef"
      :class="[
        'relative max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24',
        hideHeader ? 'pt-2 md:pt-3' : 'pt-8',
        'pb-12 md:pb-16'
      ]"
    >
      <!-- Optional header -->
      <div v-if="!hideHeader" :class="['relative', mode === 'full' ? 'mb-8' : (mode === 'slideshow' ? 'mb-4 md:mb-5' : 'mb-3 md:mb-4')]">
        <!-- Section label in green-dot style -->
        <div class="w-fit mx-0 text-left">
          <div class="flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
            <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
            <span>{{ labelText }}</span>
          </div>
        </div>
        <h2 class="mt-3 md:mt-4 text-[clamp(28px,4.8vw,58px)] leading-tight max-w-[1100px] text-white mx-auto text-center">
          <template v-if="headlineParts">
            <span>{{ headlineParts.before }}</span>
            <span class="text-brand-muted">{{ headlineParts.match }}</span>
            <span>{{ headlineParts.after }}</span>
          </template>
          <template v-else>{{ headline }}</template>
        </h2>
      </div>
      <div v-if="!hideHeader && mode !== 'full'" class="border-t border-white/10 my-3 md:my-4"></div>

      <!-- Mobile: slideshow above the list -->
      <div v-if="mode === 'mobile'" class="grid grid-cols-12 gap-6">
        <!-- Slideshow block on top -->
        <div class="col-span-12">
          <div class="relative h-[320px] sm:h-[380px] rounded-[10px] border border-white/10 overflow-hidden bg-brand-card">
            <div class="absolute inset-0">
              <transition name="slide-fade">
                <div :key="idx" class="absolute inset-0">
                  <component :is="canvasFor(items[idx])" v-if="canvasFor(items[idx])" />
                  <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
                  <div class="relative z-10 h-full flex flex-col justify-center gap-4 p-5 sm:p-6 text-white" :style="{ paddingTop: mobileChipsPad }">
                    <div>
                      <h3 class="text-[clamp(20px,5.0vw,30px)] leading-[1.1] mb-2">{{ items[idx].title }}</h3>
                      <p class="text-brand-muted text-sm max-w-[60ch]">{{ items[idx].long }}</p>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Top chips -->
            <div ref="chipsMobileRef" class="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-20">
              <button v-for="(p, i) in items" :key="'m-chip-' + i" @click="set(i)" class="px-3 py-1.5 rounded-md text-xs border transition"
                :class="i === idx ? 'bg-brand-green/10 border-brand-green/40 text-white' : 'bg-white/5 border-white/10 text-brand-muted hover:text-white'">
                {{ p.chip || p.name }}
              </button>
            </div>

            <!-- Prev/Next -->
            <div class="absolute bottom-3 right-3 flex gap-2 z-20">
              <button @click="prev" class="p-2 rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10" aria-label="Previous">‹</button>
              <button @click="next" class="p-2 rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10" aria-label="Next">›</button>
            </div>
          </div>
        </div>

        <!-- List below -->
        <div class="col-span-12">
          <ul role="tablist" aria-label="Platforms" class="divide-y divide-white/10 rounded-[10px] overflow-hidden bg-white/0">
            <li v-for="(p, i) in items" :key="'m-'+i" role="presentation">
              <div class="w-full text-left px-4 md:px-5 py-5 md:py-7">
                <div class="flex items-baseline justify-between gap-4">
                  <div>
                    <TypeOnView :text="p.name" :speed="24" tag="div"
                      wrapper-class="text-[clamp(26px,5.6vw,48px)] leading-none text-white" />
                    <p class="text-brand-muted mt-2 max-w-[42ch]">{{ p.description }}</p>
                  </div>
                  <div class="text-brand-muted text-sm">/{{ formatIndex(i) }}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Slideshow layout: list + sticky slideshow (tablets and laptops) -->
      <div v-if="mode === 'slideshow'" class="grid grid-cols-12 gap-6">
        <!-- List (left) with typing names -->
        <div class="col-span-12 md:col-span-6">
          <ul role="tablist" aria-label="Platforms" class="divide-y divide-white/10 rounded-[10px] overflow-hidden bg-white/0">
            <li v-for="(p, i) in items" :key="i" role="presentation">
              <button
                role="tab"
                type="button"
                :aria-selected="i === idx ? 'true' : 'false'"
                :tabindex="i === idx ? 0 : -1"
                class="w-full text-left px-4 md:px-5 py-6 md:py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60"
                @click="set(i)"
                @mouseenter="set(i)"
              >
                <div class="flex items-baseline justify-between gap-4">
                  <div>
                    <TypeOnView :text="p.name" :speed="24" tag="div"
                      wrapper-class="text-[clamp(26px,5.6vw,48px)] leading-none text-white" />
                    <p class="text-brand-muted text-sm md:text-base mt-2 max-w-[60ch]">{{ p.long || p.description }}</p>
                  </div>
                  <div class="text-brand-muted text-sm">/{{ formatIndex(i) }}</div>
                </div>
              </button>
            </li>
          </ul>
        </div>

        <!-- Sticky card (right) -->
        <div class="col-span-12 md:col-span-6">
          <div class="sticky top-10">
            <div class="relative h-[420px] sm:h-[480px] md:h-[560px] rounded-[10px] border border-white/10 overflow-hidden bg-brand-card">
              <!-- Slides -->
              <div class="absolute inset-0">
                <transition name="slide-fade">
                  <div :key="idx" class="absolute inset-0">
                    <component :is="canvasFor(items[idx])" v-if="canvasFor(items[idx])" />
                    <div class="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
                    <div class="relative z-10 h-full flex flex-col justify-center gap-4 md:gap-6 p-5 sm:p-6 md:p-8 text-white" :style="{ paddingTop: desktopChipsPad }">
                      <div>
                        <h3 class="text-[clamp(24px,4.2vw,46px)] leading-[1.05] mb-3">{{ items[idx].title }}</h3>
                        <p class="text-brand-muted text-sm md:text-base max-w-[60ch]">{{ items[idx].long }}</p>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Top chips -->
              <div ref="chipsDesktopRef" class="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 z-20">
                <button v-for="(p, i) in items" :key="'chip-' + i" @click="set(i)" class="px-3 py-1.5 rounded-md text-xs border transition"
                  :class="i === idx ? 'bg-brand-green/10 border-brand-green/40 text-white' : 'bg-white/5 border-white/10 text-brand-muted hover:text-white'">
                  {{ p.chip || p.name }}
                </button>
              </div>

              <!-- Prev/Next -->
              <div class="absolute bottom-3 right-3 flex gap-2 z-20">
                <button @click="prev" class="p-2 rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10" aria-label="Previous">‹</button>
                <button @click="next" class="p-2 rounded-md bg-white/5 border border-white/10 text-white hover:bg-white/10" aria-label="Next">›</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Full-bleed divider before full-width rows so the header feels connected -->
    <div v-if="mode === 'full'" class="border-t border-white/10 my-0"></div>

    <!-- Desktop layout: full-width rows with big text and hover preview -->
    <div v-if="mode === 'full'" class="mt-4 md:mt-5">
      <div class="space-y-10">
          <div
            v-for="(p, i) in items"
            :key="'wide-' + i"
          class="group relative overflow-hidden border-y border-white/10 bg-white/[.02] hover:bg-white/[.04] transition-colors"
          :style="fullRowStyle"
          @mouseenter="hoverIndex = i"
          @mouseleave="hoverIndex = -1"
        >
          <!-- Hover preview (reuses slide content) with bounded overlay text -->
          <div
            class="absolute inset-y-0 rounded-none overflow-hidden border-x border-y-0 border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
            :style="{ left: fullPreviewLeft, width: previewW + 'px' }"
            aria-hidden="true"
          >
            <!-- Animated preview fades in on hover only -->
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <component :is="canvasFor(p)" v-if="canvasFor(p) && hoverIndex === i" />
              <img v-else-if="p.image" :src="p.image" alt="" class="w-full h-full object-cover" />
              <div v-else class="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[.02]"></div>
              <div class="absolute inset-0 bg-black/25"></div>
            </div>
            <!-- Default short description (visible), replaced by long text on hover -->
            <div class="absolute inset-0 z-10 flex flex-col justify-center p-5 sm:p-6 xl:p-8 transition-opacity duration-300 pointer-events-none group-hover:opacity-0">
              <p class="text-brand-muted max-w-none text-[clamp(12px,1.0vw,16px)] leading-relaxed">{{ p.description }}</p>
              <div class="text-brand-muted text-sm mt-2">/{{ formatIndex(i) }}</div>
            </div>
            <!-- Long description on hover (clipped to box) -->
            <div class="absolute inset-0 z-10 flex flex-col justify-center p-5 sm:p-6 xl:p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <p class="text-brand-muted max-w-none text-[clamp(12px,0.95vw,16px)] leading-relaxed">{{ p.long || p.description }}</p>
              <div class="text-brand-muted text-sm mt-2 opacity-0">/{{ formatIndex(i) }}</div>
            </div>
          </div>

          <!-- Row content -->
          <div class="relative z-10 grid grid-cols-12 gap-6 items-center py-8 md:py-12 px-0">
            <div class="col-span-12 md:col-span-12 md:text-right pr-0">
              <TypeOnView
                :text="p.name + ' '"
                :speed="24"
                tag="div"
                wrapper-class="inline-block leading-[0.88] text-white tracking-[-0.02em] text-[min(13vw,132px)] pr-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watchEffect, onMounted, onBeforeUnmount, computed } from 'vue';
import GridCanvas from './GridCanvas.vue';
import OrbitsCanvas from './OrbitsCanvas.vue';
import RadarCanvas from './RadarCanvas.vue';
import TypeOnView from './TypeOnView.vue';

const props = defineProps({
  headline: { type: String, required: true },
  items: { type: Array, required: true },
  emphasis: { type: String, default: '' },
  hideHeader: { type: Boolean, default: false },
  labelOverride: { type: String, default: '' },
});

const headlineParts = computed(() => {
  const h = props.headline || '';
  const e = (props.emphasis || '').trim();
  if (!e) return null;
  const i = h.toLowerCase().indexOf(e.toLowerCase());
  if (i === -1) return null;
  return {
    before: h.slice(0, i),
    match: h.slice(i, i + e.length),
    after: h.slice(i + e.length),
  };
});

const labelText = computed(() => props.labelOverride || 'Our Platform');

// Static emphasis for headline handled above; keep code lean.

const idx = ref(0);
const set = (i) => { idx.value = i; };
const next = () => { idx.value = (idx.value + 1) % props.items.length; };
const prev = () => { idx.value = (idx.value - 1 + props.items.length) % props.items.length; };
const formatIndex = (i) => `${(i+1).toString().padStart(1,'0')}.${(i+1).toString().padStart(1,'0')}`;

// Choose a canvas effect per item
const effectMap = { grid: GridCanvas, orbits: OrbitsCanvas, radar: RadarCanvas };
const canvasFor = (p) => {
  const key = p?.effect || (p?.canvas ? 'grid' : null);
  return key && effectMap[key] ? effectMap[key] : null;
};

// Desktop-wide hover index to lazily render preview canvases
const hoverIndex = ref(-1);

// Measure chip bars to avoid overlap with main text inside slides
const chipsDesktopRef = ref(null);
const chipsMobileRef = ref(null);
const chipsHDesktop = ref(0);
const chipsHMobile = ref(0);
const desktopChipsPad = computed(() => `${(chipsHDesktop.value || 0) + 8}px`);
const mobileChipsPad = computed(() => `${(chipsHMobile.value || 0) + 8}px`);

function handleKey(e) {
  if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
}

onMounted(() => document.addEventListener('keydown', handleKey));
onBeforeUnmount(() => document.removeEventListener('keydown', handleKey));

watchEffect(() => {
  // Ensure idx is within bounds if data changes
  if (idx.value >= props.items.length) idx.value = 0;
});

// Responsive mode selection for best look across screens
// - mobile: <= 767px
// - slideshow: between mobile and full thresholds
// - full: when viewport >= max(1440px, containerWidth + 200px)
const containerRef = ref(null);
const mode = ref('slideshow');
const isWideShort = ref(false);
const viewport = ref({ w: 0, h: 0 });

const fullInset = computed(() => {
  // When ultra-wide and short, push content inward more
  if (mode.value === 'full' && isWideShort.value) return 'clamp(48px, 10vw, 220px)';
  return '0px';
});
// Unified side padding so preview boxes match big-text right spacing
// Use a slightly smaller pad on sub-1200px widths to improve fit.
const sidePad = computed(() => (viewport.value.w < 1200 ? 'clamp(20px, 4vw, 60px)' : 'clamp(32px, 5vw, 80px)'));
// Preview width scales with viewport to avoid crowding on narrower screens
// Min 280px, max 560px, ~32% of viewport width.
const previewW = computed(() => {
  const w = viewport.value.w || 0;
  const base = Math.round(w * 0.32);
  return Math.max(280, Math.min(560, base));
});
// Content left padding reserves space for the preview so text never overlaps it
const fullContentPadLeft = computed(() => `calc(${fullInset.value} + ${sidePad.value} + ${previewW.value}px + 1.25rem)`);
const fullRowStyle = computed(() => ({ paddingLeft: fullContentPadLeft.value, paddingRight: `calc(${fullInset.value} + ${sidePad.value})` }));
const fullPreviewLeft = computed(() => `calc(${fullInset.value} + ${sidePad.value})`);

function computeMode() {
  const MOBILE_MAX = 767; // mobile cutoff
  const viewportW = window.innerWidth || document.documentElement.clientWidth || 0;
  const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
  viewport.value = { w: viewportW, h: viewportH };

  // Requested behavior: slideshow only on mobile; otherwise use widescreen
  if (viewportW <= MOBILE_MAX) {
    mode.value = 'mobile';
  } else {
    mode.value = 'full';
  }

  // Aspect: wide but short screens (e.g., 21:9 or small height)
  const ratio = viewportW / Math.max(1, viewportH);
  isWideShort.value = ratio >= 1.9 || viewportH <= 700;
}

let ro;
let roChipsDesk; let roChipsMob;
onMounted(() => {
  computeMode();
  window.addEventListener('resize', computeMode, { passive: true });
  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => computeMode());
    if (containerRef.value) ro.observe(containerRef.value);
  }
  // Observe chips heights
  const measure = () => {
    chipsHDesktop.value = chipsDesktopRef.value ? chipsDesktopRef.value.offsetHeight : 0;
    chipsHMobile.value = chipsMobileRef.value ? chipsMobileRef.value.offsetHeight : 0;
  };
  measure();
  window.addEventListener('resize', measure, { passive: true });
  if ('ResizeObserver' in window) {
    if (chipsDesktopRef.value) { roChipsDesk = new ResizeObserver(measure); roChipsDesk.observe(chipsDesktopRef.value); }
    if (chipsMobileRef.value) { roChipsMob = new ResizeObserver(measure); roChipsMob.observe(chipsMobileRef.value); }
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', computeMode);
  if (ro) ro.disconnect();
  if (roChipsDesk) roChipsDesk.disconnect();
  if (roChipsMob) roChipsMob.disconnect();
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active { transition: opacity .35s, transform .35s; }
.slide-fade-enter-from { opacity: 0; transform: translateX(10px); }
.slide-fade-leave-to   { opacity: 0; transform: translateX(-10px); }
</style>
