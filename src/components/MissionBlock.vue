<template>
  <section>
    <div class="max-w-[1280px] mx-auto px-4 pt-10 pb-6 md:pb-8">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 lg:col-span-4">
          <div class="max-w-96">
            <div class="flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-brand-muted">
              <span class="inline-block h-2 w-2 rounded-full bg-brand-green"></span>
              <span>{{ eyebrow }}</span>
            </div>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-8">
          <div class="text-[clamp(22px,3.6vw,38px)] leading-tight mb-3 md:mb-5">
            <p>{{ text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  text: { type: String, required: true },
});
</script>
