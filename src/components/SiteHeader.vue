<template>
  <header
    id="site-header"
    :class="[(isLightHeader ? 'text-black' : 'text-white'), 'relative z-40 pt-8', compact ? 'pb-6 lg:pb-16' : 'pb-12 lg:pb-52']"
  >
    <div :class="subpage ? 'max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24' : 'max-w-[1280px] mx-auto px-4'">
      <!-- Subpage variant: left-aligned brand + chip-style nav in same row -->
      <div v-if="subpage">
        <div class="flex items-center justify-between gap-4">
          <a href="/" class="flex items-center gap-3.5" aria-label="Deleon">
            <img :src="themedLogoSrc" alt="Deleon logo" class="h-10 md:h-11 w-auto" />
            <span ref="brandText" class="font-logo font-light uppercase tracking-[0.15em] text-[1.10rem] md:text-[1.25rem] relative top-[5px]">{{ data.brandText }}</span>
          </a>
          <div class="flex items-center gap-3">
            <!-- Desktop chips (right aligned); auto-collapse to hamburger on overflow -->
              <ul
                ref="chipsUl"
                class="hidden lg:flex flex-nowrap gap-2 items-center justify-end"
                v-show="!shouldCollapse"
              >
                <li v-for="item in data.nav" :key="item.label">
                  <a
                    :href="item.href"
                    :class="chipClass + ' whitespace-nowrap'"
                  >
                    {{ item.label }}
                  </a>
                </li>
              </ul>
            <!-- Mobile menu toggle -->
            <button
              type="button"
              :class="[(isLightHeader ? 'p-2 rounded-md border border-black/20 hover:bg-black/5 transition' : 'p-2 rounded-md border border-white/20 hover:bg-white/10 transition'), isLg ? (shouldCollapse ? 'block' : 'hidden') : 'block']"
              :aria-expanded="isOpen ? 'true' : 'false'"
              aria-controls="primary-nav"
              @click="isOpen = !isOpen"
            >
              <span class="sr-only">Toggle navigation</span>
              <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Mobile chips revealed by toggle -->
        <nav :id="'primary-nav'" :class="['mt-4', isOpen ? 'block' : 'hidden']">
          <ul class="flex flex-wrap gap-2 items-center">
            <li v-for="item in data.nav" :key="item.label">
              <a
                :href="item.href"
                :class="chipClass"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Default (homepage) header variant -->
      <div v-else>
        <div class="flex items-center justify-between gap-4">
          <a href="/" class="flex items-center gap-3.5" aria-label="Deleon">
            <img :src="themedLogoSrc" alt="Deleon logo" class="h-10 md:h-11 w-auto" />
            <span class="font-logo font-light uppercase tracking-[0.15em] text-[1.10rem] md:text-[1.25rem] relative top-[5px]">{{ data.brandText }}</span>
          </a>
          <div class="flex items-center gap-3">
            <!-- Desktop chips (right aligned); auto-collapse to hamburger on overflow -->
              <ul
                ref="chipsUl"
                class="hidden lg:flex flex-nowrap gap-2 items-center justify-end"
                v-show="!shouldCollapse"
              >
                <li v-for="item in data.nav" :key="item.label">
                  <a
                    :href="item.href"
                    :class="chipClass + ' whitespace-nowrap'"
                  >
                    {{ item.label }}
                  </a>
                </li>
              </ul>
            <!-- Mobile menu toggle -->
            <button
              type="button"
              :class="[(isLightHeader ? 'p-2 rounded-md border border-black/20 hover:bg-black/5 transition lg:hidden' : 'p-2 rounded-md border border-white/20 hover:bg-white/10 transition lg:hidden'), isLg ? (shouldCollapse ? 'block' : 'hidden') : 'block']"
              :aria-expanded="isOpen ? 'true' : 'false'"
              aria-controls="primary-nav"
              @click="isOpen = !isOpen"
            >
              <span class="sr-only">Toggle navigation</span>
              <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Mobile chips revealed by toggle -->
        <nav :id="'primary-nav'" :class="['mt-4', isOpen ? 'block' : 'hidden']">
          <ul class="flex flex-wrap gap-2 items-center">
            <li v-for="item in data.nav" :key="item.label">
              <a
                :href="item.href"
                :class="chipClass"
              >
                {{ item.label }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed, inject } from 'vue';

const props = defineProps({
  data: { type: Object, required: true },
  compact: { type: Boolean, default: false },
  subpage: { type: Boolean, default: false },
});

// Theme injection for header colors/logo
const injectedTheme = inject('headerTheme', ref('dark'));
const isLightHeader = computed(() => injectedTheme?.value === 'light');

