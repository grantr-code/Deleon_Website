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

  const detections = Array.from({ length: 26 }).map(() => ({
    x: Math.random() * 2 - 1,
    y: Math.random() * 2 - 1,
    t: Math.random() * Math.PI * 2,
    r: 0,
  }));

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2;
    const R = Math.min(width, height) * 0.42;
    ctx.save();
    ctx.translate(cx, cy);
    // rings
    for (let i = 1; i <= 6; i++) {
      ctx.strokeStyle = 'rgba(76,201,91,0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, (R / 6) * i, 0, Math.PI * 2);
      ctx.stroke();
    }
    // crosshairs
    ctx.strokeStyle = 'rgba(76,201,91,0.08)';
    ctx.beginPath();
    ctx.moveTo(-R, 0); ctx.lineTo(R, 0);
    ctx.moveTo(0, -R); ctx.lineTo(0, R);
    ctx.stroke();
    ctx.restore();
  }

  function draw(time) {
    if (time - lastTime < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
    lastTime = time;
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2;
    const R = Math.min(width, height) * 0.44;
    const t = time * 0.001;
    ctx.save();
    ctx.translate(cx, cy);

    // subtle background grid
    for (let i = 1; i <= 7; i++) {
      ctx.strokeStyle = 'rgba(76,201,91,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, (R / 7) * i, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(76,201,91,0.06)';
    ctx.beginPath();
    ctx.moveTo(-R, 0); ctx.lineTo(R, 0);
    ctx.moveTo(0, -R); ctx.lineTo(0, R);
    ctx.stroke();

    // rotating sweep
    const sweep = (t * 0.8) % (Math.PI * 2);
    const sweepWidth = Math.PI / 10;
    const grad = ctx.createRadialGradient(0, 0, R * 0.05, 0, 0, R);
    grad.addColorStop(0, 'rgba(76,201,91,0.20)');
    grad.addColorStop(1, 'rgba(76,201,91,0.00)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, sweep - sweepWidth, sweep + sweepWidth);
    ctx.closePath();
    ctx.fill();

    // detections with pulsing pings as sweep passes
    ctx.globalCompositeOperation = 'lighter';
    for (const d of detections) {
      const px = d.x * R * 0.95;
      const py = d.y * R * 0.95;
      const ang = Math.atan2(py, px);
      let diff = Math.abs(((ang - sweep + Math.PI) % (Math.PI * 2)) - Math.PI);
      const near = diff < sweepWidth * 1.4;

      // base point
      ctx.fillStyle = 'rgba(76,201,91,0.18)';
      ctx.beginPath();
      ctx.arc(px, py, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // pulse when sweep crosses
      if (near) {
        d.r = Math.min(R * 0.22, d.r + 3.5);
      } else {
        d.r *= 0.92;
      }
      if (d.r > 0.5) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, d.r);
        g.addColorStop(0, 'rgba(76,201,91,0.55)');
        g.addColorStop(1, 'rgba(76,201,91,0.00)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // orbiting command cue
    const cueR = R * 0.62;
    const cueA = t * 0.5;
    const cx2 = Math.cos(cueA) * cueR;
    const cy2 = Math.sin(cueA) * cueR;
    ctx.strokeStyle = 'rgba(76,201,91,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, cueR, 0, Math.PI * 2);
    ctx.stroke();
    const glow = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 12);
    glow.addColorStop(0, 'rgba(76,201,91,0.65)');
    glow.addColorStop(1, 'rgba(76,201,91,0.00)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx2, cy2, 12, 0, Math.PI * 2);
    ctx.fill();

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
