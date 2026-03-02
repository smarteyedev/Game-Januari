<template>
<<<<<<< HEAD
  <div @pointerdown="pointerStart" @touchstart.prevent="touchStart" @mousedown="pointerStart">
    <Card :label="item.word" :custom-class="customClass" :disabled="disabled" />
  </div>
=======
  <Card
    :label="item.word"
    :custom-class="customClass"
    :disabled="disabled"
    :draggable="!disabled"
    @dragstart="dragStart"
  />
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import Card from '@/components/molecules/Card.vue'
import { computed } from 'vue'

<<<<<<< HEAD
const { item, slotId, inSlot, disabled } = defineProps<{
=======
const props = defineProps<{
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
  item: Blank
  slotId?: number
  inSlot?: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
<<<<<<< HEAD
  (
    e: 'dragstart',
    payload: { item: Blank; slotId?: number; clientX: number; clientY: number },
  ): void
}>()

const customClass = computed(() => {
  const classes: string[] = []

  if (inSlot) {
    classes.push('bg-transparent p-0 m-0 rounded-none border-0 min-w-0')
  } else {
    classes.push(
      'text-[10px] md:text-[12px] min-h-[24px] font-semibold bg-blue-100 px-2 md:px-[12px] md:py-[10px] border border-primary-500 rounded-[8px] text-center',
=======
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
      'text-[12px] font-semibold bg-blue-100 px-[12px] py-[10px] border border-primary-500 rounded-[8px] text-center',
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    )
  }

  return classes.join(' ')
})

<<<<<<< HEAD
function pointerStart(e: PointerEvent | MouseEvent) {
  if (disabled) return

  const ev = e as PointerEvent
  emit('dragstart', {
    item,
    slotId,
    clientX: ev.clientX,
    clientY: ev.clientY,
  })

  e.preventDefault()
}

function touchStart(e: TouchEvent) {
  if (disabled) return

  const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0])
  if (!t) return

  emit('dragstart', {
    item,
    slotId,
    clientX: t.clientX,
    clientY: t.clientY,
  })

  e.preventDefault()
=======
function dragStart(event: DragEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('dragstart', event, props.item, props.slotId)
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
}
</script>
