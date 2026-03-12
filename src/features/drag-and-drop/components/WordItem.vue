<template>
  <Card
    :label="item.word"
    :custom-class="customClass"
    :disabled="disabled"
    :draggable="!!dragData"
    :drag-data="dragData"
    @drag-end="emit('drag-end')"
  />
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import { Card } from '@/components/atoms'
import { computed } from 'vue'

const { item, inSlot, disabled, dragData } = defineProps<{
  item: Blank
  inSlot?: boolean
  disabled: boolean
  dragData?: {
    item: any
    index: number
    zoneId: string
  }
}>()

const emit = defineEmits<{
  (e: 'drag-end'): void
}>()

const customClass = computed(() => {
  const classes: string[] = []

  if (!disabled) {
    classes.push('cursor-grab')
  }

  if (inSlot) {
    classes.push('bg-transparent p-0 m-0 rounded-none border-0 min-w-0')
  } else {
    classes.push(
      'text-[10px] md:text-[12px] min-h-[24px] font-semibold bg-blue-100 px-2 md:px-[12px] md:py-[10px] border border-primary-500 rounded-[8px] text-center',
    )
  }

  return classes.join(' ')
})
</script>
