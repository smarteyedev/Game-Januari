<script setup lang="ts">
const props = defineProps<{
  word: string
  variant?: 'pool' | 'blank'
}>()
</script>

<template>
  <div
    class="select-none"
    :class="
      variant === 'blank'
        ? 'bg-transparent border-0 p-0 m-0'
        : 'px-3 py-1 border rounded bg-white shadow-sm min-w-[100px] text-center'
    "
  >
    <span>
      {{ word }}
    </span>
  </div>
</template>
