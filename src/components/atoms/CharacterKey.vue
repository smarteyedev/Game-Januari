<template>
  <button
    class="
      w-10 h-11
      grid place-items-center
      border rounded
      text-lg font-medium
      select-none
      transition
    "
    :class="disabled
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-white hover:bg-gray-100 active:scale-95'
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
