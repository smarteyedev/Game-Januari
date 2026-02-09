<script setup lang="ts">
import { toTimeMmss } from '@/utils/formatter'
import { UiLabel } from '../atoms/label'

withDefaults(
  defineProps<{
    description?: string
    time: number
  }>(),
  {
    description: 'Deskripsi',
  },
)
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <span class="text-md text-blue-700 font-medium">{{ description }}</span>

    <span class="text-md text-blue-700 font-medium"> Time: {{ toTimeMmss(time) }} </span>
  </div>
</template>
