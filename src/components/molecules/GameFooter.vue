<script setup lang="ts">
import UiButton from '@/components/atoms/button/index.vue'
import ProgressWithIcon from './ProgressWithIcon.vue'
import { useBreakpoint } from '@/composables/useBreakpoint';
import { computed } from 'vue';

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

const { isXs, isSm, isMd } = useBreakpoint()

const buttonSize = computed(() => {
  if (isXs.value) return 'xs'
  if (isSm.value) return 'sm'
  if (isMd.value) return 'md'
  return 'xl'
})
</script>

<template>
  <div class="w-full flex flex-col sm:flex-row sm:justify-between items-start sm:items-end">
    <!-- LEFT -->
    <div class="flex gap-9">
      <slot name="footer-left">
        <div class="w-full sm:w-71.25">
          <ProgressWithIcon v-if="showProgress && current !== undefined && target !== undefined" :current="current"
            :target="target" />
        </div>
        <!-- SUBMIT -->
        <UiButton :size="buttonSize" v-if="!hideSubmit && !isChecked" variant="secondary" @click="emit('check')"
          text="Check">
        </UiButton>
      </slot>
    </div>

    <!-- RIGHT -->
    <div class="flex items-end gap-3 sm:gap-4">
      <slot name="footer-right">
        <!-- RETRY
      <UiButton v-if="hasLost" text="Retry" variant="danger" size="md" @click="emit('retry')">
      </UiButton>
       -->

        <!-- CONTINUE -->
        <UiButton :size="buttonSize" v-if="isWin || hasLost" text="Continue" variant="primary" @click="emit('cleared')">
        </UiButton>
      </slot>
    </div>
  </div>
</template>
