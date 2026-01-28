<script setup lang="ts">
import MemoryCardItem from './MemoryCardItem.vue'
import type { MemoryCard } from '@/types/types'

const props = defineProps<{ cards: MemoryCard[] }>()
const emit = defineEmits<{
  (e: 'flip', card: MemoryCard): void
}>()
</script>

<template>
  <div class="grid gap-4 w-full p-4 justify-center grid-cols-5 grid-rows-2">
    <MemoryCardItem
      v-for="card in props.cards"
      :key="card.id"
      :content-type="card.contentType"
      :logo="card.contentType === 'svg' ? card.value : undefined"
      :text="card.contentType === 'text' ? card.value : undefined"
      :flipped="card.flipped || false"
      :matched="card.matched || false"
      @flip="() => emit('flip', card)"
    />
  </div>
</template>
