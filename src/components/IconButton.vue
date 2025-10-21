<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :type="href ? undefined : 'button'"
    :aria-label="ariaLabel"
    :class="[
      'inline-flex items-center justify-center rounded-full border transition-colors',
      'text-foreground/80 hover:text-accent border-border hover:border-accent/60',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2',
      sizeClass
    ]"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  // Link href (if it's a link)
  href: {
    type: String,
    default: ''
  },
  // Aria label for accessibility
  ariaLabel: {
    type: String,
    required: true
  },
  // Size variant
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

const emit = defineEmits(['click']);

const sizeClass = {
  sm: 'h-7 w-7',
  md: 'h-8 w-8 md:h-9 md:w-9',
  lg: 'h-10 w-10 md:h-11 md:w-11'
}[props.size];

const handleClick = (event) => {
  emit('click', event);
};
</script>
