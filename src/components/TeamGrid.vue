<template>
  <section class="relative w-full bg-brand-dark text-brand-text">
    <div class="relative z-10 mx-auto max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pb-16">
      <div v-for="(group, gi) in groups" :key="gi" class="mt-2 md:mt-4">
        <div class="border-t border-white/10"></div>
        <div class="flex items-center justify-between mt-6">
          <h2 class="text-white text-[clamp(18px,2.2vw,28px)] leading-tight">{{ group.title }}</h2>
          <div v-if="group.note" class="text-[12px] uppercase tracking-[0.18em] text-brand-muted">{{ group.note }}</div>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-x-10 gap-y-14 items-start">
          <article
            v-for="(m, i) in group.members"
            :key="i"
            class="group"
          >
            <div
              class="relative bg-brand-card border border-white/10 rounded-[12px] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60 transition-all duration-300 self-start"
              role="button"
              :aria-expanded="isOpen(gi,i) ? 'true' : 'false'"
              :aria-controls="panelId(gi,i)"
              tabindex="0"
              @click="toggle(gi,i)"
              @keydown.enter.prevent="toggle(gi,i)"
              @keydown.space.prevent="toggle(gi,i)"
              :class="isOpen(gi,i)
                ? 'p-7 md:p-9 border-white/20 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.6)] ring-1 ring-brand-green/40 scale-[1.01] md:scale-[1.02] overflow-visible z-10'
                : 'p-6 md:p-7 overflow-hidden'"
            >
              <div class="flex items-center gap-6">
                <div class="shrink-0">
                  <div class="rounded-full overflow-hidden border border-white/15 bg-gradient-to-br from-white/5 to-white/[.02] flex items-center justify-center text-white/80 transition-[width,height] duration-300"
                       :class="isOpen(gi,i) ? 'h-28 w-28 md:h-36 md:w-36' : 'h-24 w-24 md:h-28 md:w-28'">
                    <img v-if="m.photo" :src="m.photo" :alt="m.name" class="h-full w-full object-cover" loading="lazy" decoding="async" />
                    <span v-else class="font-semibold">{{ initials(m.name) }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-white text-[clamp(20px,2.0vw,26px)] leading-tight">{{ m.name }}</h3>
                  <div v-if="m.role" class="text-[11px] uppercase tracking-[0.18em] text-brand-muted mt-1">{{ m.role }}</div>
                </div>
                <div class="ml-2 text-brand-muted">
                  <svg :class="['h-5 w-5 transition-transform', isOpen(gi,i) ? 'rotate-180' : 'rotate-0']" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <div
                :id="panelId(gi,i)"
                class="mt-4 pt-4 border-t border-white/10 overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out"
                :class="isOpen(gi,i) ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'"
              >
                <TypeOnView
                  v-if="m.bio && isOpen(gi,i)"
                  :key="panelId(gi,i) + '-bio'"
                  :text="m.bio"
                  :speed="20"
                  tag="p"
                  wrapper-class="text-brand-muted text-sm md:text-base leading-relaxed whitespace-pre-line"
                />

                <div v-if="social(m).length" class="mt-4 flex flex-wrap gap-2">
                  <a
                    v-for="(l, li) in social(m)"
                    :key="li"
                    :href="l.href"
                    target="_blank"
                    rel="noopener"
                    @click.stop
                    class="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-brand-text/90 hover:text-white hover:border-white/30"
                  >
                    <span v-if="l.label === 'X'">X</span>
                    <span v-else>{{ l.label }}</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import TypeOnView from './TypeOnView.vue';

const props = defineProps({
  groups: { type: Array, default: () => [] },
});

const openKey = ref('');
const keyFor = (gi, i) => `${gi}-${i}`;
const isOpen = (gi, i) => openKey.value === keyFor(gi, i);
const toggle = (gi, i) => {
  const k = keyFor(gi, i);
  openKey.value = openKey.value === k ? '' : k;
};
const panelId = (gi, i) => `team-panel-${gi}-${i}`;

function initials(name = '') {
  return (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase() || '')
    .join('');
}

function social(m = {}) {
  const out = [];
  const seen = new Set();
  const push = (label, href) => {
    if (!href || seen.has(label)) return; seen.add(label); out.push({ label, href });
  };
  push('LinkedIn', m.linkedin);
  push('X', m.x || m.twitter);
  if (Array.isArray(m.links)) {
    for (const l of m.links) {
      const lbl = (l.label || '').toLowerCase();
      if (lbl.includes('linkedin')) push('LinkedIn', l.href);
      if (lbl === 'x' || lbl.includes('twitter')) push('X', l.href);
    }
  }
  return out;
}
</script>
