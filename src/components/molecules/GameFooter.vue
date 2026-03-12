<script setup lang="ts">
import UiButton from '@/components/atoms/button/index.vue'
import { UiProgressBar } from '@/components/atoms/progressBar'
import { useGameViewContext } from '@/composables/useGameViewContext'

const props = defineProps<{
  current?: number
  target?: number
  showProgress?: boolean
  isChecked?: boolean
  isWin?: boolean
  hasLost?: boolean
  hideSubmit?: boolean
  delay?: boolean
}>()

const emit = defineEmits<{
  (e: 'check'): void
  (e: 'retry'): void
  (e: 'cleared'): void
  (e: 'open-result'): void
}>()

const { buttonSize } = useGameViewContext()

function handleContinue() {
  if (props.hasLost || props.isWin) {
    emit('open-result')
  } else {
    emit('check')
  }
}
</script>

<template>
  <div class="w-full flex flex-col md:flex-row justify-between items-center">
    <!-- LEFT -->
    <div class="w-full h-full md:flex flex-col sm:flex-row gap-2 md:gap-4">
      <slot name="footer-left">
        <div class="flex flex-col gap-1.5">
          <span class="text-body-xs font-bold text-primary-700">You got {{ current }} out of {{ target }} correct</span>
          <UiProgressBar variant="with-icon" :progress="current" :max="target" :current="current" :target="target"
            :ui="{ color: '#00A3B5' }"
            class="rounded-full max-w-45 min-h-4 text-primary-700 text-body-xs md:text-body-sm xl:text-body-lg font-semibold whitespace-nowrap" />
        </div>
      </slot>
    </div>

    <!-- RIGHT -->
    <div class="flex items-end gap-3 sm:gap-4 mt-2 md:mt-0">
      <slot name="footer-right">
        <!-- CONTINUE / VIEW RESULT - show when game is won or lost (finished) -->
        <UiButton :disabled="delay" :size="buttonSize" text="Continue" variant="primary" @click="handleContinue">
        </UiButton>
      </slot>
    </div>
  </div>
</template>
