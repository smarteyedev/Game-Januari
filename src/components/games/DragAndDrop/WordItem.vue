<template>
  <div @pointerdown="isTouchDevice ? pointerStart : undefined">
    <Card :label="item.word" :custom-class="customClass" :disabled="disabled" :draggable="!disabled && !isTouchDevice"
      @dragstart="!isTouchDevice ? dragStart : undefined" />
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import Card from '@/components/molecules/Card.vue'
import { computed } from 'vue'

const { item, slotId, inSlot, disabled, isTouchDevice } = defineProps<{
  item: Blank
  slotId?: number
  inSlot?: boolean
  disabled: boolean
  isTouchDevice?: boolean
}>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent, item: Blank, slotId?: number): void
}>()

const customClass = computed(() => {
  const classes = []

  if (inSlot) {
    // Style when in a slot
    classes.push('bg-transparent p-0 m-0 rounded-none border-0 min-w-0')
  } else {
    // Style when in pool
    classes.push(
      'text-[10px] md:text-[12px] min-h-[24px] font-semibold bg-blue-100 px-2 md:px-[12px] md:py-[10px] border border-primary-500 rounded-[8px] text-center',
    )
  }

  return classes.join(' ')
})

function dragStart(event: DragEvent) {
  if (disabled) {
    event.preventDefault()
    return
  }
  emit('dragstart', event, item, slotId)
}

function pointerStart(event: PointerEvent) {
  if (disabled) return
  emit('dragstart', event as unknown as DragEvent, item, slotId)
}

function touchStart(event: TouchEvent) {
  if (disabled) return
  const t = event.touches && event.touches[0]
  if (!t) return
  // Prevent default only when cancelable to avoid console warnings
  if (event.cancelable) event.preventDefault()
  // Emit an object with coordinates so the parent can start a touch drag
  const touchLike = { type: 'touch', clientX: t.clientX, clientY: t.clientY } as unknown as DragEvent
  emit('dragstart', touchLike, item, slotId)
}
</script>
