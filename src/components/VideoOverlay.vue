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
            <p class="mt-1 text-[11px] uppercase tracking-wide text-yellow-300/80">RELOAD REQUIRED</p>
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
        <figure class="rounded-[10px] overflow-hidden relative">
          <template v-if="active.kind === 'video'">
            <video
              class="block w-full h-[56svh] sm:h-[62svh] md:h-[68svh] lg:h-[72svh] object-cover"
              autoplay
              muted
              loop
              playsinline
              :poster="active.poster"
            >
              <source v-if="active.srcMp4" :src="active.srcMp4" type="video/mp4" />
              <source v-if="active.srcMov" :src="active.srcMov" type="video/quicktime" />
              <source v-if="active.src" :src="active.src" />
              Your browser does not support the video tag.
            </video>
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
import { computed, onMounted, ref } from 'vue';
import GridCanvas from './GridCanvas.vue';
import OrbitsCanvas from './OrbitsCanvas.vue';
import RadarCanvas from './RadarCanvas.vue';
import TestFlowField from './TestFlowField.vue';
import TestPulseGrid from './TestPulseGrid.vue';
import TestChemLattice from './TestChemLattice.vue';
import TestMoleculeOrbits from './TestMoleculeOrbits.vue';
import TestBrownian from './TestBrownian.vue';

const props = defineProps({
  heading: { type: String, default: 'Featured Video' },
  overlayText: { type: String, required: true },
  video: { type: Object, required: true },
  enableSwitcher: { type: Boolean, default: false },
});

// Feature flag sources: prop, env var, or URL query (?bgctl=1)
const queryFlag = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('bgctl');
const envFlag = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_BG_SWITCHER === 'true';
const showSwitcher = computed(() => props.enableSwitcher || envFlag || queryFlag);

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
  { value: 'test:mol', label: 'TEST — Molecule Orbits' },
  { value: 'test:diffuse', label: 'TEST — Brownian Diffusion' },
];

const selected = ref('default');
const collapsed = ref(false);

onMounted(() => {
  try {
    const saved = localStorage.getItem('heroBgMode');
    if (saved) selected.value = saved;
  } catch {}
});

function persistSelection() {
  try { localStorage.setItem('heroBgMode', selected.value); } catch {}
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
    case 'test:mol':
      return { kind: 'effect', component: TestMoleculeOrbits };
    case 'test:diffuse':
      return { kind: 'effect', component: TestBrownian };
    case 'default':
    default:
      return vDefault;
  }
});
</script>
