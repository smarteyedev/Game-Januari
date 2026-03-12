<template>
  <EngineDropZone
    :zone-id="`board-${slotId}`"
    :items="item ? [item] : []"
    :max-drag-item="1"
    @move="$emit('move', $event)"
    class="inline-flex min-w-25 min-h-7.5 py-1.5 mb-1 px-2 md:px-2.5 border justify-center items-center align-middle rounded-xl"
    :class="{
      'bg-green-100 border-green-300': isCorrect === true,
      'bg-red-100 border-red-300': isCorrect === false,
      'bg-gray-25 border-gray-200': isCorrect === null,
    }"
  >
    <WordItem
      v-if="item"
      :item="item"
      :inSlot="true"
      :disabled="disabled"
      :drag-data="{ item: item, index: 0, zoneId: `board-${slotId}` }"
    />
  </EngineDropZone>
</template>

<script setup lang="ts">
import type { Blank } from '@/domain/types'
import WordItem from './WordItem.vue'
import { DropZone as EngineDropZone } from '@/components/dragengine'

defineProps<{
  item?: Blank | null
  slotId: number
  isCorrect: boolean | null | undefined
  disabled: boolean
}>()

defineEmits(['move'])
</script>
