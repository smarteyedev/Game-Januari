<template>
  <button
    class="aspect-square min-w-[80px] min-h-[80px] grid place-items-center border-[3px]  shadow-xl  rounded-xl text-lg font-bold select-none transition text-[32px]"
    :class="disabled
      ? 'bg-gray-100 text-gray-700 cursor-not-allowed border-gray-700 shadow-gray-700'
      : 'bg-white hover:bg-gray-100 border-primary-700 shadow-primary-700'
      " :disabled="disabled" @click="$emit('input', char)">
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
