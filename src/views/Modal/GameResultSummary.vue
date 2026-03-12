<template>
  <div class="flex flex-col text-primary-700 gap-4 w-full">
    <div class="flex flex-col gap-5">
      <div
v-if="resultSummary?.feedback"
class="mb-1.5">
        <div class="flex justify-between m-0 gap-0 border-b border-gray-100 pb-2">
          <span class="text-body-md md:text-body-lg font-extrabold text-primary-700"> Score akhir </span>

          <UiButton
:square="true"
variant="ghost"
icon="carbon-close-outline"
:iconSize="20"
            @click="$emit('toggle-summary')" />
        </div>
        <p class="text-body-xs md:text-body-lg">
          "{{ resultSummary.feedback }}"
        </p>
      </div>


      <div
v-if="resultSummary?.speedFeedback"
class="flex flex-col gap-1 mb-1.5">
        <p class="text-body-md md:text-body-lg font-extrabold text-primary-700">
          Kecepatan
        </p>
        <p class="text-body-xs md:text-body-lg">
          "{{ resultSummary.speedFeedback }}"
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SuccessResultData } from '@/domain/types'
import { UiButton } from '@/components/atoms/button'

defineProps<{
  resultSummary?: SuccessResultData
}>()

defineEmits<{
  (e: 'toggle-summary'): void
}>()
</script>
