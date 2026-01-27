<!-- WordItem.vue -->
<template>
  <Card
    :label="item.word"
    :inSlot="inSlot"
    :disabled="disabled"
    :draggable="!disabled"
    @dragstart="dragStart"
    :noBackground="true"
    class="bg-transparent"
  />
</template>

<script setup lang="ts">
import type { Blank } from '@/types/types'
import Card from '@/components/molecules/Card.vue'

const props = defineProps<{
  item: Blank
  slotId?: number // optional (undefined when from pool)
  inSlot?: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent, item: Blank, slotId?: number): void
}>()

function dragStart(event: DragEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  emit('dragstart', event, props.item, props.slotId)
}
</script>
