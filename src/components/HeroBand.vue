<template>
  <div
    ref="rootEl"
    class="bg-white dark:bg-black text-black dark:text-white relative h-screen min-h-screen h-[100svh] min-h-[100svh] overflow-hidden"
  >
    <!-- Background layer: default canvas, effect, or video -->
    <div class="absolute inset-0">
      <template v-if="active.kind === 'default'">
        <canvas
          ref="canvasRef"
          class="absolute inset-0 w-full h-full pointer-events-none"
          :style="canvasPerfStyle"
          aria-hidden="true"
        ></canvas>
      </template>
      <template v-else-if="active.kind === 'effect'">
        <div class="relative w-full h-full">
          <component :is="active.component" />
        </div>
      </template>
      <template v-else>
        <div class="absolute inset-0" :style="videoPosterStyle">
          <!-- First-frame thumbnail canvas (fades out when video plays) -->
          <canvas
            ref="posterCanvas"
            class="absolute inset-0 w-full h-full pointer-events-none"
            :style="{ opacity: isVideoPlaying ? 0 : 1, transition: 'opacity 200ms ease' }"
            aria-hidden="true"
          ></canvas>
          <!-- Video element (fades in when playing) -->
          <video
            ref="videoRef"
            class="absolute inset-0 w-full h-full object-cover"
            autoplay
            muted
            loop
            playsinline
            :style="{ opacity: isVideoPlaying ? 1 : 0, transition: 'opacity 300ms ease' }"
            @loadeddata="onVideoLoadedData"
            @canplay="onVideoCanPlay"
            @playing="onVideoPlaying"
          >
            <!-- Prefer MP4 first for better browser compatibility; MOV as fallback -->
            <source v-if="active.srcMp4" :src="active.srcMp4" type="video/mp4" />
            <source v-if="active.srcMov" :src="active.srcMov" type="video/quicktime" />
            <source v-if="active.src" :src="active.src" />
            Your browser does not support the video tag.
          </video>
        </div>
      </template>
    </div>

    <!-- Hero content overlay -->
    <div class="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-28" :class="preferDarkText ? 'text-black' : 'text-black dark:text-white'">
      <div class="text-center max-w-[1100px] w-full mx-auto">
        <TypeReplaceOnView
          tag="h1"
          prefix="Analyze your "
          :words="['biochemistry', 'training potential', 'wellness', 'nutrition']"
          suffix=" every single day"
          word-tag="em"
          :initialSpeed="26"
          :fromSpeed="80"
          :toSpeed="80"
          :backspaceSpeed="45"
          :pauseFrom="2000"
          :pauseTo="2500"
          :loop="true"
          :startDelay="120"
          :wrapper-class="headingClass"
        />
      </div>
    </div>

    <!-- Small demo control (feature-flagged) -->
    <div v-if="showSwitcher" class="fixed z-30 bottom-3 right-3">
      <div v-if="!collapsed" class="rounded-md border border-border bg-card/50 backdrop-blur-sm shadow-sm p-3 text-[12px]">
        <div class="flex items-center justify-between gap-3">
          <span class="uppercase tracking-wider text-muted-foreground">BACKGROUND TESTER (NON-RELEASE)</span>
          <button type="button" class="px-2 py-1 rounded bg-muted/20 hover:bg-muted/30 text-muted-foreground" @click="collapsed = true" title="Minimize">Hide</button>
        </div>
        <p
          v-if="reloadNeeded"
          class="mt-1 text-[11px] uppercase tracking-wide text-yellow-300/80"
          title="Reload required"
        >
          RELOAD REQUIRED
        </p>
        <div class="mt-2">
          <label class="block text-muted-foreground mb-1">Mode</label>
          <select
            v-model="selected"
            class="w-[240px] bg-muted/40 border border-border rounded px-2 py-1 text-foreground"
            @change="persistSelection"
          >
            <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <!-- Site-wide theme BETA -->
        <div class="mt-3">
          <label class="block text-muted-foreground mb-1">Site theme (BETA)</label>
          <select
            v-model="siteTheme"
            class="w-[240px] bg-muted/40 border border-border rounded px-2 py-1 text-foreground"
            title="Switch site-wide theme"
          >
            <option value="dark">Dark (Default)</option>
            <option value="light">Light (Beta)</option>
          </select>
        </div>

        <!-- Font tester (non-release) -->
        <div class="mt-3">
          <label class="block text-muted-foreground mb-1">Font (TEST)</label>
          <select
            v-model="siteFont"
            class="w-[240px] bg-muted/40 border border-border rounded px-2 py-1 text-foreground"
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
      <button v-else type="button" class="rounded-md border border-border bg-card/50 backdrop-blur-sm shadow-sm px-2 py-1 text-[12px] text-foreground hover:bg-muted/20" @click="collapsed = false" title="Show background switcher">BG</button>
    </div>

    <!-- Scroll cue (arrow) -->
    <div class="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 flex flex-col items-center gap-2">
      <a href="#our-platforms" aria-label="Scroll to Our Platform" class="pointer-events-auto">
        <span class="block h-10 w-10 rounded-full border border-black/30 dark:border-white/30 text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white hover:border-black/60 dark:hover:border-white/60 flex items-center justify-center transition-colors animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
            <path fill-rule="evenodd" d="M12 16a.75.75 0 0 1-.53-.22l-5-5a.75.75 0 1 1 1.06-1.06L12 14.19l4.47-4.47a.75.75 0 1 1 1.06 1.06l-5 5A.75.75 0 0 1 12 16z" clip-rule="evenodd" />
          </svg>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch, inject } from 'vue';
