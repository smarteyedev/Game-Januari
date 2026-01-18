<script setup lang="ts">
import DropZone from './DropZone.vue'
import type { DragCard } from '@/types/types'

const props = defineProps<{
  zones: Record<string, { id: string; label: string; cards: DragCard[] }>
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
      v-for="zone in Object.values(props.zones)"
      :key="zone.id"
      :id="zone.id"
      :text="zone.label"
      v-model="zone.cards"
      :checked-map="props.checkedMap"
      :is-checked="props.isChecked"
      :className="(zone.id === 'zone1' ? 'correct' : 'wrong') + ' flex-1'"
      @moved="emit('moved', $event)"
    />
  </div>
</template>
