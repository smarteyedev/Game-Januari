<script setup lang="ts">
import type { DragCard } from '@/domain/types'
import Card from '@/components/molecules/Card.vue'
import { computed } from 'vue'

const props = defineProps<{
  card: DragCard
  checked: boolean | null | undefined
  isInZone: boolean
}>()

const customClass = computed(() => {
  const classes = []

  if (props.isInZone) {
    classes.push('px-3 py-1 border rounded text-center text-body-sm font-medium')

    // Background based on checked state
    if (props.checked === true) {
      classes.push('bg-green-500 text-white')
    } else if (props.checked === false) {
      classes.push('bg-red-500 text-white')
    } else {
      classes.push('bg-gray-50')
    }
  } else {
    // When in source pool
    classes.push(
      'bg-gray-50 px-3 py-1 border rounded text-center text-body-sm font-medium  min-w-[96px] md:min-w-[128px]',
    )
  }

  return classes.join(' ')
})
</script>

<template>
  <Card :label="card.label" :custom-class="customClass" :draggable="true" />
</template>
