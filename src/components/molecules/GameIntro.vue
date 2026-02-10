<script setup lang="ts">
import IconLabel from './IconLabel.vue'

const _ = defineProps<{
  title?: string
  description?: string
  key_points?: string[]
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-10 w-full text-center">
    <!-- TITLE + DESCRIPTION -->
    <div class="flex flex-col gap-4 max-w-149.25">
      <p class="text-h4 font-bold">
        {{ title }}
      </p>
      <p class="text-h5 leading-8">
        {{ description }}
      </p>
    </div>

    <!-- KEY POINTS -->
    <div class="flex flex-col gap-4 w-full text-left">
      <IconLabel v-for="(point, index) in key_points ?? []" :key="index" :label="point" :bullet="true" />
    </div>
  </div>
</template>
