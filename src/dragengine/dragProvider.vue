<script setup lang="ts">
import { dragState } from './dragEngine'
</script>

<template>
  <slot />

  <Teleport to="body">
    <div
      v-if="dragState.dragging"
      class="drag-preview"
      :style="{
        transform: `translate(
          ${dragState.x - dragState.offsetX}px,
          ${dragState.y - dragState.offsetY}px
        )`,
      }"
    >
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
  will-change: transform;
}
</style>
