<template>
  <div class="flex gap-[20px] cursor-text relative" @click="focusInput">
    <div
      v-for="(char, i) in value"
      :key="i"
      class="aspect-square min-w-17.5 min-h-17.5 grid place-items-center border-[3px] rounded-3xl shadow-xl text-h3 font-bold select-none transition bg-white border-primary-700 shadow-primary-700 text-black"
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
