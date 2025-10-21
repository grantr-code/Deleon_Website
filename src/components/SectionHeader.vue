<template>
  <section :class="['max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24', paddingTop, paddingBottom]">
    <div v-if="showBorder" class="border-t border-border"></div>
    <div :class="['flex items-center gap-3 text-[12px] tracking-[0.18em] uppercase text-muted-foreground', showBorder ? 'mt-4' : '']">
      <span class="inline-block h-2 w-2 rounded-full bg-accent"></span>
      <span>{{ label }}</span>
    </div>
    <h1 v-if="title" :class="['mt-3 md:mt-4 leading-tight text-foreground', titleSize]">
      {{ title }}
    </h1>
    <p v-if="description" :class="['mt-4 text-muted-foreground leading-relaxed max-w-4xl', descriptionSize]">
      {{ description }}
    </p>
    <slot name="after-description" />
  </section>
</template>

<script setup>
const props = defineProps({
  // Section label (uppercase text next to green dot)
  label: {
    type: String,
    required: true
  },
  // Main heading text
  title: {
    type: String,
    default: ''
  },
  // Description paragraph
  description: {
    type: String,
    default: ''
  },
  // Show border-top above section
  showBorder: {
    type: Boolean,
    default: true
  },
  // Title font size (clamp value)
  titleSize: {
    type: String,
    default: 'text-[clamp(28px,4.4vw,54px)]'
  },
  // Description font size (clamp value)
  descriptionSize: {
    type: String,
    default: 'text-[clamp(16px,1.6vw,18px)]'
  },
  // Padding top class
  paddingTop: {
    type: String,
    default: 'pt-4'
  },
  // Padding bottom class
  paddingBottom: {
    type: String,
    default: 'pb-6'
  }
});
</script>
