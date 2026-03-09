<template>
  <div
class="flex justify-center gap-3 mt-6"
role="radiogroup"
:aria-label="ariaLabel">
    <button
      v-for="s in max"
      :key="s"
      type="button"
      class="cursor-pointer select-none text-5xl leading-none bg-transparent border-0"
      :class="s <= (localHover || localValue) ? 'text-yellow-400' : 'text-gray-300'"
      @click="updateValue(s)"
      @mouseenter="localHover = s"
      @mouseleave="localHover = 0"
      @keydown.space.prevent="updateValue(s)"
      @keydown.enter.prevent="updateValue(s)"
      @keydown.left.prevent="focusPrev($event)"
      @keydown.right.prevent="focusNext($event)"
      :aria-checked="s === localValue"
      role="radio"
      :aria-label="`${s} star`"
      tabindex="0"
    >
      ★
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// defineModel handles both props declaration and v-model binding
const modelValue = defineModel<number>({ default: 0 })

const props = defineProps({
  max: { type: Number, default: 5 },
  readonly: { type: Boolean, default: false },
  ariaLabel: { type: String, default: 'Star rating' },
})

const emit = defineEmits(['update:modelValue'])

const localHover = ref(0)

// Use computed with getter/setter instead of watch
// This allows two-way binding while respecting readonly state
const localValue = computed({
  get: () => modelValue.value,
  set: (v: number) => {
    if (!props.readonly) {
      modelValue.value = v
      emit('update:modelValue', v)
    }
  },
})

const updateValue = (v: number) => {
  if (props.readonly) return
  localValue.value = v
}

const focusPrev = (e: KeyboardEvent) => {
  const el = (e.currentTarget as HTMLElement).previousElementSibling as HTMLElement | null
  if (el) el.focus()
}

const focusNext = (e: KeyboardEvent) => {
  const el = (e.currentTarget as HTMLElement).nextElementSibling as HTMLElement | null
  if (el) el.focus()
}
</script>
