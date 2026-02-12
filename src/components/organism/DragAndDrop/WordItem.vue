<template>
  <Card
    :label="item.word"
    :custom-class="customClass"
    :disabled="disabled"
    :draggable="!disabled"
    @dragstart="dragStart"
  />
</template>

<script setup lang="ts">
import type { Blank } from '@/types/types'
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
    classes.push('bg-transparent p-0 m-0 rounded-none font-medium border-0 min-w-0')
  } else {
    // Style when in pool
    classes.push(
      'font-medium bg-blue-100 px-3 py-1 border border-primary-500 rounded min-w-[96px] md:min-w-[128px] text-center',
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
</script>
