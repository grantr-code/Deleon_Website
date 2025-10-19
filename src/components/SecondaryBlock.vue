<template>
  <section>
    <div class="max-w-[1280px] mx-auto px-4 pt-11 md:pb-4">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 lg:col-span-4"></div>
        <div class="col-span-12 lg:col-span-8">
          <div class="text-[clamp(22px,3.6vw,38px)] leading-tight mb-7 md:mb-12">
            <p class="text-brand-muted max-w-[600px]">{{ text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  text: { type: String, required: true },
});
</script>
