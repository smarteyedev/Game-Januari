<!-- BlankSlot.vue -->
<template>
  <div
    class="inline-flex min-w-25 min-h-6 py-1.5 mb-1 px-2 md:px-2.5 border justify-center items-center align-middle rounded-xl"
    :data-dd-slot="slotId" :class="{
      'bg-green-100 border-green-300': isCorrect === true,
      'bg-red-100 border-red-300': isCorrect === false,
      'bg-gray-25 border-gray-500': isCorrect === null,
    }" @drop.prevent="!isTouchDevice ? handleDrop : undefined" @dragover.prevent="!isTouchDevice"
    @pointerup="handleDropPointer" @touchend="handleDropTouch($event)">
    <WordItem v-if="item" :key="item?.id" :item="item" :slotId="slotId" :inSlot="true" :disabled="disabled"
      :isTouchDevice="isTouchDevice" :noBackground="true" class="bg-transparent"
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
  isTouchDevice?: boolean
}>()

const emit = defineEmits(['drop'])

function handleDrop(event: DragEvent) {
  emit('drop', event, props.slotId)
}

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
</script>
