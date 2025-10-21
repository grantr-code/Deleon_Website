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
  const FRAME_MS = 1000 / 30; // ~30fps
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

  // Simple deterministic pseudo-noise based on sin/cos
  function field(x, y, t) {
    const s = 0.0028;
    const a = Math.sin(x * s + t * 0.0008) + Math.cos(y * s * 1.3 - t * 0.0006);
    const b = Math.cos(x * s * 0.7 - t * 0.0005) - Math.sin(y * s + t * 0.0009);
    const angle = Math.atan2(b, a);
    return angle;
  }

  const seeds = Array.from({ length: 900 }).map(() => ({
    x: Math.random(),
    y: Math.random(),
    life: Math.random() * 200 + 60,
  }));

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;
    const t = 0;
    const len = Math.max(8, Math.min(18, Math.floor(Math.sqrt(width * height) * 0.02)));
    for (const s of seeds) {
      let x = s.x * width;
      let y = s.y * height;
      ctx.strokeStyle = `rgba(${accentRgb},0.15)`;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let i = 0; i < len; i++) {
        const a = field(x, y, t);
        x += Math.cos(a) * 3.2;
        y += Math.sin(a) * 3.2;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

  function draw(now) {
    if (now - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    const len = Math.max(10, Math.min(22, Math.floor(Math.sqrt(width * height) * 0.022)));
    const t = now;
    for (const s of seeds) {
      let x = s.x * width;
      let y = s.y * height;
      ctx.strokeStyle = `rgba(${accentRgb},0.20)`;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let i = 0; i < len; i++) {
        const a = field(x, y, t);
        x += Math.cos(a) * 2.8;
        y += Math.sin(a) * 2.8;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
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

