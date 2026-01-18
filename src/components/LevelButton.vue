<script setup lang="ts">
import { computed } from 'vue'
import IconButton from './IconButton.vue'
import type { LevelButtonState } from '@/types/types'

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
  <IconButton class="cursor-pointer" :disabled="isDisabled" @click="handleClick">
    <template #icon>
      <slot :state="state" />
    </template>
  </IconButton>
</template>
