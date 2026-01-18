<script setup lang="ts">
defineProps({
  icon: {
    type: String, // raw SVG string
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="inline-flex items-center justify-center cursor-pointer">
    <span class="flex justify-center items-center">
      <slot name="icon" />
    </span>
    <span class="text-white">
      <slot />
    </span>
  </button>
</template>
