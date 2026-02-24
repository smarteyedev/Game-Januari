<!-- BlankSlot.vue -->
<template>
  <div
    class="inline-flex min-w-25 min-h-6 py-[6px] mb-[4px] px-2.5 border justify-center items-center align-middle rounded-lg"
    :class="{
      'bg-green-100 border-green-300': isCorrect === true,
      'bg-red-100 border-red-300': isCorrect === false,
      'bg-gray-100 border-gray-200': isCorrect === null,
    }" @drop.prevent="handleDrop" @dragover.prevent>
    <WordItem v-if="item" :key="item?.id" :item="item" :slotId="slotId" :inSlot="true" :disabled="disabled"
      :noBackground="true" class="bg-transparent"
      @dragstart="(e, item, slotId) => onDragStart?.(e, item, slotId ?? 0, 'board')" />
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import WordItem from './WordItem.vue'

const props = defineProps<{
  item?: Blank | null
  slotId: number
  onDragStart?: (e: DragEvent, item: Blank, slotId: number, type: 'board' | 'pool') => void
  isCorrect: boolean | null | undefined
  disabled: boolean
}>()

const emit = defineEmits(['drop'])

function handleDrop(event: DragEvent) {
  emit('drop', event, props.slotId)
}
</script>
