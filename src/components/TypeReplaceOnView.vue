<template>
  <component :is="tag" ref="root" :class="[wrapperClass]" aria-live="polite">
    <span>{{ output }}</span><span v-if="showCaret" class="caret" aria-hidden="true">▌</span>
  </component>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  prefix: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  speed: { type: Number, default: 28 },
  toSpeed: { type: Number, default: null },
  fromSpeed: { type: Number, default: null },
  backspaceSpeed: { type: Number, default: 28 },
  startDelay: { type: Number, default: 0 },
  pauseAfterFirst: { type: Number, default: 800 },
  loop: { type: Boolean, default: false },
  swapInterval: { type: Number, default: 10000 },
  once: { type: Boolean, default: true },
  tag: { type: String, default: 'div' },
  wrapperClass: { type: String, default: '' },
});

const root = ref(null);
const output = ref('');
const showCaret = ref(false);
let typed = false;
let timer = null;
let observer = null;
let timeouts = [];

function clearTimers() {
  if (timer) { clearInterval(timer); timer = null; }
  for (const t of timeouts) clearTimeout(t);
  timeouts = [];
}

function start() {
  if (typed && props.once) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    output.value = props.prefix + props.to;
    showCaret.value = false;
    typed = true;
    return;
  }

  output.value = '';
  showCaret.value = true;
  typed = true;

  const useSpeedFrom = () => Math.max(10, (props.fromSpeed ?? props.speed));
  const useSpeedTo = () => Math.max(10, (props.toSpeed ?? props.speed));
  const useBackspace = () => Math.max(10, props.backspaceSpeed);

  let prefixDone = false;
  let current = 'from';

  function typeWord(word, speed, cb) {
    clearInterval(timer);
    showCaret.value = true;
    if (!prefixDone) {
      const target = props.prefix + word;
      let i = 0;
      timer = setInterval(() => {
        output.value = target.slice(0, i);
        i++;
        if (i > target.length) {
          clearInterval(timer);
          prefixDone = true;
          showCaret.value = false;
          cb && cb();
        }
      }, Math.max(10, speed));
    } else {
      let k = 0;
      timer = setInterval(() => {
        output.value = props.prefix + word.slice(0, k);
        k++;
        if (k > word.length) {
          clearInterval(timer);
          showCaret.value = false;
          cb && cb();
        }
      }, Math.max(10, speed));
    }
  }

  function backspaceWord(word, cb) {
    clearInterval(timer);
    showCaret.value = true;
    let j = word.length;
    timer = setInterval(() => {
      output.value = props.prefix + word.slice(0, j);
      j--;
      if (j < 0) {
        clearInterval(timer);
        cb && cb();
      }
    }, useBackspace());
  }

  function scheduleSwap() {
    const t = setTimeout(() => swap(), Math.max(0, props.swapInterval));
    timeouts.push(t);
  }

  function swap() {
    const next = current === 'from' ? 'to' : 'from';
    const back = current === 'from' ? props.from : props.to;
    const word = next === 'from' ? props.from : props.to;
    const spd = next === 'from' ? useSpeedFrom() : useSpeedTo();
    backspaceWord(back, () => {
      typeWord(word, spd, () => {
        current = next;
        if (props.loop) scheduleSwap();
      });
    });
  }

  const run = () => {
    const initialDelay = Math.max(0, props.startDelay || 0);
    const startFn = () => {
      typeWord(props.from, useSpeedFrom(), () => {
        const firstPause = Math.max(0, props.pauseAfterFirst ?? props.swapInterval);
        const t = setTimeout(() => {
          if (props.loop) swap();
          else {
            backspaceWord(props.from, () => {
              typeWord(props.to, useSpeedTo());
            });
          }
        }, firstPause);
        timeouts.push(t);
      });
    };
    if (initialDelay) {
      const t = setTimeout(startFn, initialDelay);
      timeouts.push(t);
    } else {
      startFn();
    }
  };

  run();
}

onMounted(() => {
  if (!root.value) return;
  observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) start(); });
  }, { threshold: 0.45 });
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  clearTimers();
  if (observer) observer.disconnect();
});
</script>

<style scoped>
.caret { margin-left: 2px; opacity: 0.7; animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
