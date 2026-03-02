<template>
  <button
@click="clickable && $emit('click')"
:class="[
    'min-w-[72px] min-h-[72px] w-full font-bold border-gray-500 border rounded-2xl aspect-video gap-2.5 transition-all',
    stateClass,
    clickable ? 'cursor-pointer hover:brightness-110' : 'cursor-default',
  ]">
    <span class="text-center font-semibold text-body-xs md:text-body-xl">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  state: 'idle' | 'selected' | 'solved'
  color?: string
  clickable?: boolean
}>()

defineEmits(['click'])

const stateClass = computed(() => {
  if (props.state === 'selected') return 'bg-primary-100'
  if (props.state === 'solved') return props.color
  return 'bg-gray-50'
})
</script>
