<template>
  <div @pointerdown="pointerStart" @touchstart="touchStart($event)">
    <Card :label="item.word" :custom-class="customClass" :disabled="disabled" :draggable="!disabled"
      @dragstart="dragStart" />
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import Card from '@/components/molecules/Card.vue'
import { computed } from 'vue'

const props = defineProps<{
  item: Blank
  slotId?: number
  inSlot?: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent, item: Blank, slotId?: number): void
}>()

const customClass = computed(() => {
  const classes = []

  if (props.inSlot) {
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
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('dragstart', event, props.item, props.slotId)
}

function pointerStart(event: PointerEvent) {
  if (props.disabled) return
  emit('dragstart', event as unknown as DragEvent, props.item, props.slotId)
}

function touchStart(event: TouchEvent) {
  if (props.disabled) return
  const t = event.touches && event.touches[0]
  if (!t) return
  // Prevent default only when cancelable to avoid console warnings
  if (event.cancelable) event.preventDefault()
  // Emit an object with coordinates so the parent can start a touch drag
  const touchLike = { type: 'touch', clientX: t.clientX, clientY: t.clientY } as unknown as DragEvent
  emit('dragstart', touchLike, props.item, props.slotId)
}
</script>
