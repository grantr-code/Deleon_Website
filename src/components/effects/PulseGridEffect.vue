<template>
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true"></canvas>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Read accent color from CSS variable (brand green)
  const accentRgb = '76,201,91'; // Brand green RGB

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let raf = 0;
  const FRAME_MS = 1000 / 30;
  let lastTime = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    const cols = Math.max(10, Math.floor(width / 80));
    const rows = Math.max(6, Math.floor(height / 80));
    const cellW = width / cols;
    const cellH = height / rows;
    ctx.globalCompositeOperation = 'lighter';
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = (x + 0.5) * cellW;
        const cy = (y + 0.5) * cellH;
        const r = Math.min(cellW, cellH) * 0.18;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${accentRgb},0.25)`);
        g.addColorStop(1, `rgba(${accentRgb},0.00)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function draw(now) {
    if (now - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    const cols = Math.max(12, Math.floor(width / 70));
    const rows = Math.max(8, Math.floor(height / 70));
    const cellW = width / cols;
    const cellH = height / rows;
    ctx.globalCompositeOperation = 'lighter';
    const t = now * 0.001;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = (x + 0.5) * cellW;
        const cy = (y + 0.5) * cellH;
        const phase = (x * 0.35 + y * 0.55) * 0.5;
        const pulse = 0.5 + 0.5 * Math.sin(t * 2.0 + phase);
        const r = Math.min(cellW, cellH) * (0.08 + 0.22 * pulse);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g.addColorStop(0, `rgba(${accentRgb},${0.45 * (0.6 + 0.4 * pulse)})`);
        g.addColorStop(1, `rgba(${accentRgb},0.00)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    raf = requestAnimationFrame(draw);
  }

  const onResize = () => { resize(); if (prefersReduced) drawStatic(); };
  window.addEventListener('resize', onResize, { passive: true });
  resize();
  if (prefersReduced) {
    drawStatic();
  } else if (typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > 0.2) {
          if (!raf) raf = requestAnimationFrame(draw);
        } else if (raf) {
          cancelAnimationFrame(raf); raf = 0;
        }
      }
    }, { threshold: [0, 0.2, 0.6, 1] });
    io.observe(canvas);
  } else {
    raf = requestAnimationFrame(draw);
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    if (raf) cancelAnimationFrame(raf);
  });
});
</script>

