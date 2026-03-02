<template>
  <button
<<<<<<< HEAD
    class="aspect-square min-w-9 min-h-9 md:min-w-13 md:min-h-13 grid place-items-center border-2 md:border-[3px] shadow-xl rounded-xl md:rounded-3xl text-body-xl font-bold select-none transition-all md:text-h3"
=======
    class="aspect-square min-w-17.5 min-h-17.5 grid place-items-center border-[3px] shadow-xl rounded-3xl text-lg font-bold select-none transition text-h3"
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    :class="
      disabled
        ? 'bg-gray-100 text-gray-700 cursor-not-allowed border-gray-700 shadow-gray-700'
        : 'bg-white hover:bg-gray-100 border-primary-700 shadow-primary-700'
    "
    :disabled="disabled"
    @click="$emit('input', char)"
  >
    {{ char }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  char: string
  disabled: boolean
}>()

defineEmits<{
  (e: 'input', value: string): void
}>()
</script>
