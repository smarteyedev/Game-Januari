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
  <div class="flex flex-col gap-1.5 w-full">
    <div class="flex items-start w-full border-b md:border-b-2 border-gray-100 pb-3 md:pb-2">
      <span class="text-body-md md:text-h4 font-extrabold md:font-bold  text-primary-700">{{ title }}</span>
    </div>
    <div class="flex items-center justify-between w-full">
      <span class="text-body-xs md:text-body-md text-primary-700 font-semibold md:font-medium">{{ description }}</span>

      <span
        class="text-body-xs md:text-body-md text-primary-700 font-semibold md:font-medium bg-gray-25 rounded-xl py-0.5 px-1.5">
        Time: {{
          toTimeMmss(time)
        }} </span>
    </div>
    <div class="flex w-full">
      <span class="text-body-xs md:text-body-md text-primary-700 font-semibold md:font-medium">{{ question }}</span>
    </div>
  </div>
</template>
