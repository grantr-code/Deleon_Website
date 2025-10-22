<template>
  <BasePageLayout compact subpage>
    <SectionHeader
      label="For Athletes"
      title="Pro, Olympic, and Collegiate Performance"
      description="Get personalized biochemical data on training load and understand trends in your urine metabolome related to recovery time and injury risk. Be the first among your friends to use cutting‑edge technology—originally developed for astronauts."
      padding-bottom="pb-6"
    />

      <VideoOverlay
        heading="Metabolomics for Elite Performance"
        :overlay-text="'Personalized biochemical data on training load with daily trends in your urine metabolome tied to recovery time and injury risk—powered by space‑grade tech.'"
        :video="video"
        :enable-switcher="false"
        :ignore-tester-mode="true"
      />

    <!-- Outcomes / value grid -->
    <section class="max-w-[1280px] mx-auto px-4 pt-10 pb-4">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 lg:col-span-4">
          <h2 class="text-foreground text-[clamp(22px,2.8vw,32px)] leading-tight">Make better decisions, daily</h2>
          <p class="mt-3 text-muted-foreground">
            Deleon translates biochemical signals into actions staff can take immediately—before training, during travel, and in the 48 hours post‑competition.
          </p>
        </div>
        <div class="col-span-12 lg:col-span-8">
          <div class="grid sm:grid-cols-2 gap-4">
            <FeatureCard
              title="Readiness & Load"
              description="Detect under‑recovery and metabolic strain to tune session intensity and volume by athlete."
            />
            <FeatureCard
              title="Fueling & Nutrition"
              description="Optimize carbohydrate periodization, protein timing, and micronutrients based on actual utilization."
            />
            <FeatureCard
              title="Hydration & Electrolytes"
              description="Guide fluid and sodium strategies to stabilize output, especially in heat and back‑to‑backs."
            />
            <FeatureCard
              title="Travel & Recovery"
              description="Adjust sleep, light, and nutrition protocols for time zones and compressed schedules."
            />
            <FeatureCard
              title="Injury Risk Signals"
              description="Spot early biochemical patterns tied to injury risk and energy imbalance."
            />
            <FeatureCard
              title="Return‑to‑Play"
              description="Validate readiness milestones biochemically alongside GPS and force‑plate data."
            />
          </div>
        </div>
      </div>
    </section>

    <!-- How it fits in the workflow -->
    <section class="max-w-[1280px] mx-auto px-4 pt-6 pb-12">
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-12 lg:col-span-4"></div>
        <div class="col-span-12 lg:col-span-8">
          <div class="rounded-[10px] border border-border p-5 md:p-6">
            <h2 class="text-foreground text-[clamp(20px,2.6vw,28px)]">Where it lands, every day</h2>
            <ul class="mt-3 space-y-2 text-muted-foreground">
              <li>• A 2‑minute test after weigh‑in or pre‑session</li>
              <li>• Instant recommendations for staff and athlete (mobile + dashboard)</li>
              <li>• Color‑coded flags for readiness, fueling, hydration, and recovery</li>
              <li>• Trends in recovery time and injury risk across microcycles</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </BasePageLayout>
</template>

<script setup>
import BasePageLayout from '../components/BasePageLayout.vue';
import SectionHeader from '../components/SectionHeader.vue';
import FeatureCard from '../components/FeatureCard.vue';
import VideoOverlay from '../components/VideoOverlay.vue';

const video = {
  srcMp4: '/BrandAssets/Video.mp4',
  srcMov: '/BrandAssets/Video.mov',
  poster: '/BrandAssets/Deleon_Logo_light.svg',
};
</script>
