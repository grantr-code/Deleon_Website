<template>
  <BasePageLayout compact subpage>
    <SectionHeader
      label="Who We Are"
      title="Who We Are"
      description="Our journey began in Atlanta, and our expertise is rooted in our training at Georgia Tech. With guidance from respected Georgia Tech professors on our advisory board, our team brings technical precision and real-world experience to Deleon."
      padding-bottom="pb-10"
    />
    <TeamGrid :groups="groups" />
  </BasePageLayout>
</template>

<script setup>
import { computed } from 'vue';
import { teamData } from './content/teamData';
import BasePageLayout from './components/BasePageLayout.vue';
import SectionHeader from './components/SectionHeader.vue';
import TeamGrid from './components/TeamGrid.vue';

const groups = computed(() => teamData.groups || []);
</script>
