<script setup lang="ts">
import { computed } from 'vue'
import { UiProgressBar } from '../atoms/progressBar'
import { UiIcon } from '../atoms/icon'

const props = defineProps<{
  current: number
  target: number
}>()

const isComplete = computed(() => props.target > 0 && props.current >= props.target)
</script>

<template>
<<<<<<< HEAD
  <div class="flex flex-col gap-1.5">
=======
  <div class="flex flex-col gap-[6px]">
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    <p class="text-body-xs font-bold text-primary-700">
      You got {{ current }} out of {{ target }} points
    </p>

<<<<<<< HEAD
    <div class="flex items-center gap-2">
=======
    <div class="flex items-center gap-[8px]">
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
      <!-- Progress -->
      <div class="flex items-center">
        <UiProgressBar
          :progress="current"
          :max="target"
          :ui="{ color: '#00A3B5' }"
<<<<<<< HEAD
          class="rounded-full min-w-35 md:min-w-55 min-h-4"
=======
          class="rounded-full min-w-55 min-h-[16px]"
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
        />

        <!-- Star -->
        <UiIcon
          name="mdi:star"
          size="20"
          :class="[
            'shrink-0 transition-all duration-300',
            isComplete ? 'text-yellow-400 scale-110' : 'text-gray-300',
          ]"
        />

        <!-- Label -->
<<<<<<< HEAD
        <span class="text-body-xs md:text-body-lg text-primary-700 font-semibold whitespace-nowrap">
=======
        <span class="text-body-lg text-primary-700 font-semibold whitespace-nowrap">
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
          {{ current }} / {{ target }}
        </span>
      </div>
    </div>
  </div>
</template>
