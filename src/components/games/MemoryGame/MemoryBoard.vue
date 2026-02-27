<script setup lang="ts">
import MemoryCardItem from './MemoryCardItem.vue'
import type { MemoryCard } from '@/domain/types'

const props = defineProps<{ cards: MemoryCard[] }>()
const emit = defineEmits<{
  (e: 'flip', card: MemoryCard): void
}>()
</script>

<template>
  <div class="flex flex-wrap justify-center gap-4.5 max-w-screen-2xl mx-auto basis-1/5">
    <MemoryCardItem v-for="card in props.cards" :key="card.id" :content-type="card.contentType"
      :logo="card.contentType === 'svg' ? card.value : undefined"
      :text="card.contentType === 'text' ? card.value : undefined" :flipped="card.flipped || false"
      :matched="card.matched || false" @flip="() => emit('flip', card)" />
  </div>
</template>
