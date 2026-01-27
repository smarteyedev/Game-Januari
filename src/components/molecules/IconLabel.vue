<script setup lang="ts">
import { useSlots } from 'vue'

const props = defineProps<{
  label: string
  bullet?: boolean
}>()

const slots = useSlots()
const hasIcon = !!slots.icon
</script>

<template>
  <div class="flex gap-2 items-center">
    <!-- Use icon if provided, otherwise use bullet if bullet prop is true -->
    <template v-if="hasIcon">
      <slot name="icon" />
    </template>
    <template v-else-if="props.bullet">
      <span class="mr-2">•</span>
    </template>

    <span>{{ props.label }}</span>
  </div>
</template>
