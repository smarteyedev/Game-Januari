<script setup lang="ts">
import { DropZone as EngineDropZone } from '@/components/dragengine'
import { computed } from 'vue'
import DraggableCard from './DraggableCard.vue'
import type { DragCard } from '@/domain/types'

const props = defineProps<{
  id: string
  text: string
  className?: string
  modelValue: DragCard[]
  checkedMap: Record<number, boolean>
  isChecked: boolean
  disabled: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: DragCard[]): void
  (e: 'moved', ids: number[]): void
  (e: 'move', payload: any): void
}>()

// Extract text color classes from className prop
const textColorClass = computed(() => {
  if (!props.className) return ''
  const colorMatch = props.className.match(
    /text-\[#[0-9A-Fa-f]+\]|text-(?:primary|error|warning|success|info|secondary|gray)-?\d*/,
  )
  return colorMatch ? colorMatch[0] : ''
})
</script>

<template>
  <div
    :class="[
      'relative w-full px-2.5 py-4 rounded-lg md:rounded-2xl min-w-32 min-h-14 md:min-h-37.5',
      className,
    ]"
  >
    <p
      :class="[
        'font-semibold text-body-sm md:text-body-md xl:text-body-xl absolute inset-0 flex items-center justify-center pointer-events-none px-1 text-center',
        textColorClass,
      ]"
    >
      {{ text }}
    </p>

    <EngineDropZone
      :zone-id="id"
      :items="modelValue"
      :max-drag-item="99"
      @move="$emit('move', $event)"
      class="relative gap-2 flex flex-col h-full w-full rounded-xl transition-all duration-200"
    >
      <DraggableCard
        v-for="(card, index) in modelValue"
        :key="`${card.id}-${isChecked}`"
        :card="card"
        :is-in-zone="true"
        :drag-data="{ item: card, index: index, zoneId: id }"
        :checked="isChecked && checkedMap[card.id] !== undefined ? checkedMap[card.id] : null"
        :class="{
          'cursor-grab active:cursor-grabbing': !disabled,
          'cursor-default': disabled,
        }"
      />
    </EngineDropZone>
  </div>
</template>
