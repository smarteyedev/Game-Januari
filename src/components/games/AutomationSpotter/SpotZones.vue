<script setup lang="ts">
import DropZone from './DropZone.vue'
import type { DragCard } from '@/domain/types'

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
<<<<<<< HEAD
  <div class="flex flex-col md:flex-row w-full gap-2.5 md:gap-8">
=======
  <div class="flex w-full gap-[32px]">
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
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
        zone.id ? 'bg-green-100 flex-1 text-primary-500' : 'bg-red-100  flex-1 text-[#DA4A4A]'
      "
      @moved="emit('moved', $event)"
    />
  </div>
</template>
