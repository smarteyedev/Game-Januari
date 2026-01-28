<!-- DraggableCard.vue -->
<script setup lang="ts">
import type { DragCard } from '@/types/types'
import Card from '@/components/molecules/Card.vue'
import { computed } from 'vue'

const props = defineProps<{
  card: DragCard
  checked: boolean | null | undefined
  isInZone: boolean
}>()

// Normalize checked value
const normalizedChecked = computed(() => {
  if (props.checked === undefined) return null
  return props.checked
})
</script>

<template>
  <Card
:label="card.label"
:isInZone="isInZone"
:checked="normalizedChecked" />
</template>
