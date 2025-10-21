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

  let points = [];
  function buildHexGrid() {
    const size = Math.max(32, Math.min(60, Math.floor(Math.min(width, height) / 12)));
    const w = size * Math.sqrt(3);
    const h = size * 1.5;
    points = [];
    for (let y = -h; y < height + h; y += h) {
      for (let x = -w; x < width + w; x += w) {
        const ox = ((Math.floor(y / h) % 2) ? w / 2 : 0);
        points.push({ x: x + ox + w * 0.5, y: y + size * 0.5 });
      }
    }
  }

  function neighbors(idx) {
    const p = points[idx];
    const res = [];
    const size = Math.max(32, Math.min(60, Math.floor(Math.min(width, height) / 12)));
    const w = size * Math.sqrt(3);
    const h = size * 1.5;
    for (let j = 0; j < points.length; j++) {
      if (j === idx) continue;
      const q = points[j];
      const dx = Math.abs(p.x - q.x);
      const dy = Math.abs(p.y - q.y);
      if ((Math.abs(dx - w) < 2 && dy < 2) || (Math.abs(dy - h) < 2 && dx < 2) || (Math.abs(dx - w/2) < 2 && Math.abs(dy - h/2) < 2)) {
        res.push(j);
      }
      if (res.length >= 6) break;
    }
    return res;
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      // nodes
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
      g.addColorStop(0, `rgba(${accentRgb},0.35)`);
      g.addColorStop(1, `rgba(${accentRgb},0.00)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();
      // bonds (subset)
      const nbrs = neighbors(i);
      ctx.strokeStyle = `rgba(${accentRgb},0.12)`;
      ctx.lineWidth = 1;
      for (const j of nbrs) {
        const q = points[j];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  function draw(now) {
    if (now - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    const t = now * 0.0015;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const nbrs = neighbors(i);
      for (const j of nbrs) {
        const q = points[j];
        const dx = q.x - p.x, dy = q.y - p.y;
        const dist = Math.hypot(dx, dy);
        const phase = Math.sin(t + (p.x + p.y + dist) * 0.01) * 0.5 + 0.5; // traveling pulse
        const a = 0.08 + 0.28 * phase;
        ctx.strokeStyle = `rgba(${accentRgb},${a})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
      const pul = (Math.sin(t * 1.6 + (p.x + p.y) * 0.02) * 0.5 + 0.5);
      const r = 5 + 10 * pul;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, `rgba(${accentRgb},${0.55 * (0.6 + 0.4 * pul)})`);
      g.addColorStop(1, `rgba(${accentRgb},0.00)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  const onResize = () => { resize(); buildHexGrid(); if (prefersReduced) drawStatic(); };
  window.addEventListener('resize', onResize, { passive: true });
  resize();
  buildHexGrid();
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

