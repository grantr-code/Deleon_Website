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

  function project3D(x, y, z, angleX, angleY, angleZ, dist, scale) {
    let cx = Math.cos(angleX), sx = Math.sin(angleX);
    let cy = Math.cos(angleY), sy = Math.sin(angleY);
    let cz = Math.cos(angleZ), sz = Math.sin(angleZ);
    let y1 = y * cx - z * sx;
    let z1 = y * sx + z * cx;
    let x2 = x * cy + z1 * sy;
    let z2 = -x * sy + z1 * cy;
    let x3 = x2 * cz - y1 * sz;
    let y3 = x2 * sz + y1 * cz;
    const f = scale / (dist - z2);
    return { x: x3 * f, y: y3 * f };
  }

  function drawFrame(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(76,201,91,0.3)';
    ctx.shadowBlur = 6;

    const t = time * 0.001;
    const size = Math.min(width, height);
    const grid = 140;
    const step = Math.max(12, Math.min(20, Math.floor(size / 22))); // fewer lines
    const k = 0.08;
    const A = 12;
    const bands = 7.0;
    const thresh = 0.28;
    const angleX = 0.95 + Math.sin(t * 0.5) * 0.12;
    const angleY = 0.25 + Math.cos(t * 0.4) * 0.12;
    const angleZ = t * 0.22;
    const scale = size * 0.9;
    const dist = 220 + size * 0.1;

    for (let yy = -grid; yy <= grid; yy += step) {
      let prev = null;
      for (let xx = -grid; xx <= grid; xx += step) {
        const x = xx;
        const y = yy;
        const z = A * (Math.sin(k * x + t * 1.3) + Math.sin(k * y + t * 1.05));
        const p = project3D(x, y, z, angleX, angleY, angleZ, dist, scale);
        const s = Math.sin((z / A) * Math.PI * bands);
        let a = 1 - Math.min(1, Math.abs(s) / thresh);
        a = Math.pow(Math.max(0, a), 1.4);
        if (prev && a > 0.02) {
          ctx.strokeStyle = `rgba(76,201,91,${0.4 * a})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        prev = p;
      }
    }
    for (let xx = -grid; xx <= grid; xx += step) {
      let prev = null;
      for (let yy = -grid; yy <= grid; yy += step) {
        const x = xx;
        const y = yy;
        const z = A * (Math.sin(k * x + t * 1.3) + Math.sin(k * y + t * 1.05));
        const p = project3D(x, y, z, angleX, angleY, angleZ, dist, scale);
        const s = Math.sin((z / A) * Math.PI * bands);
        let a = 1 - Math.min(1, Math.abs(s) / thresh);
        a = Math.pow(Math.max(0, a), 1.4);
        if (prev && a > 0.02) {
          ctx.strokeStyle = `rgba(76,201,91,${0.35 * a})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        prev = p;
      }
    }
    ctx.restore();
  }

  function drawStatic() { drawFrame(0); }
  function animate(now) {
    if (now - lastTime < FRAME_MS) { raf = requestAnimationFrame(animate); return; }
    lastTime = now;
    drawFrame(now);
    raf = requestAnimationFrame(animate);
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
          if (!raf) raf = requestAnimationFrame(animate);
        } else if (raf) {
          cancelAnimationFrame(raf); raf = 0;
        }
      }
    }, { threshold: [0, 0.2, 0.6, 1] });
    io.observe(canvas);
  } else {
    raf = requestAnimationFrame(animate);
  }

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    if (raf) cancelAnimationFrame(raf);
  });
});
</script>
