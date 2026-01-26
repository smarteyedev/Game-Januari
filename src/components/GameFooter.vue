<script setup lang="ts">
import IconButton from './IconButton.vue'
import ProgressBar from './ProgressBar.vue'

const props = defineProps<{
  current?: number
  target?: number
  showProgress?: boolean
  isChecked?: boolean
  isWin?: boolean
  hasLost?: boolean
}>()

const emit = defineEmits<{
  (e: 'check'): void
  (e: 'retry'): void
  (e: 'cleared'): void
}>()

</script>

<template>
  <div class="flex gap-4 justify-between w-full">
    <!-- LEFT SLOT -->
    <div class="flex gap-4 items-center items-end w-full">
      <slot name="left">
        <!-- Default content -->
        <ProgressBar
          v-if="showProgress && current !== undefined && target !== undefined"
          :current="current"
          :target="target"
          class="basis-1/4"
        />

        <IconButton
          @click="emit('check')"
          class="btn-primary hover:bg-teal-600 text-white rounded-lg inline-flex items-center justify-center gap-2 min-w-[128px] min-h-[30px]"
        >
          <template #icon>
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path
                d="M3 8.5l3 3L13 4.5"
                fill="none"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>
          Submit
        </IconButton>
      </slot>
    </div>

    <!-- RIGHT ACTION -->
    <div class="flex gap-4 items-end">
        <IconButton
        v-if="hasLost"
        @click="emit('retry')"
        class="btn-primary hover:bg-teal-600 text-white rounded-lg inline-flex items-center justify-center min-w-[128px] min-h-[30px]"
      >
        Retry
      </IconButton>

      <IconButton
      v-else-if="isChecked && isWin"
        @click="emit('cleared')"
        class="btn-primary hover:bg-teal-600 text-white rounded-lg inline-flex items-center justify-center min-w-[128px] min-h-[30px]"
      >
        Continue
      </IconButton>
    </div>
  </div>
</template>
