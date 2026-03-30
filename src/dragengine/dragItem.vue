<script setup lang="ts" generic="T">
import { startDrag, moveDrag, endDrag } from './dragEngine'

const props = defineProps<{
  itemData: T
  index: number
  zoneId: string
}>()

const emit = defineEmits(['dragEnd'])

function pointerDown(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)

  startDrag(
    {
      item: props.itemData,
      sourceZone: props.zoneId,
      index: props.index,
    },
    e,
  )

  window.addEventListener('pointermove', pointerMove)
  window.addEventListener('pointerup', pointerUp)
}

function pointerMove(e: PointerEvent) {
  moveDrag(e)
}

function pointerUp(_: PointerEvent) {
  window.removeEventListener('pointermove', pointerMove)
  window.removeEventListener('pointerup', pointerUp)

  emit('dragEnd')

  endDrag()
}
</script>

<template>
  <div
class="drag-item"
@pointerdown="pointerDown">
    <slot :item="itemData" />
  </div>
</template>

<style scoped>
.drag-item {
  touch-action: none;
  cursor: grab;
}
</style>
