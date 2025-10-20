<template>
  <component :is="tag" ref="root" :class="[wrapperClass]" aria-live="polite">
    <span>{{ prefixOutput }}</span>
    <component :is="wordTag" :class="wordClass">{{ wordOutput }}</component>
    <span v-if="showCaret" class="caret" aria-hidden="true">▌</span>
    <span>{{ suffixOutput }}</span>
  </component>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  prefix: { type: String, required: true },
  // Optional suffix rendered after the typed word (not typed)
  suffix: { type: String, default: '' },
  // Two-word legacy API
  from: { type: String, default: '' },
  to: { type: String, default: '' },
  // Multi-word API (if provided, cycles through these instead of from/to)
  words: { type: Array, default: null },
  // Typing speeds
  speed: { type: Number, default: 28 },
  toSpeed: { type: Number, default: null },
  fromSpeed: { type: Number, default: null },
  initialSpeed: { type: Number, default: null },
  backspaceSpeed: { type: Number, default: 28 },
  // Timing
  startDelay: { type: Number, default: 0 },
  pauseAfterFirst: { type: Number, default: 800 },
  loop: { type: Boolean, default: false },
  swapInterval: { type: Number, default: 10000 },
  pauseFrom: { type: Number, default: null },
  pauseTo: { type: Number, default: null },
  once: { type: Boolean, default: true },
  // Markup
  tag: { type: String, default: 'div' },
  wrapperClass: { type: String, default: '' },
  wordTag: { type: String, default: 'span' },
  wordClass: { type: String, default: '' },
});

const root = ref(null);
const prefixOutput = ref('');
const wordOutput = ref('');
const suffixOutput = ref('');
const showCaret = ref(false);
let typed = false;
let timer = null;
let observer = null;
let timeouts = [];
let wordList = [];
let wordIndex = 0;

function clearTimers() {
  if (timer) { clearInterval(timer); timer = null; }
  for (const t of timeouts) clearTimeout(t);
  timeouts = [];
}

function start() {
  if (typed && props.once) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Resolve word list: prefer multi-word API when present
  wordList = Array.isArray(props.words) && props.words.length > 0
    ? props.words.slice()
    : [props.from, props.to].filter(Boolean);
  if (wordList.length === 0) wordList = [''];
  wordIndex = 0;

  if (prefersReduced) {
    prefixOutput.value = props.prefix;
    wordOutput.value = wordList[wordIndex] || '';
    suffixOutput.value = props.suffix;
    showCaret.value = false;
    typed = true;
    return;
  }

  prefixOutput.value = '';
  wordOutput.value = '';
  suffixOutput.value = '';
  showCaret.value = true;
  typed = true;

  const useSpeedFrom = () => Math.max(10, (props.fromSpeed ?? props.speed));
  const useSpeedTo = () => Math.max(10, (props.toSpeed ?? props.speed));
  const useBackspace = () => Math.max(10, props.backspaceSpeed);
  const useInitial = () => Math.max(10, (props.initialSpeed ?? useSpeedFrom()));
  const getPauseForIndex = (idx) => {
    // For multi-word mode: allow pauseFrom for first item, pauseTo for others, else swapInterval
    if (Array.isArray(props.words) && props.words?.length) {
      if (idx === 0 && props.pauseFrom != null) return Math.max(0, props.pauseFrom);
      if (props.pauseTo != null) return Math.max(0, props.pauseTo);
      return Math.max(0, props.swapInterval);
    }
    // Legacy two-word mode
    if (idx === 0) return Math.max(0, (props.pauseFrom ?? props.pauseAfterFirst ?? props.swapInterval));
    return Math.max(0, (props.pauseTo ?? props.swapInterval));
  };

  let prefixDone = false;
  let current = 'from'; // legacy sentinel used only for non-array

  function typeWord(word, speed, cb) {
    clearInterval(timer);
    showCaret.value = true;
    if (!prefixDone) {
      // On first pass, type prefix + word + suffix as one continuous animation
      const target = props.prefix + word + (props.suffix || '');
      let i = 0;
      timer = setInterval(() => {
        const partial = target.slice(0, i);
        // Split into prefix/word/suffix portions for display
        const prefLen = Math.min(props.prefix.length, partial.length);
        const wordLen = Math.min(word.length, Math.max(0, partial.length - props.prefix.length));
        prefixOutput.value = partial.slice(0, prefLen);
        wordOutput.value = partial.slice(prefLen, prefLen + wordLen);
        suffixOutput.value = partial.slice(prefLen + wordLen);
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
        prefixOutput.value = props.prefix;
        wordOutput.value = word.slice(0, k);
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
      prefixOutput.value = props.prefix;
      wordOutput.value = word.slice(0, j);
      j--;
      if (j < 0) {
        clearInterval(timer);
        cb && cb();
      }
    }, useBackspace());
  }

  function scheduleSwap() {
    const t = setTimeout(() => swap(), getPauseForIndex(wordIndex));
    timeouts.push(t);
  }

  function swap() {
    // Determine next word based on mode
    if (Array.isArray(props.words) && props.words?.length) {
      const currentWord = wordList[wordIndex] ?? '';
      const nextIndex = (wordIndex + 1) % wordList.length;
      const nextWord = wordList[nextIndex] ?? '';
      const spd = useSpeedTo();
      backspaceWord(currentWord, () => {
        typeWord(nextWord, spd, () => {
          wordIndex = nextIndex;
          if (props.loop) scheduleSwap();
        });
      });
    } else {
      // Legacy two-word toggle
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
  }

  const run = () => {
    const initialDelay = Math.max(0, props.startDelay || 0);
    const startFn = () => {
      const firstWord = wordList[0] ?? '';
      typeWord(firstWord, useInitial(), () => {
        const firstPause = getPauseForIndex(0);
        const t = setTimeout(() => {
          if (props.loop) swap();
          else if (wordList.length > 1) {
            backspaceWord(firstWord, () => {
              const secondWord = wordList[1] ?? '';
              typeWord(secondWord, useSpeedTo());
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
