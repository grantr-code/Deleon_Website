<template>
  <div class="aspect-guard with-rails">
    <SiteHeader :data="data.header" compact subpage />
    <main id="main-content" tabindex="-1" class="relative bg-brand-dark text-brand-text">
      <section class="relative w-full">
        <div class="mx-auto max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-10 md:py-14">
          <!-- Meta/top -->
          <div class="flex items-center justify-between gap-6 border-b border-white/10 pb-4">
            <div class="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-brand-muted">
              <span>News</span>
            </div>
            <a href="/" class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-brand-green hover:border-brand-green/60 transition-colors" aria-label="Back to home">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6l-6 6 6 6"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16"/>
              </svg>
            </a>
          </div>

          <!-- Title -->
          <h1 class="mt-6 text-white text-[clamp(28px,3.0vw,38px)] leading-[1.15] tracking-[-0.01em]">Latest Updates</h1>

          <!-- Grid of articles -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            <article v-for="post in pagedPosts" :key="post.slug" class="group">
              <div class="flex items-center justify-between border-b border-white/10 pb-3">
                <div class="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-brand-muted">
                  <span>{{ post.dateDisplay }}</span>
                  <span>{{ post.tag }}</span>
                </div>
                <a :href="post.href" class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/80 hover:text-brand-green hover:border-brand-green/60 transition-colors" aria-label="Open article">+</a>
              </div>
              <h3 class="mt-4 text-white text-[clamp(18px,1.6vw,24px)] leading-[1.15]">{{ post.shortTitle }}</h3>
              <a :href="post.href" class="block mt-5">
                <div class="relative overflow-hidden bg-brand-card border border-white/10 shadow-[0_20px_60px_-18px_rgba(0,0,0,0.6)]">
                  <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-brand-green"></div>
                  <div class="relative pt-[56%]">
                    <img :src="post.image" :alt="post.shortTitle" class="absolute inset-0 h-full w-full object-cover opacity-95 group-hover:opacity-100 transition-opacity" loading="lazy" decoding="async" />
                    <div v-if="post.source" class="absolute bottom-2 right-3 text-[11px] uppercase tracking-[0.18em] text-brand-muted">{{ post.source }}</div>
                  </div>
                </div>
              </a>
              <div class="mt-3 text-xs text-brand-muted">{{ post.author }}</div>
            </article>
          </div>

          <!-- Pagination controls -->
          <div class="mt-10 flex items-center justify-between">
            <button @click="prevPage" :disabled="page === 1" class="px-3 py-2 rounded-md border border-white/20 text-white/80 hover:text-white hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
            <div class="text-sm text-brand-muted">Page {{ page }} of {{ totalPages }}</div>
            <button @click="nextPage" :disabled="page >= totalPages" class="px-3 py-2 rounded-md border border-white/20 text-white/80 hover:text-white hover:border-white/30 disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </section>
    </main>
    <SiteFooter :data="data.footer" />
  </div>
  
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { siteData as data } from './content/siteData';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import { getAllArticles } from './lib/articles';

const all = getAllArticles();

const pageSize = 9;
const page = ref(1);
const totalPages = computed(() => Math.max(1, Math.ceil(all.length / pageSize)));

function syncFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const p = parseInt(params.get('page') || '1', 10);
  page.value = isNaN(p) || p < 1 ? 1 : Math.min(p, totalPages.value);
}

function syncToUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set('page', String(page.value));
  const url = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', url);
}

syncFromUrl();
watchEffect(syncToUrl);

const pagedPosts = computed(() => {
  const start = (page.value - 1) * pageSize;
  return all.slice(start, start + pageSize);
});

function nextPage() { if (page.value < totalPages.value) page.value += 1; }
function prevPage() { if (page.value > 1) page.value -= 1; }
</script>

<style scoped>
.title-clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:var(--clamp,3)}
</style>
