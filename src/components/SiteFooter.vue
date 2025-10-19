<template>
  <footer id="site-footer" class="relative z-10 bg-brand-dark text-brand-text mt-12 lg:mt-24">
    <div class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24">
      <!-- Removed top hairline above CTAs per request -->
      <!-- Top CTAs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          v-for="(cta, idx) in data.ctas"
          :key="idx"
          :href="cta.href"
          class="group rounded-xl p-8 md:p-10 flex items-center justify-between border transition-colors"
          :class="cta.theme === 'dark' ? 'bg-black text-brand-text border-neutral-800 hover:bg-neutral-950' : 'bg-brand-card text-brand-text border-neutral-800 hover:bg-[rgb(28,28,28)]'"
          @click.prevent="handleCtaClick(cta)"
        >
          <span class="text-2xl md:text-4xl font-medium tracking-tight">{{ cta.label }}</span>
          <span class="ml-4 shrink-0 text-2xl md:text-3xl transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <hr class="my-10 border-neutral-800" />

      <!-- Lower grid -->
      <!-- Stack on small screens; split 3/9 on large -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 pb-12 lg:pb-20">
        <!-- Left column: meta + locale + social -->
        <div class="lg:col-span-3">
          <div class="w-full">
            <p class="text-sm text-brand-muted">{{ data.copyright }}</p>
            <hr class="my-6 border-neutral-800" />

            <div class="flex flex-wrap gap-3 text-sm">
              <span v-for="(r, i) in data.regions" :key="i" class="tracking-wide text-brand-muted">{{ r }}</span>
            </div>
            <hr class="my-6 border-neutral-800" />
            <!-- Keep the divider above and below regions; remove only the one below social -->
            <div class="flex flex-col gap-3">
              <a
                v-for="s in data.social"
                :key="s.label"
                :href="s.href"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center justify-center rounded-full border border-neutral-700 px-4 py-2 text-[11px] uppercase tracking-wide text-brand-text hover:bg-black/40"
              >
                {{ s.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Right columns: link lists -->
        <div class="lg:col-span-9 min-w-0">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div v-for="col in filteredColumns" :key="col.title">
              <div class="text-[11px] uppercase tracking-wider text-brand-muted font-semibold mb-2 sm:mb-3">{{ col.title }}</div>
              <ul class="space-y-2 sm:space-y-3">
                <li v-for="item in col.links" :key="item.label">
                  <a :href="item.href" class="break-words text-sm text-brand-text/80 hover:text-brand-text">{{ item.label }}</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Partnerships / Disclaimer: placed inside right column to sit directly under site map -->
          <div class="mt-3 sm:mt-4 border-t border-neutral-800 pt-4">
            <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <a href="https://www.pravida.com/" target="_blank" rel="noopener" class="inline-flex">
                <img
                  src="/Pravida.png"
                  alt="Pravida logo"
                  class="h-8 sm:h-10 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
              </a>
              <p class="text-sm text-brand-text/80 text-center sm:text-left">
                We partner with Pravida for clinical services.
              </p>
            </div>
            <p class="mt-2 sm:mt-3 text-[12px] leading-relaxed text-brand-muted text-center sm:text-left">
              Wellness information only. Data for research use only.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useEarlyAccessPanel } from '../composables/useEarlyAccessPanel';

const props = defineProps({
  data: { type: Object, required: true },
});

// Remove empty/dead links (href '#') and drop empty columns
const filteredColumns = (props.data.columns || [])
  .map(col => ({
    title: col.title,
    links: (col.links || []).filter(l => l && l.href && l.href !== '#'),
  }))
  .filter(col => col.links.length > 0);

const { open } = useEarlyAccessPanel();
function handleCtaClick(cta) {
  // Always open the contact drawer for top CTAs per requirement
  open();
}
</script>
