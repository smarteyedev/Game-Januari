<script setup lang="ts">
import UiButton from '@/components/atoms/button/index.vue'
import ProgressWithIcon from './ProgressWithIcon.vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { computed } from 'vue'

const props = defineProps<{
  current?: number
  target?: number
  showProgress?: boolean
  isChecked?: boolean
  isWin?: boolean
  hasLost?: boolean
  hideSubmit?: boolean
  showResult?: boolean
}>()

const emit = defineEmits<{
  (e: 'check'): void
  (e: 'retry'): void
  (e: 'cleared'): void
  (e: 'open-result'): void
}>()

const { isXs, isSm, isMd } = useBreakpoint()

const buttonSize = computed(() => {
  if (isXs.value) return 'xs'
  if (isSm.value) return 'sm'
  if (isMd.value) return 'md'
  return 'lg'
})

function handleContinue() {
  if (props.hasLost) {
    emit('open-result')
  } else {
    emit('check')
  }
}
</script>

<template>
  <div class="w-full flex flex-col md:flex-row justify-between items-center">
    <!-- LEFT -->
    <div class="w-full md:flex flex-col sm:flex-row gap-2 md:gap-4 self-start">
      <slot name="footer-left">
        <div>
          <ProgressWithIcon
            v-if="showProgress && current !== undefined && target !== undefined"
            :current="current"
            :target="target"
          />
        </div>
      </slot>
    </div>

    <!-- RIGHT -->
    <div class="flex items-end gap-3 sm:gap-4 mt-2 md:mt-0">
      <slot name="footer-right">
        <!-- CONTINUE / VIEW RESULT - show when game is won or lost (finished) -->
        <UiButton
          v-if="isWin"
          :size="buttonSize"
          text="Continue"
          variant="primary"
          @click="emit('open-result')"
        >
        </UiButton>
        <UiButton :size="buttonSize" text="Continue" variant="primary" @click="handleContinue">
        </UiButton>
      </slot>
    </div>
  </div>
</template>