import TypeReplaceOnView from './TypeReplaceOnView.vue';
import GridCanvas from './GridCanvas.vue';
import OrbitsCanvas from './OrbitsCanvas.vue';
import RadarCanvas from './RadarCanvas.vue';
import TestFlowField from './TestFlowField.vue';
import TestPulseGrid from './TestPulseGrid.vue';
import TestChemLattice from './TestChemLattice.vue';
import TestBrownian from './TestBrownian.vue';
import { useSiteTheme } from '../composables/useSiteTheme';

const props = defineProps({ enableSwitcher: { type: Boolean, default: false } });

const rootEl = ref(null);
const canvasRef = ref(null);
let raf = 0;
let isVisible = true;
// No header offset; hero occupies full viewport beneath overlay header
// Default hero background: Flow Field effect
const selected = ref('test:flow');
const reloadNeeded = ref(false);
const collapsed = ref(false);
const videoRef = ref(null);
const posterCanvas = ref(null);
const isVideoPlaying = ref(false);
const siteFont = ref('default');

const { theme: siteTheme } = useSiteTheme();

// Only show the switcher when explicitly enabled via env/prop or URL path
const envFlag = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_BG_SWITCHER === 'true';
const pathFlag = typeof window !== 'undefined' && window.location && (window.location.pathname || '').includes('/background-selector');
const showSwitcher = computed(() => props.enableSwitcher || envFlag || pathFlag);

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

const active = computed(() => {
  const poster = null; // No logo; use first-frame canvas as thumbnail
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
      return { kind: 'default' };
  }
});

// Poster background style so the logo is centered/contained while loading
const videoPosterStyle = computed(() => ({
  // Solid background; thumbnail is drawn to canvas instead of static logo
  backgroundColor: '#000',
}));

const isDefaultActive = computed(() => active.value.kind === 'default');
const preferDarkText = computed(() => selected.value === 'test:diffuse');
const headingClass = computed(() => `text-center ${preferDarkText.value ? 'text-black' : 'text-black dark:text-white'} text-[clamp(30px,4.8vw,62px)] leading-tight`);

// Inform the header to switch logo/text to dark-on-light when Brownian is active
const headerTheme = inject('headerTheme', null);
// Ensure hero never forces a dark header when site theme is light.
// Logic: if site is light OR hero prefers dark text, use light header; else dark.
watch([preferDarkText, siteTheme], ([prefersDarkText, currentSiteTheme]) => {
  if (!headerTheme || typeof headerTheme !== 'object') return;
  const next = (currentSiteTheme === 'light' || prefersDarkText) ? 'light' : 'dark';
  headerTheme.value = next;
}, { immediate: true });

onBeforeUnmount(() => {
  if (!headerTheme || typeof headerTheme !== 'object') return;
  headerTheme.value = siteTheme.value === 'light' ? 'light' : 'dark';
});

