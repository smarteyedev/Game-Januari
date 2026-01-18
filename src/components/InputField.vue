<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  id: string
  required?: boolean
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="relative w-full">
    <input
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :required="required"
      placeholder=" "
      class="peer w-full px-3 py-4 text-sm bg-transparent rounded border border-gray-400 focus:outline-none peer-not-placeholder-shown:invalid:border-red-500 focus:invalid:border-red-500 focus:border-blue-600"
    />

    <label
      :for="id"
      class="absolute left-3 top-4 px-1 bg-white text-sm transition-all text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:invalid:text-red-500"
    >
      {{ label }} <span v-if="required">*</span>
    </label>
  </div>
</template>
