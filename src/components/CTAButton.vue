<template>
  <a
    :href="href"
    :class="[
      'group inline-flex items-center justify-between gap-4',
      'rounded-full border border-border px-5 sm:px-7 py-4 sm:py-5',
      'bg-muted/5 hover:bg-muted/10 hover:border-accent/60 transition-colors',
      fullWidth ? 'w-full md:w-auto md:justify-start' : ''
    ]"
  >
    <span class="text-left">
      <span class="block text-sm text-muted-foreground">{{ label }}</span>
      <span class="block text-[clamp(16px,1.3vw,18px)] text-foreground">{{ action }}</span>
    </span>
    <span class="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground group-hover:border-accent/60">
      {{ icon }}
    </span>
  </a>
</template>

<script setup>
const props = defineProps({
  // Link destination (usually mailto or page link)
  href: {
    type: String,
    required: true
  },
  // Small label text (above action text)
  label: {
    type: String,
    required: true
  },
  // Main action text
  action: {
    type: String,
    required: true
  },
  // Icon character (default +)
  icon: {
    type: String,
    default: '+'
  },
  // Make button full width on mobile
  fullWidth: {
    type: Boolean,
    default: true
  }
});
</script>
