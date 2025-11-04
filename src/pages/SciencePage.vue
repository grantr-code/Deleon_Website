<template>
  <BasePageLayout compact subpage>
    <SectionHeader
      label="Science"
      title="One Drop. Boundless Insight."
      description="We're building field‑ready biochemistry guided by modern machine learning. Daily signals in, clear guidance out. The how is engineered; the experience is simple."
      padding-bottom="pb-8"
    >
      <template #after-description>
        <p class="mt-2 text-muted-foreground text-[clamp(14px,1.4vw,16px)]"><strong>Chad Pozarycki, PhD · José Andrade, MS</strong></p>
      </template>
    </SectionHeader>

    <!-- Scrollable infographic: CE separation + ML intake -->
    <section class="max-w-none px-0 pt-0 pb-8 md:pb-12">
      <ScienceInfographic />
    </section>

    <SectionHeader
      label=""
      title="Why now"
      description="Human performance is governed by chemistry. Reading it in the real world unlocks a step‑change for readiness and health. A simple daily sample. A universal app. Guidance you can trust."
      :show-border="false"
      padding-top="pt-8"
      padding-bottom="pb-12"
    />

    <SectionHeader
      label=""
      title="Why we're different"
      description="We make signals clear, then let models learn from trends. The result: specific, trustworthy guidance in the field."
      :show-border="false"
      padding-top="pt-8"
      padding-bottom="pb-12"
      v-if="false"
    />

    <SectionHeader
      label=""
      title="From signals to a foundation model"
      description="A learning system that understands human recovery and readiness—improving with every sample."
      :show-border="false"
      padding-top="pt-8"
      padding-bottom="pb-12"
    />
  </BasePageLayout>
</template>

<script setup>
import BasePageLayout from '../components/BasePageLayout.vue';
import SectionHeader from '../components/SectionHeader.vue';
import ScienceInfographic from '../components/ScienceInfographic.vue';
</script>
