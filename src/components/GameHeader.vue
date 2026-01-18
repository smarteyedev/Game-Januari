<script setup lang="ts">
import { toTimeMmss } from '@/utils/formatter'
import IconButton from './IconButton.vue'

const props = withDefaults(
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
  <div class="flex items-center justify-between h-12 w-full">
    <span class="text-base font-semibold">
      {{ description }}
    </span>

    <span class="text-base font-semibold"> Time: {{ toTimeMmss(time) }} </span>
  </div>
</template>
