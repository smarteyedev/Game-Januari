<script setup lang="ts">
import MemoryCardItem from './MemoryCardItem.vue'
import type { MemoryCard } from '@/types/types'

const props = defineProps<{ cards: MemoryCard[] }>()
const emit = defineEmits<{
  (e: 'flip', card: MemoryCard): void
}>()
</script>

<template>
  <div
    class="grid gap-4 w-full p-4 justify-center"
    style="grid-template-columns: repeat(auto-fit, minmax(100px, 1fr))"
  >
    <MemoryCardItem
      v-for="card in props.cards"
      :key="card.id"
      :type="card.type"
      :logo="
        card.type === 'logo'
          ? (card.text as 'chatgpt' | 'meta' | 'github' | 'gemini' | 'canva')
          : undefined
      "
      :text="card.text"
      :flipped="card.flipped"
      :matched="card.matched"
      @flip="() => emit('flip', card)"
    />
  </div>
</template>
