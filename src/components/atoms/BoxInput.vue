<template>
  <div class="flex gap-2 cursor-text border p-2 relative" @click="focusInput">
    <div
      v-for="(char, i) in value"
      :key="i"
      class="w-10 h-11 grid place-items-center text-[22px] border-b-[1.5px]"
      :class="{
        'border-b-green-600 font-bold': locked[i],
        'border-b-gray-300': !locked[i] && char,
        'border-b-gray-600': !locked[i] && !char,
      }"
    >
      {{ locked[i] ?? char ?? '' }}
    </div>

    <input ref="input" class="absolute opacity-0 pointer-events-none" readonly @keydown.prevent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  value: (string | null)[]
  locked: (string | null)[]
}>()

const input = ref<HTMLInputElement | null>(null)

function focusInput() {
  input.value?.focus()
}
</script>
