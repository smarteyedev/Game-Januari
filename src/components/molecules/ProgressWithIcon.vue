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
  <div class="flex flex-col gap-2">
    <p class="text-[12px] font-bold leading-4 text-blue-700">
      You got {{ current }} out of {{ target }} points
    </p>

    <div class="flex items-center gap-3">
      <!-- Progress -->
      <div class="flex-1 max-w-55 h-2.5">
        <UiProgressBar :progress="current" :max="target" :ui="{ color: '#00A3B5' }" />
      </div>

      <!-- Star -->
      <UiIcon
        name="mdi:star"
        size="16"
        :class="[
          'shrink-0 transition-all duration-300',
          isComplete ? 'text-yellow-400 scale-110' : 'text-gray-300',
        ]"
      />

      <!-- Label -->
      <span class="text-body-sm text-blue-700 font-semibold whitespace-nowrap">
        {{ current }} / {{ target }}
      </span>
    </div>
  </div>
</template>
