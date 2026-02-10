<template>
  <button
    @click="clickable && $emit('click')"
    :class="[
      'p-4 rounded-sm font-bold transition',
      stateClass,
      clickable ? 'cursor-pointer hover:brightness-110' : 'cursor-default',
    ]"
  >
    <UiLabel
:label="label"
:ui="{ color: 'white' }" />
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
  if (props.state === 'selected') return 'bg-green-600'
  if (props.state === 'solved') return props.color
  return 'bg-gray-700'
})
</script>
