<template>
  <section aria-labelledby="video-hero-heading">
    <div class="max-w-none mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-24 py-8">
      <div class="overflow-hidden relative z-10 text-white">
        <h1 id="video-hero-heading" class="sr-only">{{ heading }}</h1>
        <div class="absolute inset-0 z-20 flex justify-center items-center bg-black/35 rounded-[10px] p-6">
          <p class="relative z-10 text-[clamp(22px,3.6vw,38px)] leading-tight text-center max-w-[900px]">
            {{ overlayText }}
          </p>
        </div>
        <figure class="rounded-[10px] overflow-hidden relative">
          <video
            class="block w-full h-[56svh] sm:h-[62svh] md:h-[68svh] lg:h-[72svh] object-cover"
            autoplay
            muted
            loop
            playsinline
            :poster="video.poster"
          >
            <source v-if="video.srcMp4" :src="video.srcMp4" type="video/mp4" />
            <source v-if="video.srcMov" :src="video.srcMov" type="video/quicktime" />
            <source v-if="video.src" :src="video.src" />
            Your browser does not support the video tag.
          </video>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  heading: { type: String, default: 'Featured Video' },
  overlayText: { type: String, required: true },
  video: { type: Object, required: true },
});
</script>
