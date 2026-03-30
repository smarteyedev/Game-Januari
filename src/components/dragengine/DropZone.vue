<script setup lang="ts" generic="T">
import { onMounted, onUnmounted, ref, watch, computed } from 'vue'
import { dragState, registerZone, unregisterZone } from '@/composables/useDragEngine'

const props = defineProps<{
  zoneId: string
  items: T[]
  maxDragItem: number
  activeClass?: string
}>()

const emit = defineEmits(['move'])

const zoneRef = ref<HTMLElement>()

const isOver = computed(() => dragState.activeZone === props.zoneId)

onMounted(() => {
  registerZone(props.zoneId, zoneRef.value!)
})

onUnmounted(() => {
  unregisterZone(props.zoneId)
})

watch(
  () => dragState.dragging,
  (v) => {
    if (!v && dragState.payload) {
      if (dragState.activeZone === props.zoneId) {
        emit('move', {
          from: dragState.payload.sourceZone,
          to: props.zoneId,
          index: dragState.payload.index,
        })
      }
    }
  },
)
</script>

<template>
  <div
ref="zoneRef"
class="dropzone-container"
:class="[isOver ? activeClass : '']">
    <slot :isOver="isOver" />
  </div>
</template>
