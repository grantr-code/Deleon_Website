<template>
  <section class="relative w-full bg-brand-dark text-brand-text">
    <div class="relative z-10 mx-auto max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 pt-6 pb-14 md:pb-20">
      <!-- Section heading -->
      <div>
        <h2 class="text-white tracking-[0.18em] uppercase text-[clamp(18px,2.0vw,26px)] font-mono">Latest From Deleon</h2>
        <div class="mt-6 border-t border-white/10"></div>
      </div>

      <!-- Card grid -->
      <div class="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16 items-start">
        <article
          v-for="(post, idx) in visiblePosts"
          :key="idx"
          class="group"
        >
          <!-- Head block with fixed height so images align across cards -->
          <div class="h-[156px] md:h-[164px] lg:h-[168px] overflow-hidden">
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
            <h3 class="mt-4 text-white text-[clamp(18px,1.6vw,24px)] leading-[1.15] title-clamp" style="--clamp: 3;">
              {{ post.title }}
            </h3>
          </div>

          <!-- Media -->
          <a :href="post.href || '#'" class="block mt-5">
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

const props = defineProps({
  posts: {
    type: Array,
    default: () => [
      {
        date: '10/15/2025',
        tag: 'Press',
        title: 'Deleon secures seed funding to bring metabolomics to every locker room',
        author: 'Team Deleon',
        source: 'Newsroom',
        href: '#',
        image:
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      },
      {
        date: '10/10/2025',
        tag: 'Deep Dive',
        title: 'Inside the Deleon Analyzer: thousands of metabolites in minutes',
        author: 'Engineering',
        source: 'Blog',
        href: '#',
        image: '/BrandAssets/news/analyzer.svg',
      },
      {
        date: '09/28/2025',
        tag: 'Results',
        title: 'Pilot results: 22% fewer soft‑tissue injuries across three pro teams',
        author: 'Performance Science',
        source: 'Study',
        href: '#',
        image: '/BrandAssets/news/pilot.svg',
      },
      {
        date: '09/18/2025',
        tag: 'Field Notes',
        title: 'From sample to decision: how coaches use metabolomic readiness daily',
        author: 'Coaching Ops',
        source: '—',
        href: '#',
        image:
          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
      },
      {
        date: '09/08/2025',
        tag: 'Update',
        title: 'Edge AI scoring flags travel fatigue within hours',
        author: 'Engineering',
        source: 'Product',
        href: '#',
        image:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      },
      {
        date: '08/21/2025',
        tag: 'Partnership',
        title: 'Deleon x University Sports Lab announce performance research collaboration',
        author: 'Newsroom',
        source: 'Press',
        href: '#',
        image:
          'https://images.unsplash.com/photo-1546484959-f9a53db89de0?q=80&w=1200&auto=format&fit=crop',
      },
      {
        date: '08/14/2025',
        tag: 'Research',
        title: 'Personalized fueling plans powered by metabolomic signatures',
        author: 'Nutrition Science',
        source: 'Blog',
        href: '#',
        image:
          'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=1200&auto=format&fit=crop',
      },
      {
        date: '07/30/2025',
        tag: 'Milestone',
        title: 'One million metabolite reads processed on Deleon',
        author: 'Team Deleon',
        source: '—',
        href: '#',
        image:
          'https://images.unsplash.com/photo-1555993539-1732b0258235?q=80&w=1200&auto=format&fit=crop',
      },
    ],
  },
});

// Show only one row: determine how many columns are currently active
// Tailwind default breakpoints: sm(640), md(768), lg(1024), xl(1280)
const cols = ref(1);
function computeCols() {
  const w = window.innerWidth;
  cols.value = w >= 1280 ? 4 : w >= 1024 ? 3 : w >= 640 ? 2 : 1;
}
onMounted(() => { computeCols(); window.addEventListener('resize', computeCols, { passive: true }); });
onBeforeUnmount(() => window.removeEventListener('resize', computeCols));

const visiblePosts = computed(() => props.posts.slice(0, cols.value));
</script>

<style scoped>
.title-clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;-webkit-line-clamp:var(--clamp,3)}
</style>
