<template>
  <footer id="site-footer" class="relative z-10 bg-background text-foreground mt-12 lg:mt-24">
    <div class="section-container">
      <!-- Removed top hairline above CTAs per request -->
      <!-- Top CTAs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          v-for="(cta, idx) in data.ctas"
          :key="idx"
          :href="cta.href"
          class="group rounded-xl p-8 md:p-10 flex items-center justify-between border transition-colors"
          :class="cta.theme === 'dark' ? 'bg-card text-foreground border-border hover:bg-muted/20' : 'bg-muted/10 text-foreground border-border hover:bg-muted/20'"
          @click.prevent="handleCtaClick(cta)"
        >
          <span class="text-2xl md:text-4xl font-medium tracking-tight">{{ cta.label }}</span>
          <span class="ml-4 shrink-0 text-2xl md:text-3xl transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>

      <hr class="my-10 border-border" />

      <!-- Lower grid -->
      <!-- Stack on small screens; split 3/9 on large -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-10 pb-12 lg:pb-20">
        <!-- Left column: meta + locale + social -->
        <div class="lg:col-span-3">
          <div class="w-full">
            <p class="text-sm text-muted-foreground">{{ data.copyright }}</p>
            <hr class="my-6 border-border" />

            <div class="flex flex-wrap gap-3 text-sm">
              <span v-for="(r, i) in data.regions" :key="i" class="tracking-wide text-muted-foreground">{{ r }}</span>
            </div>
            <hr class="my-6 border-border" />
            <!-- Keep the divider above and below regions; remove only the one below social -->
            <div class="flex flex-col gap-3">
              <a
                v-for="s in data.social"
                :key="s.label"
                :href="s.href"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-wide text-foreground hover:bg-muted"
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
              <div class="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 sm:mb-3">{{ col.title }}</div>
              <ul class="space-y-2 sm:space-y-3">
                <li v-for="item in col.links" :key="item.label">
                  <a :href="item.href" class="break-words text-sm text-muted-foreground hover:text-foreground">{{ item.label }}</a>
                </li>
              </ul>
            </div>
          </div>

          <!-- Partnerships / Disclaimer: placed inside right column to sit directly under site map -->
          <div class="mt-3 sm:mt-4 border-t border-border pt-4">
            <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
              <a href="https://www.pravida.com/" target="_blank" rel="noopener" class="inline-flex">
                <img
                  src="/Pravida.png"
                  alt="Pravida logo"
                  :class="['h-8 sm:h-10 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity', isLight ? 'invert' : '']"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />
              </a>
              <p class="text-sm text-muted-foreground text-center sm:text-left">
                We partner with Pravida Health.
              </p>
            </div>
            <p class="mt-2 sm:mt-3 text-[12px] leading-relaxed text-muted-foreground text-center sm:text-left">
              Wellness information only. Data for research use only.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useEarlyAccessPanel } from '../composables/useEarlyAccessPanel';
import { useSiteTheme } from '../composables/useSiteTheme';

const props = defineProps({
  data: { type: Object, required: true },
});

// Theme support for Pravida logo inversion in light mode
const { theme } = useSiteTheme();
const isLight = computed(() => theme.value === 'light');

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
