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
  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const nodes = [];
  let raf = 0;
  let maxDist = 160;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.max(24, Math.min(80, Math.floor((width * height) * 0.00006)));
    while (nodes.length < target) nodes.push(makeNode());
    while (nodes.length > target) nodes.pop();
    maxDist = Math.max(110, Math.min(220, Math.sqrt(width * height) * 0.11));
  }

  function makeNode() {
    const speed = 0.25 + Math.random() * 0.55;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1 + Math.random() * 1.6,
      t: Math.random() * Math.PI * 2,
    };
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    // Subtle diagonal gradient
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, 'rgba(76,201,91,0.10)');
    g.addColorStop(1, 'rgba(76,201,91,0.00)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  function step(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';
    // Update and draw nodes
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      // wrap
      if (n.x < -20) n.x = width + 20; if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20; if (n.y > height + 20) n.y = -20;
      const pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * 0.003 + n.t));
      ctx.fillStyle = `rgba(76,201,91,${0.22 * pulse})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Connections
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.3;
          ctx.strokeStyle = `rgba(76,201,91,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(step);
  }

  const onResize = () => { resize(); if (prefersReduced) drawStatic(); };
  window.addEventListener('resize', onResize, { passive: true });
  resize();
  if (prefersReduced) drawStatic(); else raf = requestAnimationFrame(step);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    if (raf) cancelAnimationFrame(raf);
  });
});
</script>

