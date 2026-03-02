<template>
  <div class="flex flex-col items-center gap-2 md:gap-4 w-full">
    <p class="font-semibold text-body-xs md:text-body-xl">{{ title }}</p>

    <div class="flex gap-1.5 md:gap-4 justify-center w-full">
      <button
        v-for="option in options"
        :key="option.value"
        @click="$emit('update:modelValue', option.value)"
        :disabled="disabled"
        :class="[
          'min-w-[60px] min-h-8 px-3.25 w-full md:min-h-12 rounded-lg md:rounded-xl font-semibold text-[10px] md:text-body-xl border transition-all duration-150',
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
      ? 'bg-primary-100 border-primary-500 '
      : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
  }

  // After submit
  if (value === props.correctAnswer) {
    return 'bg-green-100 text-green-700 border-green-700'
  }

  if (value === props.modelValue && value !== props.correctAnswer) {
    return 'bg-red-100 border-red-500 text-red-500'
  }

  return 'bg-gray-100 border-gray-300 opacity-70'
}
</script>
