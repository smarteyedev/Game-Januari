<script setup lang="ts">
import IconLabel from './IconLabel.vue'

const props = defineProps<{
  title?: string
  description?: string
  key_points?: string[]
}>()
</script>

<template>
  <div class="flex flex-col gap-10 w-full text-center">
    <div class="flex flex-col gap-4">
      <p class="text-lg font-bold">{{ title }}</p>
      <p class="text-base">
        {{ description }}
      </p>
    </div>
    <div class="flex flex-col gap-1.5 text-left">
      <IconLabel
        v-for="(point, index) in key_points"
        :key="index"
        :label="point"
        :bullet="true"
      ></IconLabel>
    </div>
  </div>
</template>