function persistSelection() {
  try {
    const prev = localStorage.getItem('heroBgMode');
    localStorage.setItem('heroBgMode', selected.value);
    reloadNeeded.value = prev !== null && prev !== selected.value;
  } catch {
    // If storage fails, still indicate reload after a manual change
    reloadNeeded.value = true;
  }
}

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

  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const particles = [];
  let maxDist = 140;
  const FRAME_MS = 1000 / 30; // throttle ~30fps
  let lastTime = 0;

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function makeParticle() {
    const speed = rand(0.15, 0.6);
    const angle = rand(0, Math.PI * 2);
    return {
      x: rand(0, width),
      y: rand(0, height),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: rand(18, 44),
      t: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2)
    };
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const containerRect = (rootEl.value ?? canvas.parentElement)?.getBoundingClientRect();
    const rect = containerRect || canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height || (window.innerHeight * 0.6)));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.max(20, Math.min(80, Math.floor((width * height) * 0.000025)));
    while (particles.length < target) particles.push(makeParticle());
    while (particles.length > target) particles.pop();
    maxDist = Math.max(110, Math.min(180, Math.sqrt(width * height) * 0.10));
  }
  function drawParticle(p, time) {
    const breath = 1 + 0.08 * Math.sin(time * 0.0016 + p.t);
    const radius = p.r * breath;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
    grad.addColorStop(0, 'rgba(76,201,91,0.28)');
    grad.addColorStop(1, 'rgba(76,201,91,0.00)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
    const sides = 6;
    const R = radius * 0.55;
    const rot = p.rot + time * 0.0005;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const a = (i / sides) * Math.PI * 2;
      const px = Math.cos(a) * R;
      const py = Math.sin(a) * R;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(76,201,91,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  function drawConnections() {
    // Spatial hashing to avoid O(n^2)
    const cell = maxDist;
    const grid = new Map();
    const key = (ix, iy) => ix + ',' + iy;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const ix = Math.floor(p.x / cell);
      const iy = Math.floor(p.y / cell);
      const k = key(ix, iy);
      if (!grid.has(k)) grid.set(k, []);
      grid.get(k).push(i);
    }
    const checked = new Set();
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      const ix = Math.floor(a.x / cell);
      const iy = Math.floor(a.y / cell);
      for (let gx = ix - 1; gx <= ix + 1; gx++) {
        for (let gy = iy - 1; gy <= iy + 1; gy++) {
          const arr = grid.get(key(gx, gy));
          if (!arr) continue;
          for (const j of arr) {
            if (j <= i) continue; // avoid double
            const id = i * 100000 + j; // cheap pairing key
            if (checked.has(id)) continue;
            checked.add(id);
            const b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.28;
              ctx.strokeStyle = `rgba(76,201,91,${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
    }
  }
  function step(time) {
    if (!isVisible) { raf = requestAnimationFrame(step); return; }
    if (time - lastTime < FRAME_MS) { raf = requestAnimationFrame(step); return; }
    lastTime = time;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -50) p.x = width + 50; if (p.x > width + 50) p.x = -50;
      if (p.y < -50) p.y = height + 50; if (p.y > height + 50) p.y = -50;
      drawParticle(p, time);
    }
    drawConnections();
    raf = requestAnimationFrame(step);
  }
  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    const center = { x: width * 0.5, y: height * 0.5 };
    const g = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, Math.max(width, height) * 0.55);
    g.addColorStop(0, 'rgba(76,201,91,0.25)');
    g.addColorStop(1, 'rgba(76,201,91,0.00)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(center.x, center.y, Math.max(width, height) * 0.55, 0, Math.PI * 2);
    ctx.fill();
  }

  const onResize = () => { resize(); if (prefersReduced) drawStatic(); };
  // Observe hero container for size changes (font load, mobile UI bars)
  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => { resize(); if (prefersReduced) drawStatic(); });
    if (rootEl.value) ro.observe(rootEl.value);
  }
  const onVis = () => {
    if (document.visibilityState === 'hidden') { isVisible = false; }
    else { isVisible = true; }
  };
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVis);
  resize();
  if (prefersReduced) drawStatic();
  else if (isDefaultActive.value) raf = requestAnimationFrame(step);

  // Start/stop animation when switching modes
  watch(isDefaultActive, (now) => {
    if (prefersReduced) return;
    if (now) {
      if (!raf) raf = requestAnimationFrame(step);
    } else if (raf) {
      cancelAnimationFrame(raf); raf = 0;
    }
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    if (ro) { try { ro.disconnect(); } catch {} }
    if (raf) cancelAnimationFrame(raf);
  });
});

// Draw a first-frame thumbnail onto the hero canvas until the video is playing
function drawFirstFrame() {
  const vid = videoRef.value;
  const cvs = posterCanvas.value;
  if (!vid || !cvs) return;
  // Measure the canvas container (full hero area)
  const rect = cvs.getBoundingClientRect();
  const w = Math.floor(rect.width);
  const h = Math.floor(rect.height || window.innerHeight);
  if (!w || !h || !vid.videoWidth || !vid.videoHeight) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cvs.width = Math.floor(w * dpr);
  cvs.height = Math.floor(h * dpr);
  const ctx = cvs.getContext('2d');
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  // Compute object-cover crop
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

function onVideoLoadedData() { if (!isVideoPlaying.value) drawFirstFrame(); }
function onVideoCanPlay() { if (!isVideoPlaying.value) drawFirstFrame(); }
function onVideoPlaying() { isVideoPlaying.value = true; }

// Keep thumbnail in sync on resize until video fades in
const onHeroResize = () => { if (!isVideoPlaying.value && active.value.kind === 'video') drawFirstFrame(); };
if (typeof window !== 'undefined') {
  window.addEventListener('resize', onHeroResize, { passive: true });
}
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', onHeroResize);
  }
});

// Reset state when switching modes
watch(() => active.value.kind, (k) => {
  if (k === 'video') {
    isVideoPlaying.value = false;
    // Draw as soon as metadata is ready via event handlers
  } else {
    isVideoPlaying.value = false;
  }
});

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
    default: '"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    inter: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    plex: '"IBM Plex Sans", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    source: '"Source Sans 3", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  };
  const key = siteFont.value || 'default';
  if (key !== 'default') ensureFontLink(key);
  const stack = stacks[key] || stacks.default;
  try { localStorage.setItem('testerSiteFont', key); } catch {}
  // Set the global site font variable instead of inlining on body
  document.documentElement.style.setProperty('--font-site', stack);
}

// Promote canvas to its own layer on mobile to avoid first-paint flicker
const canvasPerfStyle = computed(() => ({
  willChange: 'transform, opacity',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden'
}));
</script>
