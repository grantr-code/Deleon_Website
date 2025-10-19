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

  const rings = Array.from({ length: 6 }).map((_, i) => ({
    baseR: 70 + i * 40,
    wobble: 6 + i * 1.8,
    speed: 0.12 + i * 0.035,
    phase: Math.random() * Math.PI * 2,
    gap: 0.18 + (i * 0.02),
  }));

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2;
    ctx.save();
    ctx.translate(cx, cy);
    for (const r of rings) {
      const R = r.baseR + r.wobble;
      ctx.strokeStyle = 'rgba(76,201,91,0.16)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function draw(time) {
    if (time - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = time;
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2;
    const t = time * 0.001;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < rings.length; i++) {
      const r = rings[i];
      const R = r.baseR + Math.sin(t * 0.8 + r.phase) * r.wobble;

      // faint full ring
      ctx.strokeStyle = 'rgba(76,201,91,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.stroke();

      // moving bright arc
      const start = (t * r.speed + r.phase) % (Math.PI * 2);
      const len = Math.PI * r.gap;
      ctx.strokeStyle = 'rgba(76,201,91,0.45)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, R, start, start + len);
      ctx.stroke();

      // traveling node
      const angle = start + len * 0.9;
      const x = Math.cos(angle) * R;
      const y = Math.sin(angle) * R;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, 10);
      grd.addColorStop(0, 'rgba(76,201,91,0.65)');
      grd.addColorStop(1, 'rgba(76,201,91,0.00)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
    // crosshair lines (very subtle)
    ctx.strokeStyle = 'rgba(76,201,91,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-cx, 0); ctx.lineTo(cx, 0);
    ctx.moveTo(0, -cy); ctx.lineTo(0, cy);
    ctx.stroke();
    ctx.restore();
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
