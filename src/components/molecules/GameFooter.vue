<script setup lang="ts">
import { UiButton } from '../atoms/button'
import ProgressWithIcon from './ProgressWithIcon.vue'

defineProps<{
  current?: number
  target?: number
  showProgress?: boolean
  isChecked?: boolean
  isWin?: boolean
  hasLost?: boolean
  hideSubmit?: boolean
}>()

const emit = defineEmits<{
  (e: 'check'): void
  (e: 'retry'): void
  (e: 'cleared'): void
}>()
</script>

<template>
  <div
    class="w-full flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-3 sm:gap-0 min-h-10.5"
  >
    <!-- LEFT -->
    <div class="w-full sm:w-71.25">
      <ProgressWithIcon
        v-if="showProgress && current !== undefined && target !== undefined"
        :current="current"
        :target="target"
      />
    </div>

    <!-- RIGHT -->
    <div class="flex items-end gap-3 sm:gap-4">
      <!-- SUBMIT -->
      <UiButton
        v-if="!hideSubmit && !isChecked"
        class="h-7.5 min-w-32 rounded-sm"
        @click="emit('check')"
      >
        Submit
      </UiButton>

      <!-- RETRY -->
      <UiButton
v-else-if="hasLost"
class="h-7.5 min-w-32 rounded-sm"
@click="emit('retry')">
        Retry
      </UiButton>

      <!-- CONTINUE -->
      <UiButton
v-else-if="isWin"
class="h-7.5 min-w-32 rounded-sm"
@click="emit('cleared')">
        Continue
      </UiButton>
    </div>
  </div>
</template>
