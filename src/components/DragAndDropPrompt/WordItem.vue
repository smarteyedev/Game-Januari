<!-- WordItem.vue -->
<template>
  <div
    class="min-w-[100px] text-center shadow-sm cursor-grab"
    :class="{
      'px-3 py-1 border rounded bg-white': !inSlot,
      'bg-transparent p-0 m-0 rounded-none font-medium cursor-grab border-0': inSlot,
    }"
    
    :draggable="!disabled"
    @dragstart="dragStart"
  >
    {{ item.word }}
  </div>
</template>

<script setup lang="ts">
import type { Blank } from '@/types/types'

const props = defineProps<{
  item: Blank
  slotId?: number        // optional (undefined when from pool)
  inSlot?: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (
    e: 'dragstart',
    event: DragEvent,
    item: Blank,
    slotId?: number
  ): void
}>()

function dragStart(event: DragEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('dragstart', event, props.item, props.slotId)
}
</script>
