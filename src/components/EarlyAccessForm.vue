<template>
  <div id="updates" class="mt-8">
    <form @submit.prevent="onSubmit" class="mx-auto max-w-xl">
      <div class="flex items-stretch gap-2">
        <label for="early-email" class="sr-only">Email address</label>
        <input
          id="early-email"
          v-model.trim="email"
          type="email"
          :disabled="submitting || success"
          required
          placeholder="you@company.com"
          :class="inputClass"
        />
        <button
          type="submit"
          :disabled="submitting || success"
          class="rounded-full bg-brand-green text-black font-semibold px-5 py-3 whitespace-nowrap hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span v-if="!success && !submitting">Get early access</span>
          <span v-else-if="submitting">Sending…</span>
          <span v-else>Thanks! ✅</span>
        </button>
      </div>
      <p v-if="error" class="mt-2 text-sm text-red-300">{{ error }}</p>
      <p v-if="success && message" class="mt-2 text-sm text-emerald-300">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ theme: { type: String, default: 'dark' } });

const email = ref('');
const submitting = ref(false);
const success = ref(false);
const error = ref('');
const message = ref('');

function track(event, props = {}) {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.plausible === 'function') {
      window.plausible(event, { props });
      return;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, props);
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
  } catch (_) {
    // no-op
  }
}

const inputClass = computed(() => {
  const base = 'flex-1 rounded-full px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green/60';
  if (props.theme === 'light') {
    return `${base} bg-black/5 border border-black/20 text-black placeholder-black/50`;
  }
  return `${base} bg-white/5 border border-white/15 text-white placeholder-white/40`;
});

async function onSubmit() {
  error.value = '';
  message.value = '';
  const val = email.value;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  if (!isEmail) {
    error.value = 'Please enter a valid email.';
    track('early_access_invalid');
    return;
  }
  submitting.value = true;
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: val, source: 'hero' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const out = await res.json().catch(() => ({ ok: true }));
    success.value = true;
    message.value = out && out.message ? out.message : 'We’ll be in touch soon.';
    track('early_access_submit', { status: 'success' });
  } catch (e) {
    console.error('subscribe failed', e);
    error.value = 'Sorry, something went wrong. Please try again later.';
    track('early_access_submit', { status: 'error' });
  } finally {
    submitting.value = false;
  }
}
</script>
