<template>
  <div class="w-full">
    <ul class="rounded-[10px] overflow-hidden border border-border divide-y divide-white/10 bg-white/[.02]">
      <li v-for="(c, i) in items" :key="i">
        <div class="px-4 md:px-5 py-5 md:py-6 flex items-start gap-3">
          <span class="mt-1 inline-block h-2 w-2 rounded-full bg-accent flex-none"></span>
          <div class="min-w-0">
            <h3 class="text-foreground text-[clamp(16px,1.6vw,18px)] font-semibold leading-tight">{{ c.title }}</h3>
            <p class="mt-1 text-muted-foreground">{{ c.text }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({ items: { type: Array, required: true } });
</script>

