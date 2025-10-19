<template>
  <section class="relative w-full bg-brand-dark text-brand-text">
    <!-- Top hairline to match site sections -->
    <div class="border-t border-white/10"></div>

    <div class="relative z-10 mx-auto max-w-none px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-10 md:py-14">
      <!-- Heading -->
      <div>
        <h2 class="text-white tracking-[0.18em] uppercase text-[clamp(16px,1.6vw,20px)] font-mono">Partnerships</h2>
        <div class="mt-4 border-t border-white/10"></div>
      </div>

      <!-- Pravida item -->
      <div class="mt-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
        <img
          src="/Pravida.png"
          alt="Pravida logo"
          class="h-10 sm:h-12 w-auto object-contain opacity-95"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
        />
        <p class="text-sm sm:text-base text-brand-text/80 text-center sm:text-left">
          We partner with Pravida.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Presentational section – no script logic needed.
</script>

<style scoped>
/* All styling via utility classes */
</style>
