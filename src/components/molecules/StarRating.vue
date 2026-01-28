<template>
    <div class="flex justify-center gap-3 mt-6" role="radiogroup" :aria-label="ariaLabel">
        <button v-for="s in max" :key="s" type="button"
            class="cursor-pointer select-none text-5xl leading-none bg-transparent border-0"
            :class="s <= (localHover || localValue) ? 'text-yellow-400' : 'text-gray-300'" @click="updateValue(s)"
            @mouseenter="localHover = s" @mouseleave="localHover = 0" @keydown.space.prevent="updateValue(s)"
            @keydown.enter.prevent="updateValue(s)" @keydown.left.prevent="focusPrev($event)"
            @keydown.arrowleft.prevent="focusPrev($event)" @keydown.right.prevent="focusNext($event)"
            @keydown.arrowright.prevent="focusNext($event)" :aria-checked="s === localValue" role="radio"
            :aria-label="`${s} star`" tabindex="0">
            ★
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: { type: Number, default: 0 },
    max: { type: Number, default: 5 },
    readonly: { type: Boolean, default: false },
    ariaLabel: { type: String, default: 'Star rating' },
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)
const localHover = ref(0)

watch(() => props.modelValue, v => (localValue.value = v))

const updateValue = (v: number) => {
    if (props.readonly) return
    localValue.value = v
    emit('update:modelValue', v)
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
