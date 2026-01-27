<script setup lang="ts">
import { toTimeMmss } from '@/utils/formatter'
import UiAtomsLabel from '@/components/atoms/label/index.vue'
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
  <div class="flex items-center justify-between h-12 w-full">
    <UiLabel
:label="description"
name="header-label" />

    <span class="text-base font-semibold"> Time: {{ toTimeMmss(time) }} </span>
  </div>
</template>
