<!-- BlankSlot.vue -->
<template>
  <div
    class="inline-flex min-w-[100px] min-h-[24px] px-3 border rounded justify-center items-center align-middle blank"
    :class="{
      'bg-green-100 border-green-300': isCorrect === true,
      'bg-red-100 border-red-300': isCorrect === false,
      'bg-white': isCorrect === null
    }"
    @drop.prevent="handleDrop"
    @dragover.prevent
  >
    <WordItem
      v-if="item"
      :item="item"
      :slotId="slotId"
      :inSlot="true"
      @dragstart="(e, item, slotId) => onDragStart?.(e, item, slotId ?? 0, 'board')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/types/types';
import WordItem from './WordItem.vue'

const props = defineProps<{
  item?: Blank | null
  slotId: number
  onDragStart?: (e: DragEvent, item: Blank, slotId: number, type: 'board' | 'pool') => void
  isCorrect: boolean | null | undefined
}>()

const emit = defineEmits(['drop'])

function handleDrop(event: DragEvent) {
  emit('drop', event, props.slotId)
}
</script>