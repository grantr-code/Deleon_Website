<template>
  <component :is="tag" ref="root" :class="[wrapperClass]" aria-live="polite">
    <span>{{ output }}</span><span v-if="showCaret" class="caret" aria-hidden="true">▌</span>
  </component>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  speed: { type: Number, default: 28 },
  startDelay: { type: Number, default: 0 },
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

function start() {
  if (typed && props.once) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { output.value = props.text; showCaret.value = false; typed = true; return; }
  output.value = '';
  showCaret.value = true;
  typed = true;
  const run = () => {
    let i = 0;
    timer = setInterval(() => {
      output.value = props.text.slice(0, i);
      i++;
      if (i > props.text.length) { clearInterval(timer); showCaret.value = false; }
    }, Math.max(10, props.speed));
  };
  if (props.startDelay) setTimeout(run, props.startDelay); else run();
}

onMounted(() => {
  if (!root.value) return;
  observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) start(); });
  }, { threshold: 0.45 });
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
  if (observer) observer.disconnect();
});

watch(() => props.text, (t) => { if (!typed) output.value = ''; });
</script>

<style scoped>
.caret { margin-left: 2px; opacity: 0.7; animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>

