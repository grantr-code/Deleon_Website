<template>
  <section aria-labelledby="video-hero-heading">
    <div class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-8">
      <div class="overflow-hidden relative z-10 text-white">
        <h1 id="video-hero-heading" class="sr-only">{{ heading }}</h1>

        <!-- Overlay text, centered -->
        <div class="absolute inset-0 z-20 flex justify-center items-center bg-black/35 rounded-[10px] p-6">
          <p class="relative z-10 text-[clamp(22px,3.6vw,38px)] leading-tight text-center max-w-[900px]">
            {{ overlayText }}
          </p>
        </div>

        <!-- Small demo control (feature-flagged) -->
        <div
          v-if="showSwitcher"
          class="fixed z-30 bottom-3 right-3"
          aria-live="polite"
        >
          <div
            v-if="!collapsed"
            class="rounded-md border border-white/15 bg-black/50 backdrop-blur-sm shadow-sm p-3 text-[12px]"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="uppercase tracking-wider text-white/80">BACKGROUND TESTER (NON-RELEASE)</span>
              <button
                type="button"
                class="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-white/80"
                @click="collapsed = true"
                title="Minimize"
              >
                Hide
              </button>
            </div>
            <p
              v-if="reloadNeeded"
              class="mt-1 text-[11px] uppercase tracking-wide text-yellow-300/80"
              title="Reload required"
            >
              RELOAD REQUIRED
            </p>
            <div class="mt-2">
              <label class="block text-white/70 mb-1">Mode</label>
              <select
                v-model="selected"
                class="w-[240px] bg-black/40 border border-white/15 rounded px-2 py-1 text-white/90"
                @change="persistSelection"
              >
                <option v-for="opt in options" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- Font tester (non-release) -->
            <div class="mt-3">
              <label class="block text-white/70 mb-1">Font (TEST)</label>
              <select
                v-model="siteFont"
                class="w-[240px] bg-black/40 border border-white/15 rounded px-2 py-1 text-white/90"
                title="Temporarily switch site font (logo unaffected)"
                @change="applySiteFont"
              >
                <option value="default">Default (Space Grotesk)</option>
                <option value="inter">Inter</option>
                <option value="plex">IBM Plex Sans</option>
                <option value="source">Source Sans 3</option>
              </select>
            </div>
          </div>
          <button
            v-else
            type="button"
            class="rounded-md border border-white/15 bg-black/50 backdrop-blur-sm shadow-sm px-2 py-1 text-[12px] text-white/90 hover:bg-white/10"
            @click="collapsed = false"
            title="Show background switcher"
          >
            BG
          </button>
        </div>

        <!-- Background area: video or canvas effect -->
        <figure
          ref="figureRef"
          class="rounded-[10px] overflow-hidden relative bg-black"
        >
          <template v-if="active.kind === 'video'">
            <!-- First-frame canvas backdrop -->
            <canvas
              ref="posterCanvas"
              class="absolute inset-0 block w-full h-full pointer-events-none"
              :style="{ opacity: isPlaying ? 0 : 1, transition: 'opacity 200ms ease' }"
            ></canvas>
            <!-- Video element -->
            <video
              ref="videoRef"
              class="block w-full h-[56svh] sm:h-[62svh] md:h-[68svh] lg:h-[72svh] object-cover"
              autoplay
              muted
              loop
              playsinline
              :style="{ opacity: isPlaying ? 1 : 0, transition: 'opacity 300ms ease' }"
              @loadeddata="onLoadedData"
              @canplay="onCanPlay"
              @playing="onPlaying"
            >
              <!-- Prefer MOV first; MP4 as fallback -->
              <source v-if="active.srcMov" :src="active.srcMov" type="video/quicktime" />
              <source v-if="active.srcMp4" :src="active.srcMp4" type="video/mp4" />
              <source v-if="active.src" :src="active.src" />
              Your browser does not support the video tag.
            </video>
            <!-- Loader removed: only static thumbnail canvas until playing -->
          </template>
          <template v-else>
            <div class="relative block w-full h-[56svh] sm:h-[62svh] md:h-[68svh] lg:h-[72svh] bg-black/40">
              <component :is="active.component" />
            </div>
          </template>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import GridCanvas from './GridCanvas.vue';
import OrbitsCanvas from './OrbitsCanvas.vue';
import RadarCanvas from './RadarCanvas.vue';
import TestFlowField from './TestFlowField.vue';
import TestPulseGrid from './TestPulseGrid.vue';
import TestChemLattice from './TestChemLattice.vue';
import TestBrownian from './TestBrownian.vue';

const props = defineProps({
  heading: { type: String, default: 'Featured Video' },
  overlayText: { type: String, required: true },
  video: { type: Object, required: true },
  enableSwitcher: { type: Boolean, default: false },
});