// NOTE: file naming: "Deleon_Logo_light.svg" is the WHITE logo for DARK headers.
// In Light mode we use the normal (black) SVG.
const themedLogoSrc = computed(() =>
  isLightHeader.value ? '/BrandAssets/Deleon_Logo.svg' : props.data.logoSrc
);
const chipClass = computed(() => isLightHeader.value
  ? 'px-3 py-1.5 rounded-md text-xs border transition bg-brand-green/10 border-brand-green/40 text-black hover:bg-brand-green/15 hover:border-brand-green/60'
  : 'px-3 py-1.5 rounded-md text-xs border transition bg-brand-green/10 border-brand-green/40 text-white hover:bg-brand-green/15 hover:border-brand-green/60');

const isOpen = ref(false);

// Auto-collapse chips into hamburger when they overflow available width (on lg+)
const chipsUl = ref(null);
const brandText = ref(null);
const shouldCollapse = ref(false);
const isLg = ref(false);
let mql; // matchMedia('(min-width: 1024px)')
let mqlHandler; // stored change handler for cleanup
let ro;  // ResizeObserver

function updateIsLg() {
  isLg.value = mql ? mql.matches : false;
}

function computeOverflow() {
  // Only collapse logic on large screens; mobile already uses hamburger
  if (!isLg.value) {
    shouldCollapse.value = false;
    return;
  }
  const el = chipsUl.value;
  // Check if brand text wrapped to multiple lines
  let brandWrapped = false;
  const b = brandText.value;
  if (b) {
    try {
      const rects = b.getClientRects?.();
      brandWrapped = rects && rects.length > 1 ? true : (b.scrollHeight > b.clientHeight + 1);
    } catch { brandWrapped = false; }
  }
  // Check chips overflow when present
  const chipsOverflow = el ? (el.scrollWidth > el.clientWidth + 1) : false;
  shouldCollapse.value = !!(brandWrapped || chipsOverflow);
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    mql = window.matchMedia('(min-width: 1024px)');
    updateIsLg();
    // react to breakpoint changes
    mqlHandler = () => { updateIsLg(); nextTick(computeOverflow); };
    if (mql.addEventListener) {
      mql.addEventListener('change', mqlHandler);
    } else if (mql.addListener) {
      // Safari fallback
      mql.addListener(mqlHandler);
    }
    // observe width changes of the chips list
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => computeOverflow());
      if (chipsUl.value) ro.observe(chipsUl.value);
      if (brandText.value) ro.observe(brandText.value);
    }
    window.addEventListener('resize', computeOverflow, { passive: true });
    nextTick(() => computeOverflow());
    // extra measure after fonts/layout settle
    setTimeout(computeOverflow, 150);
  }
});

onBeforeUnmount(() => {
  if (mql) {
    if (mql.removeEventListener && mqlHandler) mql.removeEventListener('change', mqlHandler);
    else if (mql.removeListener && mqlHandler) mql.removeListener(mqlHandler);
  }
  if (ro) {
    try { ro.disconnect(); } catch {}
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', computeOverflow);
  }
});
</script>

<style scoped>

.group-nav .nav-icon {
  position: relative;
  width: 16px;   /* reserve final width so layout doesn't shift */
  height: 12px;  /* just a container height */
  flex: 0 0 16px;
}
.group-nav .nav-icon::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #4CC95B; /* brand green */
  transform: translateY(-50%);
  transition: width .25s ease, height .25s ease, border-radius .25s ease;
}
.group-nav .nav-icon::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 6px;
  height: 6px;
  border-top: 2px solid #4CC95B;
  border-right: 2px solid #4CC95B;
  transform: translateY(-50%) rotate(45deg) translateX(-6px);
  opacity: 0;
  transition: opacity .2s ease, transform .25s ease;
}
.group-nav:hover .nav-icon::before { width: 12px; height: 2px; border-radius: 1px; }
.group-nav:hover .nav-icon::after { opacity: 1; transform: translateY(-50%) rotate(45deg) translateX(0); }

/* Keep dots/arrows aligned; shift only the label */
.group-nav { position: relative; }
.group-nav .nav-label { transition: transform .25s ease; transform: translateX(0); }
.group-nav:hover .nav-label { transform: translateX(8px); }

/* Keep behavior desktop-first; no special mobile hiding needed */
/* Mobile dropdown background panel */
@media (max-width: 1023.98px) {
  /* Only apply the gray panel to the default (homepage) header variant,
     which uses the .grid wrapper. */
  .grid #primary-nav { position: relative; }
  .grid #primary-nav::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    /* Extend well past the last item so background fully covers */
    bottom: -22px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    pointer-events: none;
    z-index: -1;
  }
}
</style>
