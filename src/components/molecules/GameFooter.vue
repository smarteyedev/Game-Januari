<script setup lang="ts">
import { UiButton } from '../atoms/button'
import ButtonText from '../atoms/ButtonText.vue';
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
  <div class="w-full flex flex-col sm:flex-row sm:justify-between items-start sm:items-end gap-3 sm:gap-0 min-h-10.5">
    <!-- LEFT -->
    <div class="flex gap-[36px]">
      <div class="w-full sm:w-71.25">
        <ProgressWithIcon v-if="showProgress && current !== undefined && target !== undefined" :current="current"
          :target="target" />
      </div>
      <!-- SUBMIT -->
      <ButtonText v-if="!hideSubmit && !isChecked" variant="secondary" size="md" @click="emit('check')" text="Check">

      </ButtonText>
    </div>

    <!-- RIGHT -->
    <div class="flex items-end gap-3 sm:gap-4">


      <!-- RETRY -->
      <ButtonText v-if="hasLost" text="Retry" variant="danger" size="md" @click="emit('retry')">

      </ButtonText>

      <!-- CONTINUE -->
      <ButtonText v-else-if="isWin" text="Continue" variant="primary" size="md" @click="emit('cleared')">

      </ButtonText>
    </div>
  </div>
</template>
