<template>
  <div class="max-w-[1280px] mx-auto px-4">
    <div class="relative rounded-xl border border-white/10 bg-white/5 p-3 md:p-4">
      <canvas ref="canvas" class="w-full h-[460px] sm:h-[520px] md:h-[560px] block" role="img" aria-label="Capillary electrophoresis with chart and neural network"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

const canvas = ref(null);
// Preload Deleon light logo for app card
const logoLight = new Image();
logoLight.src = '/BrandAssets/Deleon_Logo_light.svg';

// Utility
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function gaussian(x, mu, sigma) { const d = (x - mu) / sigma; return Math.exp(-0.5 * d * d); }

function isLightTheme() {
  try {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('theme-light');
  } catch { return false; }
}

function getPalette() {
  const light = isLightTheme();
  if (light) {
    return {
      stroke: 'rgba(0,0,0,0.50)',
      fluid: 'rgba(80, 150, 200, 0.22)',
      label: 'rgba(0,0,0,0.85)',
      sublabel: 'rgba(0,0,0,0.65)',
      axis: 'rgba(0,0,0,0.55)',
      chartBg: 'rgba(0,0,0,0.03)',
      chartBorder: 'rgba(0,0,0,0.12)',
      chartText: 'rgba(0,0,0,0.70)',
      dataIn: 'rgba(0,0,0,0.55)',
      connector: 'rgba(0,0,0,0.30)',
      node: 'rgba(0,0,0,0.85)',
      nnLabel: 'rgba(0,0,0,0.85)',
      arrow: (a=0.5) => `rgba(0,0,0,${a})`,
      bulb: 'rgba(255,200,90,0.90)',
      beam: 'rgba(0,0,0,0.70)',
      signMark: 'black',
    };
  }
  return {
    stroke: 'rgba(255,255,255,0.5)',
    fluid: 'rgba(150, 220, 240, 0.35)',
    label: 'rgba(255,255,255,0.90)',
    sublabel: 'rgba(255,255,255,0.70)',
    axis: 'rgba(255,255,255,0.35)',
    chartBg: 'rgba(255,255,255,0.05)',
    chartBorder: 'rgba(255,255,255,0.2)',
    chartText: 'rgba(255,255,255,0.70)',
    dataIn: 'rgba(255,255,255,0.65)',
    connector: 'rgba(255,255,255,0.30)',
    node: 'rgba(255,255,255,0.90)',
    nnLabel: 'rgba(255,255,255,0.85)',
    arrow: (a=0.5) => `rgba(255,255,255,${a})`,
    bulb: 'rgba(255,200,90,0.95)',
    beam: 'rgba(255,255,255,0.70)',
    signMark: 'white',
  };
}

function createSim(w, h) {
  const pad = 24;
  const channelTop = 74;
  const channelH = 22;
  const legW = 24;
  const resW = 66; const resH = 120;
  const leftX = pad;
  const rightX = w - pad - resW;
  const channelL = leftX + resW + 14;
  const channelR = rightX - 14;
  const detectorX = channelR - 54;

  // Decide layout mode based on available width
  const rightReserve = 420; // space for network + app
  const canSideBySide = (w - 2 * pad) > (320 + rightReserve + 20);
  const mode = canSideBySide ? 'side' : 'stack';

  // Chart rectangle
  let chartW = 0; let chartX = pad + 10; let chartY = channelTop + resH + 40; const chartH = 150;
  if (mode === 'side') {
    const max = Math.max(320, Math.min(520, w - 2 * pad - rightReserve));
    chartW = max;
  } else {
    chartW = Math.max(320, w - 2 * pad - 80);
  }
  const chartRect = { x: chartX, y: chartY, w: chartW, h: chartH };

  // Neural network anchor X
  const mlX = (mode === 'side')
    ? Math.min(w - pad - 220, chartRect.x + chartRect.w + 260)
    : Math.floor(w / 2);

  // Analytes (discs with different mobilities)
  const mobilities = [0.18, 0.30, 0.44, 0.58, 0.74];
  const colors = ['#e34b4b','#f0c92c','#4fa3ff','#6f4bff','#3bd66c'];
  const analytes = mobilities.map((mu, i)=>({
    color: colors[i%colors.length], mu,
    x: channelL + 4 + i * 6, v: 70 + mu * 150, r: 7 + (i%2), amp: 0.7 + 0.4*Math.sin(i*1.12), active: true
  }));
  return {
    w, h,
    pad, channelTop, channelH, legW, resW, resH,
    leftX, rightX, channelL, channelR, detectorX,
    chartRect, mlX, mode,
    t: 0, signal: new Array(420).fill(0), analytes
  };
}

