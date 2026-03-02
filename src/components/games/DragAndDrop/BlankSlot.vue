<!-- BlankSlot.vue -->
<template>
  <div
<<<<<<< HEAD
    class="inline-flex min-w-25 min-h-6 py-1.5 mb-1 px-2 md:px-2.5 border justify-center items-center align-middle rounded-xl"
    :data-dd-slot="slotId"
    :class="{
      'bg-green-100 border-green-300': isCorrect === true,
      'bg-red-100 border-red-300': isCorrect === false,
      'bg-gray-25 border-gray-500': isCorrect === null,
    }"
    @pointerup="handleDropPointer"
    @touchend="handleDropTouch($event)"
=======
    class="inline-flex min-w-25 min-h-6 py-[6px] mb-[4px] px-2.5 border justify-center items-center align-middle rounded-lg"
    :class="{
      'bg-green-100 border-green-300': isCorrect === true,
      'bg-red-100 border-red-300': isCorrect === false,
      'bg-gray-100 border-gray-200': isCorrect === null,
    }"
    @drop.prevent="handleDrop"
    @dragover.prevent
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
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
<<<<<<< HEAD
      @dragstart="(payload) => onDragStart?.(payload)"
=======
      @dragstart="(e, item, slotId) => onDragStart?.(e, item, slotId ?? 0, 'board')"
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    />
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import WordItem from './WordItem.vue'

const props = defineProps<{
  item?: Blank | null
  slotId: number
<<<<<<< HEAD
  onDragStart?: (payload: {
    item: Blank
    slotId?: number
    clientX: number
    clientY: number
  }) => void
  isCorrect: boolean | null | undefined
  disabled: boolean
  isTouchDevice: boolean
=======
  onDragStart?: (e: DragEvent, item: Blank, slotId: number, type: 'board' | 'pool') => void
  isCorrect: boolean | null | undefined
  disabled: boolean
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
}>()

const emit = defineEmits(['drop'])

function handleDrop(event: DragEvent) {
  emit('drop', event, props.slotId)
}
<<<<<<< HEAD

function handleDragOver(event: DragEvent) {
  if (props.isTouchDevice) return
  // preventDefault is already applied by the directive; no further action needed
}

function handleDropPointer(event: PointerEvent) {
  emit('drop', event as unknown as DragEvent, props.slotId)
}

function handleDropTouch(event: TouchEvent) {
  if (event.cancelable) event.preventDefault()
  emit('drop', null as unknown as DragEvent, props.slotId)
}
=======
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
</script>
