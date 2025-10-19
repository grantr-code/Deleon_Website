<template>
  <section class="relative w-full bg-brand-dark text-brand-text">
    <div class="relative z-10 mx-auto max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-6 pb-14 md:pb-20">
      <!-- Section heading -->
      <div>
        <h2 class="text-white tracking-[0.18em] uppercase text-[clamp(18px,2.0vw,26px)] font-mono">Latest From Deleon</h2>
        <div class="mt-6 border-t border-white/10"></div>
      </div>

      <!-- Card grid -->
      <div class="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-12 items-start">
        <article
          v-for="(post, idx) in visiblePosts"
          :key="idx"
          class="group"
        >
          <!-- Head block with fixed height so images align across cards -->
          <div class="overflow-hidden">
            <!-- Meta row -->
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <div class="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-brand-muted">
                <span>{{ post.date }}</span>
                <span>{{ post.tag }}</span>
              </div>
              <a
                :href="post.href || '#'"
                class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-brand-green hover:border-brand-green/60 transition-colors"
                aria-label="Open article"
              >
                +
              </a>
            </div>

            <!-- Title (clamped so heights match) -->
            <h3 class="mt-3 text-white text-[clamp(18px,1.6vw,24px)] leading-[1.2] title-clamp" style="--clamp: 2;">
              {{ post.title }}
            </h3>
          </div>

          <!-- Media -->
          <a :href="post.href || '#'" class="block mt-4">
            <div class="relative overflow-hidden bg-brand-card border border-white/10 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.6)]">
              <!-- Left accent bar -->
              <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-brand-green"></div>
              <!-- Image with fixed aspect ratio -->
              <div class="relative pt-[56%]">
                <img
                  :src="post.image"
                  :alt="post.title"
                  class="absolute inset-0 h-full w-full object-cover opacity-95 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  referrerpolicy="no-referrer"
                />
                <!-- Source label -->
                <div v-if="post.source" class="absolute bottom-2 right-3 text-[11px] uppercase tracking-[0.18em] text-brand-muted">{{ post.source }}</div>
              </div>
            </div>
          </a>

          <!-- Byline -->
          <div class="mt-3 text-xs text-brand-muted">{{ post.author }}</div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { getAllArticles } from '../lib/articles';

// Show only one row: determine how many columns are currently active
// Tailwind default breakpoints: sm(640), md(768), lg(1024), xl(1280)
const cols = ref(1);
function computeCols() {
  const w = window.innerWidth;
  cols.value = w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1;
}
onMounted(() => { computeCols(); window.addEventListener('resize', computeCols, { passive: true }); });
onBeforeUnmount(() => window.removeEventListener('resize', computeCols));

const all = getAllArticles();
const mapped = computed(() => all.map(a => ({
  date: a.dateDisplay,
  tag: a.tag,
  title: a.shortTitle,
  author: a.author,
  source: a.source,
  href: a.href,
  image: a.image,
})));
const visiblePosts = computed(() => mapped.value.slice(0, cols.value));
</script>

<style scoped>
.title-clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:var(--clamp,3)}
</style>
