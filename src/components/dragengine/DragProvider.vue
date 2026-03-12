<script setup lang="ts">
import { dragState } from "@/composables/useDragEngine"
import { computed } from "vue"

const previewStyle = computed(() => {
  if (!dragState.dragging) return {}
  
  // Calculate offset as percentage of original item size
  // This keeps the grab point consistent even if preview is resized
  const percX = (dragState.offsetX / dragState.width) * 100
  const percY = (dragState.offsetY / dragState.height) * 100
  
  return {
    left: `${dragState.x}px`,
    top: `${dragState.y}px`,
    transform: `translate(-${percX}%, -${percY}%)`
  }
})
</script>

<template>

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