function reset(sim){
  sim.t = 0; sim.signal.fill(0);
  let i=0; for(const a of sim.analytes){ a.x = sim.channelL + 4 + i*6; a.active = true; i++; }
}

function drawDiagram(ctx, sim, pal){
  const { pad, channelTop, channelH, legW, resW, resH, leftX, rightX, channelL, channelR } = sim;
  const fluid = pal.fluid;
  const stroke = pal.stroke;
  const labelFont = '12px Space Grotesk, system-ui, -apple-system, sans-serif';
  // Left reservoir
  ctx.fillStyle = fluid; ctx.fillRect(leftX, channelTop - 40, resW, resH + 40);
  ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.strokeRect(leftX, channelTop - 40, resW, resH + 40);
  // Right reservoir
  ctx.fillStyle = fluid; ctx.fillRect(rightX, channelTop - 40, resW, resH + 40);
  ctx.strokeStyle = stroke; ctx.strokeRect(rightX, channelTop - 40, resW, resH + 40);
  // Legs
  ctx.fillStyle = fluid; ctx.fillRect(channelL, channelTop - 40, legW, 40 + channelH);
  ctx.fillStyle = fluid; ctx.fillRect(channelR - legW, channelTop - 40, legW, 40 + channelH);
  ctx.strokeStyle = stroke; ctx.strokeRect(channelL, channelTop - 40, legW, 40 + channelH);
  ctx.strokeRect(channelR - legW, channelTop - 40, legW, 40 + channelH);
  // Top channel
  ctx.fillStyle = fluid; ctx.fillRect(channelL, channelTop, channelR - channelL, channelH);
  ctx.strokeStyle = stroke; ctx.strokeRect(channelL, channelTop, channelR - channelL, channelH);

  // Text labels removed per request; keep diagram visuals only

  // Light source + detection window
  const lx = sim.detectorX; const ly = channelTop - 22;
  ctx.strokeStyle = pal.bulb; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, channelTop); ctx.stroke();
  // bulb
  ctx.fillStyle = pal.bulb; ctx.beginPath(); ctx.arc(lx, ly-10, 6, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = pal.beam; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(lx, channelTop-10); ctx.lineTo(lx, channelTop+channelH+10); ctx.stroke();
  // Detector label removed
}

