<script setup lang="ts">
import { computed } from 'vue'
import type { LevelButtonState } from '@/domain/types'
import { UiButton } from '../atoms/button'

const { state } = defineProps<{
  state: LevelButtonState
}>()

const emit = defineEmits<{
  (e: 'open'): void
}>()

function handleClick() {
  if (state === 'unlocked') {
    emit('open')
  }
}

const isDisabled = computed(() => state !== 'unlocked')
</script>

<template>
  <UiButton
    class="cursor-pointer"
    variant="ghost"
    square
    :disabled="isDisabled"
    @click="handleClick"
  >
    <template #prepend>
      <slot :state="state" />
    </template>
  </UiButton>
</template>
