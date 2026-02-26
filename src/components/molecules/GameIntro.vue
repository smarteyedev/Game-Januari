<script setup lang="ts">
import type { Keypoint } from '@/domain/types'
import IconLabel from './IconLabel.vue'

const _ = defineProps<{
  title?: string
  description?: string
  key_points?: Keypoint[]
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 md:gap-10 w-full text-center">
    <div class="flex flex-col gap-2 max-w-149.25">
      <p class="text-body-md md:text-h4 font-bold">{{ title }}</p>
      <p class="text-body-md md:text-h4 leading-8">{{ description }}</p>
    </div>

    <div class="flex flex-col gap-4 w-full text-left text-body-md md:text-h4">
      <IconLabel v-for="(point, index) in key_points ?? []" :key="index" :label="point.description"
        :iconName="point.icon_name" :bullet="!point.icon_name" iconPosition="start" icon-color="#00A3B5" />
    </div>
  </div>
</template>