// Feature flag sources: prop, env var, or URL path (/background-selector)
const envFlag = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_BG_SWITCHER === 'true';
const pathFlag = typeof window !== 'undefined' && window.location && (window.location.pathname || '').includes('/background-selector');
const showSwitcher = computed(() => props.enableSwitcher || envFlag || pathFlag);

// Options list shown in the panel
const options = [
  { value: 'default', label: 'Default (Page Hero)' },
  { value: 'video:teams', label: 'Video — Teams' },
  { value: 'video:military', label: 'Video — Military' },
  { value: 'effect:grid', label: 'Animation — Analysis (Grid)' },
  { value: 'effect:orbits', label: 'Animation — Insights (Orbits)' },
  { value: 'effect:radar', label: 'Animation — Command (Radar)' },
  { value: 'test:flow', label: 'TEST — Flow Field' },
  { value: 'test:pulse', label: 'TEST — Pulse Grid' },
  { value: 'test:chem', label: 'TEST — Chem Lattice' },
  { value: 'test:diffuse', label: 'TEST — Brownian Diffusion' },
];

const selected = ref('default');
const reloadNeeded = ref(false);
const collapsed = ref(false);
const siteFont = ref('default');

// Video loading/playing state
const videoRef = ref(null);
const posterCanvas = ref(null);
const figureRef = ref(null);
const isPlaying = ref(false);

function drawFirstFrame() {
  const vid = videoRef.value;
  const cvs = posterCanvas.value;
  const fig = figureRef.value;
  if (!vid || !cvs || !fig) return;
  const w = fig.clientWidth || 0;
  const h = fig.clientHeight || 0;
  if (!w || !h || !vid.videoWidth || !vid.videoHeight) return;
  // Size canvas to container CSS pixels
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cvs.width = Math.floor(w * dpr);
  cvs.height = Math.floor(h * dpr);
  const ctx = cvs.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Compute object-cover crop for drawImage
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

function onResize() { if (!isPlaying.value) drawFirstFrame(); }
onMounted(() => window.addEventListener('resize', onResize, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('resize', onResize));

onMounted(() => {
  try {
    const saved = localStorage.getItem('heroBgMode');
    if (saved) selected.value = saved;
  } catch {}
  // Restore tester font
  try {
    const savedFont = localStorage.getItem('testerSiteFont');
    if (savedFont) {
      siteFont.value = savedFont;
      applySiteFont();
    }
  } catch {}
});

function persistSelection() {
  try {
    const prev = localStorage.getItem('heroBgMode');
    localStorage.setItem('heroBgMode', selected.value);
    reloadNeeded.value = prev !== null && prev !== selected.value;
  } catch {
    reloadNeeded.value = true;
  }
}

// Map the selected mode into an active rendering config
const active = computed(() => {
  const poster = '/BrandAssets/Deleon_Logo_light.svg';
  const vDefault = { kind: 'video', poster, ...props.video };
  switch (selected.value) {
    case 'video:teams':
      return { kind: 'video', poster, srcMp4: '/BrandAssets/Video.mp4', srcMov: '/BrandAssets/Video.mov' };
    case 'video:military':
      return { kind: 'video', poster, srcMp4: '/BrandAssets/Video_Military.mp4', srcMov: '/BrandAssets/Video_Military.mov' };
    case 'effect:grid':
      return { kind: 'effect', component: GridCanvas };
    case 'effect:orbits':
      return { kind: 'effect', component: OrbitsCanvas };
    case 'effect:radar':
      return { kind: 'effect', component: RadarCanvas };
    case 'test:flow':
      return { kind: 'effect', component: TestFlowField };
    case 'test:pulse':
      return { kind: 'effect', component: TestPulseGrid };
    case 'test:chem':
      return { kind: 'effect', component: TestChemLattice };
    case 'test:diffuse':
      return { kind: 'effect', component: TestBrownian };
    case 'default':
    default:
      return vDefault;
  }
});

// No logo placeholder; canvas shows a first frame until playing

// --- Font test support (non-release) ---
function ensureFontLink(key) {
  if (typeof document === 'undefined') return;
  const links = {
    inter: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    plex: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
    source: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap',
  };
  const id = `tester-font-${key}`;
  if (!links[key]) return;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = links[key];
    document.head.appendChild(link);
  }
}

function applySiteFont() {
  if (typeof document === 'undefined') return;
  const stacks = {
    default: '"Space Grotesk", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    inter: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    plex: '"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    source: '"Source Sans 3", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  };
  const key = siteFont.value || 'default';
  if (key !== 'default') ensureFontLink(key);
  const stack = stacks[key] || stacks.default;
  try { localStorage.setItem('testerSiteFont', key); } catch {}
  document.body.style.fontFamily = stack;
}
</script>
