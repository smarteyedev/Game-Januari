<script setup lang="ts">
import type { DragCard } from '@/types/types'

const props = defineProps<{
  card: DragCard
  checked: boolean | null | undefined
  isInZone: boolean
}>()
</script>

<template>
  <div
    class="px-3 py-2 text-center min-w-[96px] md:min-w-[128px] border border-gray-300 flex items-center justify-center select-none  text-sm rounded-lg break-words"
    :class="{
      'bg-white': !isInZone || checked === null,
      'bg-green-500': isInZone && checked === true,
      'bg-red-500': isInZone && checked === false,
    }"
  >
    {{ card.label }}
  </div>
</template>
