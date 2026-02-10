<!-- BlankSlot.vue -->
<template>
  <div
    class="inline-flex min-w-25 min-h-6 px-3 rounded justify-center items-center align-middle blank"
    :class="{
      'bg-green-100 border border-green-300': isCorrect === true,
      'bg-red-100 border border-red-300': isCorrect === false,
      'bg-gray-100': isCorrect === null,
    }"
    @drop.prevent="handleDrop"
    @dragover.prevent
  >
    <WordItem
      v-if="item"
      :key="item?.id"
      :item="item"
      :slotId="slotId"
      :inSlot="true"
      :disabled="disabled"
      :noBackground="true"
      class="bg-transparent"
      @dragstart="(e, item, slotId) => onDragStart?.(e, item, slotId ?? 0, 'board')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/types/types'
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
