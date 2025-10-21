<template>
  <div :class="['relative overflow-hidden bg-card border border-border card-shadow-deep', roundedClass]">
    <!-- Accent bar (optional) -->
    <div v-if="showAccentBar" class="accent-bar-left" aria-hidden="true"></div>

    <!-- Content with aspect ratio -->
    <div class="relative" :style="{ paddingTop: aspectRatio }">
      <!-- Image -->
      <img
        v-if="type === 'image'"
        :src="src"
        :alt="alt"
        :class="['absolute inset-0 h-full w-full object-cover', imageClass]"
        :loading="loading"
        :decoding="decoding"
      />

      <!-- Video (for future use if needed) -->
      <video
        v-else-if="type === 'video'"
        :src="src"
        :class="['absolute inset-0 h-full w-full object-cover', imageClass]"
        muted
        loop
        playsinline
      ></video>

      <!-- Slot for custom content (overlays, badges, etc.) -->
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // Media source
  src: {
    type: String,
    required: true
  },
  // Alt text for images
  alt: {
    type: String,
    default: ''
  },
  // Media type
  type: {
    type: String,
    default: 'image',
    validator: (value) => ['image', 'video'].includes(value)
  },
  // Aspect ratio as padding-top percentage (default 56% = 16:9)
  aspectRatio: {
    type: String,
    default: '56%'
  },
  // Show the accent gradient bar on the left
  showAccentBar: {
    type: Boolean,
    default: true
  },
  // Border radius class
  rounded: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'md', 'lg', 'none'].includes(value)
  },
  // Additional image classes
  imageClass: {
    type: String,
    default: 'opacity-95 group-hover:opacity-100 transition-opacity'
  },
  // Image loading strategy
  loading: {
    type: String,
    default: 'lazy'
  },
  // Image decoding strategy
  decoding: {
    type: String,
    default: 'async'
  }
});

const roundedClass = {
  default: '',
  md: 'rounded-md',
  lg: 'rounded-lg',
  none: 'rounded-none'
}[props.rounded];
</script>
