<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    default: 0,
  },
  target: {
    type: Number,
    default: 0,
  },
})

const progress = computed(() => {
  if (props.target === 0) return 0
  return Math.min((props.current / props.target) * 100, 100)
})

const isComplete = computed(() => progress.value === 100)
</script>

<template>
  <div>
    <p class="text-sm text-gray-700">You got {{ current }} out of {{ target }} points</p>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Progress bar -->
      <div class="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden min-w-[100px] max-w-[200px]">
        <div
          class="h-full progress-bar-color transition-all duration-300"
          :style="{ width: progress + '%' }"
        ></div>
      </div>

      <!-- Star -->
      <svg
        viewBox="0 0 24 24"
        class="w-6 h-6 transition-all duration-300"
        :class="isComplete ? 'fill-yellow-400 scale-110' : 'fill-gray-400'"
      >
        <path d="M12 2l2.9 6.1 6.7.6-5 4.4 1.5 6.6L12 16.8 5.9 19.7l1.5-6.6-5-4.4 6.7-.6z" />
      </svg>

      <span class="text-sm text-gray-600 whitespace-nowrap"> {{ current }}/{{ target }} </span>
    </div>
  </div>
</template>
