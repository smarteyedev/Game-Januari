<template>
  <div
class="flex gap-1.5 md:gap-5 cursor-text relative"
@click="focusInput">
    <div
v-for="(char, i) in value"
:key="i"
      class="aspect-square min-w-9 min-h-9 md:min-w-13 md:min-h-13 grid place-items-center border-2 md:border-[3px] rounded-xl md:rounded-3xl shadow-xl text-body-xl md:text-h3 font-bold select-none transition-all bg-white border-primary-700 shadow-primary-700 text-black">
      {{ locked[i] ?? char ?? '' }}
    </div>

    <input
ref="input"
class="absolute opacity-0 pointer-events-none"
readonly
@keydown.prevent />
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
