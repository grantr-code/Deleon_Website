<template>
  <div
    class="bg-black text-white relative h-[100svh] min-h-[100svh] overflow-hidden"
    :style="{ marginTop: `-${headerOffset}px` }"
  >
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"></canvas>
    <div class="absolute inset-0 z-10 flex items-center justify-center px-4">
      <div class="text-center max-w-[1100px]">
        <TypeReplaceOnView
          tag="h1"
          prefix="Operate with a common ground "
          from="truth"
          to="operating picture"
          :speed="26"
          :backspaceSpeed="150"
          :pauseAfterFirst="2000"
          :startDelay="120"
          wrapper-class="text-center text-white text-[clamp(30px,4.8vw,62px)] leading-tight"
        />
        <EarlyAccessForm />
      </div>
    </div>
    <!-- Scroll cue (arrow) -->
    <div class="absolute left-1/2 -translate-x-1/2 bottom-6 z-20 flex flex-col items-center gap-2">
      <a href="#our-platforms" aria-label="Scroll to Our Platform" class="pointer-events-auto">
        <span class="block h-10 w-10 rounded-full border border-white/30 text-white/80 hover:text-white hover:border-white/60 flex items-center justify-center transition-colors animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
            <path fill-rule="evenodd" d="M12 16a.75.75 0 0 1-.53-.22l-5-5a.75.75 0 1 1 1.06-1.06L12 14.19l4.47-4.47a.75.75 0 1 1 1.06 1.06l-5 5A.75.75 0 0 1 12 16z" clip-rule="evenodd" />
          </svg>
        </span>
      </a>
    </div>
    
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import TypeReplaceOnView from './TypeReplaceOnView.vue';
import EarlyAccessForm from './EarlyAccessForm.vue';

const canvasRef = ref(null);
let raf = 0;
let isVisible = true;
const headerOffset = ref(0);

onMounted(() => {
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
    const containerRect = canvas.parentElement?.getBoundingClientRect();
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

  function measureHeader() {
    const el = document.getElementById('site-header');
    headerOffset.value = el ? el.offsetHeight : 0;
  }

  const onResize = () => { resize(); measureHeader(); if (prefersReduced) drawStatic(); };
  const onVis = () => {
    if (document.visibilityState === 'hidden') { isVisible = false; }
    else { isVisible = true; }
  };
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVis);
  resize();
  measureHeader();
  if (prefersReduced) drawStatic(); else raf = requestAnimationFrame(step);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    if (raf) cancelAnimationFrame(raf);
  });
});
</script>
