<script setup lang="ts">
import MemoryCardItem from './MemoryCardItem.vue'
import type { MemoryCard } from '@/domain/types'

const props = defineProps<{ cards: MemoryCard[] }>()
const emit = defineEmits<{
  (e: 'flip', card: MemoryCard): void
}>()
</script>

<template>
  <div
    class="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-10 gap-4.5 justify-center place-content-center"
  >
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
