<script setup lang="ts">
import { DropZone } from '@/components/dragengine'
import DraggableCard from './DraggableCard.vue'
import type { DragCard } from '@/domain/types'
import { useGameViewContext } from '@/composables/useGameViewContext'

const props = defineProps<{
  modelValue: DragCard[]
  checkedMap: Record<number, boolean>
  isChecked: boolean
  disabled: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', v: DragCard[]): void
  (e: 'moved', ids: number[]): void
  (e: 'move', payload: any): void
}>()

function getChecked(id: number): boolean | null {
  if (!props.isChecked) return null
  return props.checkedMap[id] !== undefined ? props.checkedMap[id] : null
}

const { playClick } = useGameViewContext()
</script>

<template>
  <DropZone zone-id="pool" :items="modelValue" :max-drag-item="99" @move="$emit('move', $event)"
    class="grid grid-cols-2 md:flex md:flex-wrap justify-center items-center gap-2.5 md:gap-4 2xl:gap-8 w-full [&>*:last-child:nth-child(odd)]:col-span-2">
    <DraggableCard v-for="(c, index) in modelValue" :key="c.id" :card="c" :is-in-zone="false"
      :checked="getChecked(c.id)" :drag-data="{ item: c, index: index, zoneId: 'pool' }" @drag-end="playClick" :class="{
        'cursor-grab active:cursor-grabbing': !disabled,
        'cursor-default': disabled,
      }" />
  </DropZone>
</template>
