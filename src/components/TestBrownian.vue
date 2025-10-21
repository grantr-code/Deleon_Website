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

  const dots = [];
  function seed() {
    dots.length = 0;
    const n = Math.max(60, Math.floor(Math.sqrt(width * height) * 0.3));
    for (let i = 0; i < n; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: 8 + Math.random() * 12,
      });
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    for (const d of dots) {
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
      g.addColorStop(0, `rgba(${accentRgb},0.25)`);
      g.addColorStop(1, `rgba(${accentRgb},0.00)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw(now) {
    if (now - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = now;
    // leave faint trails by painting a transparent black layer
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    const t = now * 0.001;
    for (const d of dots) {
      // random walk with slight curl
      const ax = Math.sin(t + d.x * 0.01 + d.y * 0.008) * 0.2 + (Math.random() - 0.5) * 0.15;
      const ay = Math.cos(t * 1.1 + d.x * 0.008 - d.y * 0.01) * 0.2 + (Math.random() - 0.5) * 0.15;
      d.vx = (d.vx + ax) * 0.98;
      d.vy = (d.vy + ay) * 0.98;
      d.x += d.vx; d.y += d.vy;
      if (d.x < -20) d.x = width + 20; if (d.x > width + 20) d.x = -20;
      if (d.y < -20) d.y = height + 20; if (d.y > height + 20) d.y = -20;

      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
      g.addColorStop(0, `rgba(${accentRgb},0.50)`);
      g.addColorStop(1, `rgba(${accentRgb},0.00)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // faint hydrogen-like bonds on proximity
    for (let i = 0; i < dots.length; i++) {
      const a = dots[i];
      for (let j = i + 1; j < dots.length; j++) {
        const b = dots[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const alpha = 0.12 * (1 - dist / 140);
          ctx.strokeStyle = `rgba(${accentRgb},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  const onResize = () => { resize(); seed(); if (prefersReduced) drawStatic(); else ctx.clearRect(0, 0, width, height); };
  window.addEventListener('resize', onResize, { passive: true });
  resize();
  seed();
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

