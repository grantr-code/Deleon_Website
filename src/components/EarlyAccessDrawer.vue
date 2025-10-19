<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100]">
    <!-- Backdrop -->
    <Transition name="fade">
      <div class="absolute inset-0 bg-black/55 backdrop-blur-sm" @click="close" aria-hidden="true"></div>
    </Transition>

    <!-- Panel -->
    <Transition name="ea-slide">
      <div
        class="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-transparent text-brand-text shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ea-title"
      >
        <!-- Background animation layer -->
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-brand-dark/90"></div>
          <div class="absolute inset-0">
            <TestFlowField />
          </div>
          <div class="absolute inset-0 bg-black/35"></div>
        </div>

        <!-- Foreground content -->
        <div class="relative h-full flex flex-col border-l border-white/10">
          <div class="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/20">
            <h2 id="ea-title" class="text-lg font-semibold">Contact Deleon</h2>
            <button type="button" class="p-2 rounded-md hover:bg-white/10" @click="close" aria-label="Close panel">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="px-5 py-6 overflow-y-auto grow">
            <p class="text-sm text-white/80 mb-4">Tell us a bit about you. We’ll follow up soon.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import ContactForm from './ContactForm.vue';
import TestFlowField from './TestFlowField.vue';
import { useEarlyAccessPanel } from '../composables/useEarlyAccessPanel';

const { isOpen, close } = useEarlyAccessPanel();

function onKeydown(e) {
  if (e.key === 'Escape') close();
}

function setBodyLock(lock) {
  try {
    const body = document.body;
    if (!body) return;
    if (lock) {
      body.dataset.locked = 'true';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
    } else {
      delete body.dataset.locked;
      body.style.overflow = '';
      body.style.touchAction = '';
    }
  } catch {}
}

watch(isOpen, (v) => setBodyLock(!!v), { immediate: true });

onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown);
  setBodyLock(false);
});
</script>

<style scoped>
/* Backdrop fade */
.fade-enter-active, .fade-leave-active { transition: opacity 200ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Slide-in from right */
.ea-slide-enter-active, .ea-slide-leave-active { transition: transform 240ms ease; will-change: transform; }
.ea-slide-enter-from, .ea-slide-leave-to { transform: translateX(100%); }
</style>
