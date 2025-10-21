<template>
  <div class="rounded-lg border border-border p-4 bg-muted/10">
    <h3 v-if="title" class="text-foreground font-semibold">
      {{ title }}
    </h3>
    <slot name="title" />
    <p v-if="description" class="mt-2 text-muted-foreground">
      {{ description }}
    </p>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  // Card title
  title: {
    type: String,
    default: ''
  },
  // Card description
  description: {
    type: String,
    default: ''
  }
});
</script>
