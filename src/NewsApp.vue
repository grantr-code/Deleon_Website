<template>
  <BasePageLayout compact subpage>
    <section class="relative w-full">
      <div class="section-container py-10 md:py-14">
        <!-- Meta/top -->
        <div class="flex items-center justify-between gap-6 border-b border-border pb-4">
          <div class="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>News</span>
          </div>
          <IconButton href="/" aria-label="Back to home" size="sm">
            <IconBackArrow />
          </IconButton>
        </div>

          <!-- Title -->
          <h1 class="mt-6 text-foreground text-[clamp(28px,3.0vw,38px)] leading-[1.15] tracking-[-0.01em]">Latest Updates</h1>

          <!-- Grid of articles -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
            <article v-for="post in pagedPosts" :key="post.slug" class="group">
              <div class="flex items-center justify-between border-b border-border pb-3">
                <div class="flex items-center gap-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{{ post.dateDisplay }}</span>
                  <span>{{ post.tag }}</span>
                </div>
                <a :href="post.href" class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground/80 hover:text-accent hover:border-accent/60 transition-colors" aria-label="Open article">+</a>
              </div>
              <h3 class="mt-4 text-foreground text-[clamp(18px,1.6vw,24px)] leading-[1.15]">{{ post.shortTitle }}</h3>
              <a :href="post.href" class="block mt-5">
                <MediaCard :src="post.image" :alt="post.shortTitle">
                  <div v-if="post.source" class="absolute bottom-2 right-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {{ post.source }}
                  </div>
                </MediaCard>
              </a>
              <div class="mt-3 text-xs text-muted-foreground">{{ post.author }}</div>
            </article>
          </div>

        <!-- Pagination controls -->
        <div class="mt-10 flex items-center justify-between">
          <button @click="prevPage" :disabled="page === 1" class="px-3 py-2 rounded-md border border-border text-foreground/80 hover:text-foreground hover:border-border disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
          <div class="text-sm text-muted-foreground">Page {{ page }} of {{ totalPages }}</div>
          <button @click="nextPage" :disabled="page >= totalPages" class="px-3 py-2 rounded-md border border-border text-foreground/80 hover:text-foreground hover:border-border disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
        </div>
      </div>
    </section>
  </BasePageLayout>
</template>

<script setup>
import { computed, ref, watchEffect, onMounted } from 'vue';
import BasePageLayout from './components/BasePageLayout.vue';
import IconButton from './components/IconButton.vue';
import IconBackArrow from './components/icons/IconBackArrow.vue';
import MediaCard from './components/MediaCard.vue';
import { getAllArticles } from './lib/articles';
import { useEarlyAccessPanel } from './composables/useEarlyAccessPanel';

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

// Support deep link to #updates
const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => {
  if (typeof window !== 'undefined' && window.location.hash === '#updates') openEarly();
});
</script>

<style scoped>
.title-clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:var(--clamp,3)}
</style>
