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

  const glyphs = '0123456789abcdefghijklmnopqrstuvwxyz';
  let columns = [];

  function resetColumns() {
    const colW = Math.max(12, Math.floor(width / 60));
    const count = Math.floor(width / colW);
    columns = Array.from({ length: count }).map((_, i) => ({
      x: i * colW + colW * 0.5,
      y: Math.random() * -height,
      speed: 1.2 + Math.random() * 2.8,
      size: colW * (0.8 + Math.random() * 0.3),
    }));
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(76,201,91,0.12)';
    ctx.font = `${Math.max(12, Math.floor(width / 60))}px monospace`;
    for (let i = 0; i < columns.length; i += 2) {
      ctx.fillText('*', columns[i].x, (i * 20) % height);
    }
  }

  function draw(now) {
    if (now - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = now;
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (const col of columns) {
      const y = (col.y += col.speed * 6);
      if (y > height + 40) { col.y = -Math.random() * height * 0.6; }
      const ch = glyphs[(Math.random() * glyphs.length) | 0];
      const glow = ctx.createRadialGradient(col.x, y, 0, col.x, y, col.size * 0.9);
      glow.addColorStop(0, 'rgba(76,201,91,0.65)');
      glow.addColorStop(1, 'rgba(76,201,91,0.00)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(col.x, y, col.size * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(76,201,91,0.8)';
      ctx.font = `${col.size}px monospace`;
      ctx.fillText(ch, col.x - col.size * 0.3, y + col.size * 0.3);
    }
    raf = requestAnimationFrame(draw);
  }

  const onResize = () => { resize(); resetColumns(); if (prefersReduced) drawStatic(); };
  window.addEventListener('resize', onResize, { passive: true });
  resize();
  resetColumns();
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

