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
<<<<<<< HEAD
  <div class="flex flex-col gap-1.5 w-full">
    <div
      id="headerTitle"
      class="flex justify-between md:items-start w-full border-b md:border-b-2 border-gray-100 pb-3 md:pb-2"
    >
      <span class="text-body-md md:text-h4 font-extrabold md:font-bold text-primary-700">{{
        title
      }}</span>
      <span
        class="text-body-xs md:text-body-md text-primary-700 font-semibold md:font-medium bg-gray-25 rounded-xl py-0.5 px-1.5"
      >
        Time: {{ toTimeMmss(time) }}
      </span>
    </div>
    <div class="flex items-center justify-between w-full">
      <span class="text-body-xs md:text-body-md text-primary-700 font-semibold md:font-medium">{{
        description
      }}</span>
    </div>
    <div class="flex w-full">
      <span class="text-body-xs md:text-body-md text-primary-700 font-semibold md:font-medium">{{
        question
      }}</span>
=======
  <div class="flex flex-col gap-[6px] w-full">
    <div class="flex items-start w-full border-b-2 border-gray-100 gap-[8px] pb-[8px]">
      <span class="text-h4 font-bold text-primary-700">{{ title }}</span>
    </div>
    <div class="flex items-center justify-between w-full">
      <span class="text-md text-primary-700 font-medium">{{ description }}</span>

      <span class="text-md text-primary-700 font-medium"> Time: {{ toTimeMmss(time) }} </span>
    </div>
    <div class="flex w-full">
      <span class="text-md text-primary-700 font-medium">{{ question }}</span>
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    </div>
  </div>
</template>
