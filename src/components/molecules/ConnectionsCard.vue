<template>
  <button @click="clickable && $emit('click')" :class="[
    'min-w-[72px] min-h-[72px]  md:p-5.75 font-bold transition border-gray-500 border rounded-2xl aspect-square md:aspect-video gap-2.5',
    stateClass,
    clickable ? 'cursor-pointer hover:brightness-110' : 'cursor-default',
  ]">
    <UiLabel :label="label" class="font-semibold text-body-xl" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UiLabel } from '../atoms/label'

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
