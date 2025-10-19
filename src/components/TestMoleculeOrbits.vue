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

  const nuclei = [];
  const electrons = [];
  function seed() {
    nuclei.length = 0;
    electrons.length = 0;
    const n = 18;
    for (let i = 0; i < n; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = 20 + Math.random() * 40;
      nuclei.push({ x, y, r });
      const eCount = 2 + (Math.random() * 4) | 0;
      for (let k = 0; k < eCount; k++) {
        electrons.push({
          cx: x,
          cy: y,
          a: Math.random() * Math.PI * 2,
          da: 0.005 + Math.random() * 0.012,
          rx: r * (0.8 + Math.random() * 1.2),
          ry: r * (0.5 + Math.random() * 1.1),
        });
      }
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    for (const n of nuclei) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, 'rgba(76,201,91,0.35)');
      g.addColorStop(1, 'rgba(76,201,91,0.00)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw(now) {
    if (now - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    // bonds between near nuclei
    for (let i = 0; i < nuclei.length; i++) {
      const a = nuclei[i];
      for (let j = i + 1; j < nuclei.length; j++) {
        const b = nuclei[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.hypot(dx, dy);
        if (d < 160) {
          const apha = 0.18 * (1 - d / 160);
          ctx.strokeStyle = `rgba(76,201,91,${apha})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    // nuclei glow
    for (const n of nuclei) {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, 'rgba(76,201,91,0.35)');
      g.addColorStop(1, 'rgba(76,201,91,0.00)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // electron orbits
    ctx.strokeStyle = 'rgba(76,201,91,0.18)';
    for (const e of electrons) {
      e.a += e.da;
      const x = e.cx + Math.cos(e.a) * e.rx;
      const y = e.cy + Math.sin(e.a) * e.ry;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 10);
      glow.addColorStop(0, 'rgba(76,201,91,0.55)');
      glow.addColorStop(1, 'rgba(76,201,91,0.00)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
      // orbit trace
      ctx.beginPath();
      ctx.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    raf = requestAnimationFrame(draw);
  }

  const onResize = () => { resize(); seed(); if (prefersReduced) drawStatic(); };
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

