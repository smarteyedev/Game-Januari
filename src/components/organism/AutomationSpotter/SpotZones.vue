<script setup lang="ts">
import DropZone from './DropZone.vue'
import type { DragCard } from '@/types/types'

interface Zone {
  id: boolean
  label: string
  cards: DragCard[]
}

const _ = defineProps<{
  zones: Zone[]
  checkedMap: Record<number, boolean>
  isChecked: boolean
}>()

const emit = defineEmits<{
  (e: 'moved', ids: number[]): void
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row w-full gap-4 md:gap-8 items-stretch">
    <DropZone
      v-for="zone in zones"
      :key="String(zone.id)"
      :id="String(zone.id)"
      :text="zone.label"
      v-model="zone.cards"
      :checked-map="checkedMap"
      :is-checked="isChecked"
      :disabled="isChecked"
      :className="
        zone.id ? 'bg-green-100 flex-1 text-blue-500' : 'bg-red-100  flex-1 text-[#DA4A4A]'
      "
      @moved="emit('moved', $event)"
    />
  </div>
</template>
