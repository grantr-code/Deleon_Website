<template>
  <form @submit.prevent="onSubmit" class="mx-auto max-w-full">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="cf-name" class="block text-sm text-white/80 mb-1">Full name</label>
        <input id="cf-name" v-model.trim="name" type="text" required :class="inputClass" placeholder="Jane Doe" />
      </div>
      <div>
        <label for="cf-email" class="block text-sm text-white/80 mb-1">Email</label>
        <input id="cf-email" v-model.trim="email" type="email" required :class="inputClass" placeholder="you@company.com" />
      </div>
      <div>
        <label for="cf-company" class="block text-sm text-white/80 mb-1">Company/Team</label>
        <input id="cf-company" v-model.trim="company" type="text" :class="inputClass" placeholder="Acme Inc." />
      </div>
      <div>
        <label for="cf-phone" class="block text-sm text-white/80 mb-1">Phone (optional)</label>
        <input id="cf-phone" v-model.trim="phone" type="tel" :class="inputClass" placeholder="+1 (555) 123‑4567" />
      </div>
      <div class="sm:col-span-2">
        <label for="cf-reason" class="block text-sm text-white/80 mb-1">Reason</label>
        <select id="cf-reason" v-model="reason" :class="selectClass">
          <option>Request a Demo</option>
          <option>Join the Pilot</option>
          <option>General Inquiry</option>
          <option>Press</option>
          <option>Partnership</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label for="cf-message" class="block text-sm text-white/80 mb-1">Message</label>
        <textarea id="cf-message" v-model.trim="message" rows="4" required :class="textareaClass" placeholder="A few details about your needs…" />
      </div>
      <div class="sm:col-span-2 flex items-center gap-2 mt-1">
        <input id="cf-updates" v-model="updates" type="checkbox" class="h-4 w-4 rounded border-white/20 bg-white/5" />
        <label for="cf-updates" class="text-sm text-white/80">Also send me product updates</label>
      </div>
      <div class="sm:col-span-2 mt-2 flex items-center gap-3">
        <button type="submit" :disabled="submitting || success" class="rounded-full bg-brand-green text-black font-semibold px-5 py-3 whitespace-nowrap hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed">
          <span v-if="!success && !submitting">Send message</span>
          <span v-else-if="submitting">Sending…</span>
          <span v-else>Sent! ✅</span>
        </button>
        <p v-if="error" class="text-sm text-red-300">{{ error }}</p>
        <p v-if="success && messageBack" class="text-sm text-emerald-300">{{ messageBack }}</p>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useEarlyAccessPanel } from '../composables/useEarlyAccessPanel';

const name = ref('');
const email = ref('');
const company = ref('');
const phone = ref('');
const reason = ref('Request a Demo');
const message = ref('');
const updates = ref(true);
const submitting = ref(false);
const success = ref(false);
const error = ref('');
const messageBack = ref('');

function track(event, props = {}) {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.plausible === 'function') { window.plausible(event, { props }); return; }
    if (typeof window.gtag === 'function') { window.gtag('event', event, props); return; }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
  } catch {}
}

const inputBase = 'w-full rounded-lg px-4 py-2.5 text-base bg-white/5 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green/60';
const inputClass = computed(() => inputBase);
const textareaClass = computed(() => inputBase + ' min-h-[120px]');
const selectClass = computed(() => inputBase + ' pr-8');

const { close: closeDrawer } = useEarlyAccessPanel();

async function onSubmit() {
  error.value = '';
  messageBack.value = '';
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  if (!name.value || !isEmail || !message.value) {
    error.value = 'Please fill name, a valid email, and your message.';
    track('contact_invalid');
    return;
  }
  submitting.value = true;
  try {
    const to = 'chad@deleon-omics.com,jose@deleon-omics.com';
    const subj = `Deleon inquiry — ${reason.value} — ${name.value}`;
    const currentPage = typeof window !== 'undefined' ? window.location.href : '';
    const lines = [
      'Sent from Deleon Home Page Contact Form',
      '',
      `Name: ${name.value}`,
      `Email: ${email.value}`,
      company.value ? `Company: ${company.value}` : '',
      phone.value ? `Phone: ${phone.value}` : '',
      reason.value ? `Reason: ${reason.value}` : '',
      `Updates: ${updates.value ? 'Yes' : 'No'}`,
      currentPage ? `Page: ${currentPage}` : '',
      '',
      'Message:',
      message.value,
    ].filter(Boolean).join('\n');
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(lines)}`;
    track('contact_mailto_launch');
    // Navigate to mailto: to open the email client
    if (typeof window !== 'undefined') {
      window.location.href = mailto;
      // Close drawer shortly after to return focus to page
      setTimeout(() => { try { closeDrawer(); } catch {} }, 300);
    }
    // Keep UI simple: mark as success
    success.value = true;
    messageBack.value = 'Your email draft should be open. If not, please email chad@deleon-omics.com and jose@deleon-omics.com directly.';
  } catch (e) {
    console.error('mailto launch failed', e);
    error.value = 'Could not open your email client. Please email chad@deleon-omics.com and jose@deleon-omics.com directly.';
  } finally {
    submitting.value = false;
  }
}
</script>
