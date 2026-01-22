<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="flex gap-[20px] justify-content items-center">
    <slot name="icon" />
    <span>{{ label }}</span>
  </div>
</template>