function drawChart(ctx, sim, signal, pal){
  const r = sim.chartRect; const bg = pal.chartBg;
  ctx.fillStyle = bg; ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.strokeStyle = pal.chartBorder; ctx.strokeRect(r.x, r.y, r.w, r.h);
  // axes
  ctx.strokeStyle = pal.axis; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(r.x + 28, r.y + 10); ctx.lineTo(r.x + 28, r.y + r.h - 20); ctx.lineTo(r.x + r.w - 10, r.y + r.h - 20); ctx.stroke();
  // All axis/legend text removed

  // signal
  const maxVal = Math.max(0.15, Math.max(...signal));
  ctx.beginPath();
  for(let i=0;i<signal.length;i++){
    const x = r.x + 30 + (i/(signal.length-1)) * (r.w - 45);
    const val = signal[i]/maxVal;
    const y = r.y + r.h - 22 - val*(r.h-40);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.strokeStyle = 'rgba(76,201,91,0.95)'; ctx.lineWidth = 2; ctx.stroke();

  // Remove "Data In" label
}

function drawNormalizerAndNN(ctx, sim, feats, pulsesActive, pal){
  // Input layer placement depends on layout mode
  const r = sim.chartRect;
  const inputCount = 5; // fixed per request
  const side = sim.mode === 'side';
  const inputX = side ? Math.round(r.x + r.w) : Math.round(r.x + 24); // left‑aligned when stacked
  const centerY = side ? Math.round(r.y + r.h / 2) : Math.round(r.y + r.h + 100);

  // connectors from chart to inputs
  ctx.strokeStyle = pal.connector; ctx.lineWidth = 1;
  if (side) {
    // short stubs from chart border to each input
    for (let i = 0; i < inputCount; i++) {
      const y = centerY + (i - (inputCount - 1) / 2) * 24;
      ctx.beginPath(); ctx.moveTo(inputX - 12, y); ctx.lineTo(inputX, y); ctx.stroke();
    }
  } else {
    // stacked mode: do not draw a connector/arrow back to the chart
  }

  // Place subsequent layers to the right of the input column
  const layers = [inputCount, 6, 4, 2];
  const layerX = side
    ? [inputX, inputX + 60, inputX + 120, inputX + 180]
    : [inputX, inputX + 60, inputX + 120, inputX + 180];
  const nodes = [];
  for(let li=0; li<layers.length; li++){
    const n = layers[li];
    for(let i=0;i<n;i++){
      const y = centerY + (i - (n-1)/2) * 24;
      nodes.push({x: layerX[li], y, li, i});
    }
  }
  // edges + pulses
  for(let li=0; li<layers.length-1; li++){
    for(let i=0;i<layers[li];i++){
      for(let j=0;j<layers[li+1];j++){
        const a = nodes.find(n=>n.li===li && n.i===i);
        const b = nodes.find(n=>n.li===li+1 && n.i===j);
        ctx.strokeStyle = 'rgba(76,201,91,0.28)';
        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
  }
  // nodes
  for(const n of nodes){ ctx.fillStyle = pal.node; ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, Math.PI*2); ctx.fill(); }

  // Remove Neural Network label
  // animated pulses across first two layers using global time t
  const t = draw.state?.t || 0;
  if (pulsesActive) {
    for(let i=0;i<layers[0];i++){
      for(let j=0;j<layers[1];j++){
        const a = nodes.find(n=>n.li===0 && n.i===i);
        const b = nodes.find(n=>n.li===1 && n.i===j);
        const prog = (t*0.9 + (i*0.13 + j*0.19)) % 1;
        const px = a.x + (b.x - a.x)*prog; const py = a.y + (b.y - a.y)*prog;
        ctx.fillStyle = 'rgba(76,201,91,0.95)'; ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI*2); ctx.fill();
      }
    }
  }

  // Deleon App tile after NN
  const lastX = layerX[layerX.length - 1];
  // Size app card to fit text
  let appH = 50;
  const textFont1 = '12px Space Grotesk, system-ui, -apple-system, sans-serif';
  const textFont2 = '11px Space Grotesk, system-ui, -apple-system, sans-serif';
  ctx.font = textFont1; const w1 = ctx.measureText('DELEON APP').width;
  const iconSize = 30, sidePad = 12, gap = 10;
  let appW = Math.ceil(sidePad + iconSize + gap + w1 + sidePad);
  appW = Math.max(140, appW);
  let appX, appY;
  if (side) {
    appX = Math.min(sim.w - sim.pad - appW, lastX + 50);
    appY = centerY - appH / 2;
  } else {
    // Put the app immediately to the right of the network in stacked mode
    appX = Math.min(sim.w - sim.pad - appW, lastX + 60);
    appX = Math.max(sim.pad + 10, appX);
    appY = centerY - appH / 2;
  }
  // arrow from last output node to app
  const outNodeTop = nodes.find(n=>n.li===layers.length-1 && n.i===0);
  const outNodeBottom = nodes.find(n=>n.li===layers.length-1 && n.i===layers[layers.length-1]-1);
  const outNode = outNodeTop && outNodeBottom ? { x: lastX, y: (outNodeTop.y + outNodeBottom.y)/2 } : { x: lastX, y: centerY };
  arrow(ctx, outNode.x + 6, outNode.y, appX - 12, appY + appH/2, 0.7, pal);

  // app card with icon
  ctx.save();
  roundRect(ctx, appX, appY, appW, appH, 8);
  // Black card background with subtle green border
  ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fill();
  ctx.strokeStyle = 'rgba(76,201,91,0.55)'; ctx.lineWidth = 1; ctx.stroke();
  // logo area
  const ix = appX + sidePad, iy = appY + 10, isz = iconSize;
  // Draw the light logo, scaled to fit height
  if (logoLight.complete) {
    const targetH = isz;
    const ratio = 138/252; // approximate from asset viewBox
    const targetW = Math.max(18, Math.floor(targetH*ratio));
    const cx = ix + (isz - targetW)/2; const cy = iy;
    try { ctx.drawImage(logoLight, cx, cy, targetW, targetH); } catch {}
  } else {
    // Fallback: small green dot if image not ready yet
    ctx.fillStyle = 'rgba(76,201,91,0.85)'; ctx.beginPath(); ctx.arc(ix+isz/2, iy+isz/2, 6, 0, Math.PI*2); ctx.fill();
  }
  // label
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#ffffff'; ctx.font = textFont1;
  ctx.fillText('DELEON APP', ix + isz + gap, iy + 22);
  ctx.restore();
}

function arrow(ctx, x1, y1, x2, y2, alpha=0.5, pal){
  ctx.save(); ctx.strokeStyle = pal.arrow(alpha); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  const ang = Math.atan2(y2-y1,x2-x1); const ax=x2-Math.cos(ang)*6, ay=y2-Math.sin(ang)*6;
  ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(ax - Math.sin(ang)*3, ay + Math.cos(ang)*3); ctx.lineTo(ax + Math.sin(ang)*3, ay - Math.cos(ang)*3); ctx.closePath(); ctx.fillStyle = pal.arrow(alpha); ctx.fill(); ctx.restore();
}

function roundRect(ctx, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.lineTo(x+w-rr, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+rr);
  ctx.lineTo(x+w, y+h-rr);
  ctx.quadraticCurveTo(x+w, y+h, x+w-rr, y+h);
  ctx.lineTo(x+rr, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-rr);
  ctx.lineTo(x, y+rr);
  ctx.quadraticCurveTo(x, y, x+rr, y);
  ctx.closePath();
}

function draw(ctx, sim, dt){
  const pal = getPalette();
  const w = sim.w, h = sim.h;
  ctx.clearRect(0,0,w,h);
  draw.state = { t: (draw.state?.t || 0) + dt };

  // Canvas is self-labeled inside the diagram — no page title
  ctx.fillStyle = pal.label;
  ctx.font = '16px Space Grotesk, system-ui, -apple-system, sans-serif';

  // Diagram
  drawDiagram(ctx, sim, pal);

  // Bands inside channel (discs with different velocities)
  let signal = 0;
  for(const a of sim.analytes){
    if(!a.active) continue;
    a.x += a.v * dt;
    // Draw disc only while within horizontal channel
    const cx = clamp(a.x, sim.channelL + a.r, sim.channelR - a.r);
    const cy = sim.channelTop + sim.channelH/2;
    if (a.x >= sim.channelL - 40 && a.x <= sim.channelR + 40){
      ctx.fillStyle = a.color; ctx.beginPath(); ctx.arc(cx, cy, a.r, 0, Math.PI*2); ctx.fill();
      // sign mark removed
    }
    // simple detector response
    const resp = a.amp * gaussian(a.x, sim.detectorX, 22);
    signal += resp;
    if(a.x > sim.channelR + 60) a.active = false;
  }
  if(!sim.analytes.some(a=>a.active)) reset(sim);

  // Update chart buffer
  sim.signal.push(signal); if(sim.signal.length>420) sim.signal.shift();
  drawChart(ctx, sim, sim.signal, pal);

  // Feature vector from bands (static per mix)
  const feats = sim.analytes.map(a=>a.amp);
  // Only animate NN pulses when current chart sample exceeds baseline
  const lastSample = sim.signal[sim.signal.length - 1] || 0;
  const pulsesActive = lastSample > 0.02;
  drawNormalizerAndNN(ctx, sim, feats, pulsesActive, pal);
}

function mount(canvasEl){
  const ctx = canvasEl.getContext('2d'); if(!ctx) return ()=>{};
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FPS = prefersReduced ? 12 : 60; const FRAME = 1000/FPS;
  function desiredHeightForWidth(w){
    const pad = 24; const rightReserve = 420; // keep in sync with createSim
    const canSide = (w - 2*pad) > (320 + rightReserve + 20);
    if (canSide) {
      if (w < 640) return 420;
      if (w < 900) return 460;
      if (w < 1200) return 520;
      return 560;
    } else {
      // stacked needs more vertical room
      if (w < 480) return 560;
      if (w < 720) return 600;
      return 660;
    }
  }
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Set a responsive height to trim extra bottom space
    const parentWidth = Math.max(1, Math.floor(canvasEl.parentElement?.clientWidth || canvasEl.clientWidth || 800));
    const targetH = desiredHeightForWidth(parentWidth);
    canvasEl.style.height = targetH + 'px';
    const rect = canvasEl.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvasEl.width = Math.floor(width*dpr); canvasEl.height = Math.floor(height*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    mount.sim = createSim(width, height);
  }
  window.addEventListener('resize', resize, { passive: true }); resize();

  let last = performance.now(); let raf = 0;
  function loop(now){
    if (now - last < FRAME) { raf = requestAnimationFrame(loop); return; }
    const dt = Math.min(0.05, (now - last)/1000); last = now;
    draw(ctx, mount.sim, dt);
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  return () => { if(raf) cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
}

let cleanup = () => {};
onMounted(()=>{ if(canvas.value) cleanup = mount(canvas.value); });
onBeforeUnmount(()=> cleanup());
</script>
