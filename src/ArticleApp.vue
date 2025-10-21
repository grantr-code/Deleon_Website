<template>
  <BasePageLayout compact subpage>
    <section class="relative w-full">
      <div class="mx-auto max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-10 md:py-14">
        <!-- Top util row -->
        <div class="flex items-center justify-between gap-6 border-b border-border pb-4">
          <div class="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{{ article?.tag || 'News' }}</div>
          <IconButton href="/news.html" aria-label="Back to news" size="sm">
            <IconBackArrow />
          </IconButton>
        </div>

          <template v-if="article">
            <!-- Headline centered -->
            <h1 class="mt-6 mx-auto max-w-[760px] text-center text-foreground text-[clamp(30px,3.4vw,44px)] leading-[1.15] tracking-[-0.01em]">{{ article.longTitle }}</h1>

            <!-- Byline centered -->
            <div class="mx-auto max-w-[760px] mt-4 text-center text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              <span v-if="article.author">By {{ article.author }}</span>
              <span v-if="article.author && article.dateDisplay" class="mx-2">•</span>
              <span v-if="article.dateDisplay">{{ article.dateDisplay }}</span>
            </div>

            <!-- Hero image within article column -->
            <figure v-if="article.image" class="mx-auto max-w-[760px] mt-8">
              <MediaCard
                :src="article.image"
                :alt="article.shortTitle"
                rounded="md"
                :show-accent-bar="false"
                image-class="w-full"
              />
            </figure>

            <!-- Article body -->
            <article class="article-body mx-auto max-w-[760px] mt-8" v-html="article.content"></article>

            <!-- Article footer: LinkedIn button (optional) + source -->
            <div class="mx-auto max-w-[760px] mt-10 pt-8 border-t border-border text-center">
              <div v-if="article.linkedin" class="mb-6">
                <a :href="article.linkedin" target="_blank" rel="noopener"
                  class="inline-flex items-center justify-center rounded-full border border-neutral-700 px-5 py-3 text-[12px] uppercase tracking-[0.18em] text-foreground hover:bg-black/40">
                  View on LinkedIn
                  <span class="ml-2">→</span>
                </a>
              </div>
              <div class="text-[12px] uppercase tracking-[0.18em] text-muted-foreground">Source: {{ article.source || 'Deleon Newsroom' }}</div>
            </div>
          </template>

        <template v-else>
          <h1 class="mt-6 text-foreground text-[clamp(28px,3.2vw,40px)] leading-[1.15] tracking-[-0.01em] max-w-4xl">Article not found</h1>
          <p class="mt-6 text-muted-foreground">The article you're looking for could not be found. Return to the <a href="/news.html" class="text-accent hover:underline">News</a> page.</p>
        </template>
      </div>
    </section>
  </BasePageLayout>
</template>

<script setup>
import { computed } from 'vue';
import BasePageLayout from './components/BasePageLayout.vue';
import IconButton from './components/IconButton.vue';
import IconBackArrow from './components/icons/IconBackArrow.vue';
import MediaCard from './components/MediaCard.vue';
import { getAllArticles, getArticleBySlug } from './lib/articles';

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

const currentSlug = getSlug();
let initial = currentSlug ? getArticleBySlug(currentSlug) : undefined;
if (!initial) {
  // Fallback to latest article if slug missing/invalid
  const all = getAllArticles();
  initial = all.length ? all[0] : undefined;
}

const article = computed(() => initial);

const { open: openEarly } = useEarlyAccessPanel();
onMounted(() => { if (typeof window !== 'undefined' && window.location.hash === '#updates') openEarly(); });
</script>

<style scoped>
/* NYT-inspired, readable article defaults without Tailwind Typography */
.article-body { color: #e8e8e8; font-size: clamp(16px, 1.05vw, 18px); line-height: 1.85; }
.article-body :where(p) { margin: 1rem 0; }
.article-body :where(h2) { margin: 2rem 0 0.75rem; font-size: clamp(22px,1.6vw,26px); line-height: 1.25; color: #fff; }
.article-body :where(h3) { margin: 1.5rem 0 0.5rem; font-size: clamp(18px,1.3vw,22px); line-height: 1.3; color: #fff; }
.article-body :where(ul,ol) { margin: 1rem 0; padding-left: 1.25rem; }
.article-body :where(li) { margin: 0.35rem 0; }
.article-body :where(a) { color: #4CC95B; text-decoration: none; }
.article-body :where(blockquote) { margin: 1.25rem 0; padding-left: 1rem; border-left: 3px solid rgba(255,255,255,0.18); color: #cfcfcf; font-style: italic; }
.article-body :where(img) { max-width: 100%; height: auto; display: block; margin: 1.25rem auto; border-radius: 6px; }
</style>
