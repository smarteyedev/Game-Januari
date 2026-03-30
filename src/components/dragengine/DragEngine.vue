<script setup lang="ts" generic="T">
import { startDrag, moveDrag, endDrag, dragState } from '@/composables/useDragEngine'
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  // Item props - if provided, acts as a draggable item
  itemData?: T
  index?: number
  zoneId?: string
}>()

const emit = defineEmits(['dragEnd'])

// Determine if this instance acts as an item (interactive) or a provider (wrapper/preview)
const isItem = computed(() => props.itemData !== undefined && props.index !== undefined && props.zoneId !== undefined)

// --- Drag Item Logic ---
const isDragging = computed(
  () =>
    isItem.value &&
    dragState.dragging &&
    dragState.payload?.sourceZone === props.zoneId &&
    dragState.payload?.index === props.index,
)

function pointerDown(e: PointerEvent) {
  if (!isItem.value) return
  
  e.stopPropagation()
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)

  startDrag(
    {
      item: props.itemData!,
      sourceZone: props.zoneId!,
      index: props.index!,
    },
    e,
  )

  window.addEventListener('pointermove', pointerMove)
  window.addEventListener('pointerup', pointerUp)
}

function pointerMove(e: PointerEvent) {
  moveDrag(e)
}

async function pointerUp(e: PointerEvent) {
  window.removeEventListener('pointermove', pointerMove)
  window.removeEventListener('pointerup', pointerUp)

  moveDrag(e)
  emit('dragEnd')
  await endDrag()
}

// --- Drag Provider Logic ---
const previewStyle = computed(() => {
  if (!dragState.dragging || isItem.value) return {}

  // Calculate offset as percentage of original item size
  // This keeps the grab point consistent even if preview is resized
  const percX = (dragState.offsetX / dragState.width) * 100
  const percY = (dragState.offsetY / dragState.height) * 100

  return {
    left: `${dragState.x}px`,
    top: `${dragState.y}px`,
    transform: `translate(-${percX}%, -${percY}%)`,
  }
})
</script>

<template>
  <!-- Render as Item -->
  <div
    v-if="isItem"
    v-bind="$attrs"
    class="drag-item-container"
    style="touch-action: none"
    @pointerdown="pointerDown"
  >
    <slot 
    :item="itemData!" 
    :isDragging="isDragging" />
  </div>

  <!-- Render as Provider/Wrapper -->
  <template v-else>
    <slot />

    <Teleport to="body">
      <div 
      v-if="dragState.dragging" 
      class="drag-preview" 
      :style="previewStyle">
        <slot 
        name="preview" 
        :item="dragState.payload?.item" />
      </div>
    </Teleport>
  </template>
</template>

<style scoped>
.drag-preview {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  will-change: transform, top, left;
}
</style>
