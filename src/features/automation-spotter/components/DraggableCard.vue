<script setup lang="ts">
import type { DragCard } from '@/domain/types'
import { Card } from '@/components/atoms'
import { computed } from 'vue'

const props = defineProps<{
  card: DragCard
  checked: boolean | null | undefined
  isInZone: boolean
  dragData?: {
    item: any
    index: number
    zoneId: string
  }
  class?: any
}>()

const emit = defineEmits<{
  (e: 'drag-end'): void
}>()

const customClass = computed(() => {
  const classes = []
  if (props.class) classes.push(props.class)

  if (props.isInZone) {
    classes.push('px-3 py-1 border rounded text-center text-body-sm font-medium w-full')

    // Background based on checked state
    if (props.checked === true) {
      classes.push('bg-green-500')
    } else if (props.checked === false) {
      classes.push('bg-red-500')
    } else {
      classes.push('bg-gray-50')
    }
  } else {
    // When in source pool
    classes.push(
      'bg-gray-50 p-1.5 md:px-[12px] md:py-[10px] gap-2px border border-gray-200 rounded-[8px] text-center text-[10px] md:text-body-xs font-semibold  min-w-[96px] md:min-w-[128px]',
    )
  }

  return classes.join(' ')
})
</script>

<template>
  <Card
    :label="card.label"
    :custom-class="customClass"
    :draggable="true"
    :drag-data="dragData"
    @drag-end="emit('drag-end')"
  />
</template>
