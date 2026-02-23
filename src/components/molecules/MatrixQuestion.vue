<template>
  <div class="flex flex-col items-center gap-[16px]">
    <p class="font-semibold text-h6">{{ title }}</p>

    <div class="flex flex-wrap gap-2.5 justify-center">
      <button
        v-for="option in options"
        :key="option.value"
        @click="$emit('update:modelValue', option.value)"
        :disabled="disabled"
        :class="[
          'min-w-45 min-h-[56px] rounded-xl font-semibold text-h6 border transition-all duration-150',
          getButtonClass(option.value),
        ]"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type Option = {
  value: number
  label: string
}

const props = defineProps<{
  title: string
  modelValue: number | undefined
  options: Option[]
  correctAnswer: number
  finished: boolean
  disabled?: boolean
}>()

defineEmits(['update:modelValue'])

const getButtonClass = (value: number) => {
  // Before submit → normal behavior
  if (!props.finished) {
    return props.modelValue === value
      ? 'bg-blue-500 text-white border-blue-500 scale-105'
      : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
  }

  // After submit
  if (value === props.correctAnswer) {
    return 'bg-green-500 text-white border-green-500 scale-105'
  }

  if (value === props.modelValue && value !== props.correctAnswer) {
    return 'bg-red-500 text-white border-red-500 scale-105'
  }

  return 'bg-gray-100 border-gray-300 opacity-70'
}
</script>
