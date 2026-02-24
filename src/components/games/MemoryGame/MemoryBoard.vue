<script setup lang="ts">
import MemoryCardItem from './MemoryCardItem.vue'
import type { MemoryCard } from '@/domain/types'

const props = defineProps<{ cards: MemoryCard[] }>()
const emit = defineEmits<{
  (e: 'flip', card: MemoryCard): void
}>()
</script>

<template>
  <div class="tight-grid">
    <MemoryCardItem v-for="card in props.cards" :key="card.id" :content-type="card.contentType"
      :logo="card.contentType === 'svg' ? card.value : undefined"
      :text="card.contentType === 'text' ? card.value : undefined" :flipped="card.flipped || false"
      :matched="card.matched || false" @flip="() => emit('flip', card)" />
  </div>
</template>

<style scoped>
.tight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0;
  /* No gaps */
  width: 100%;
}

/* For larger screens, you can control the maximum number of columns */
@media (min-width: 1024px) {
  .tight-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
}

@media (min-width: 1536px) {
  .tight-grid {
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }
}
</style>
