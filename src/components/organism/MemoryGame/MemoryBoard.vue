<script setup lang="ts">
import MemoryCardItem from './MemoryCardItem.vue'
import type { MemoryCard } from '@/types/types'

const props = defineProps<{ cards: MemoryCard[] }>()
const emit = defineEmits<{
  (e: 'flip', card: MemoryCard): void
}>()
</script>

<template>
  <div class="grid gap-4 p-4 justify-center" style="
    grid-template-columns: repeat(5, 160px);
  ">
    <MemoryCardItem v-for="card in props.cards" :key="card.id" :content-type="card.contentType"
      :logo="card.contentType === 'svg' ? card.value : undefined"
      :text="card.contentType === 'text' ? card.value : undefined" :flipped="card.flipped || false"
      :matched="card.matched || false" @flip="() => emit('flip', card)" />
  </div>
</template>
