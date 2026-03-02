<template>
  <div @pointerdown="pointerStart" @touchstart.prevent="touchStart" @mousedown="pointerStart">
    <Card :label="item.word" :custom-class="customClass" :disabled="disabled" />
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import Card from '@/components/molecules/Card.vue'
import { computed } from 'vue'

const { item, slotId, inSlot, disabled } = defineProps<{
  item: Blank
  slotId?: number
  inSlot?: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'dragstart', payload: { item: Blank; slotId?: number; clientX: number; clientY: number }): void
}>()

const customClass = computed(() => {
  const classes: string[] = []

  if (inSlot) {
    classes.push('bg-transparent p-0 m-0 rounded-none border-0 min-w-0')
  } else {
    classes.push(
      'text-[10px] md:text-[12px] min-h-[24px] font-semibold bg-blue-100 px-2 md:px-[12px] md:py-[10px] border border-primary-500 rounded-[8px] text-center',
    )
  }

  return classes.join(' ')
})

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
}
</script>
