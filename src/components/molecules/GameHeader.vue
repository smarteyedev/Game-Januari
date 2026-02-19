<script setup lang="ts">
import { toTimeMmss } from '@/utils/string'

withDefaults(
  defineProps<{
    title: string
    description?: string
    question?: string
    time: number
  }>(),
  {
    title: 'judul',
    description: 'Deskripsi',
  },
)
</script>

<template>
  <div class="flex items-start w-full border-b">
    <span class="text-h4 font-bold text-primary-700">{{ title }}</span>
  </div>
  <div class="flex items-center justify-between w-full">
    <span class="text-md text-primary-700 font-medium">{{ description }}</span>

    <span class="text-md text-primary-700 font-medium"> Time: {{ toTimeMmss(time) }} </span>
  </div>
  <div class="flex w-full">
    <span class="text-md text-primary-700 font-medium">{{ question }}</span>
  </div>
</template>
