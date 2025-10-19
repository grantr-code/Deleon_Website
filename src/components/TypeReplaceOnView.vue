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
  backspaceSpeed: { type: Number, default: 28 },
  startDelay: { type: Number, default: 0 },
  pauseAfterFirst: { type: Number, default: 800 },
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
  if (prefersReduced) {
    output.value = props.prefix + props.to;
    showCaret.value = false;
    typed = true;
    return;
  }

  output.value = '';
  showCaret.value = true;
  typed = true;

  const run = () => {
    const initial = props.prefix + props.from;
    let i = 0;

    // Stage 1: type prefix + from
    timer = setInterval(() => {
      output.value = initial.slice(0, i);
      i++;
      if (i > initial.length) {
        clearInterval(timer);
        // Stage 2: pause, then backspace `from`
        setTimeout(() => {
          let j = props.from.length;
          timer = setInterval(() => {
            j--;
            if (j < 0) {
              clearInterval(timer);
              // Stage 3: type replacement `to`
              let k = 0;
              const finalPrefix = props.prefix; // already typed and kept
              timer = setInterval(() => {
                k++;
                output.value = finalPrefix + props.to.slice(0, k);
                if (k >= props.to.length) {
                  clearInterval(timer);
                  showCaret.value = false;
                }
              }, Math.max(10, (props.toSpeed ?? props.speed)));
              return;
            }
            output.value = props.prefix + props.from.slice(0, j);
          }, Math.max(10, props.backspaceSpeed));
        }, Math.max(0, props.pauseAfterFirst));
      }
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
</script>

<style scoped>
.caret { margin-left: 2px; opacity: 0.7; animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
</style>
