<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    text?: string
    variant?: 'primary' | 'secondary' | 'plain' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    disabled?: boolean
}>()

const base =
    'inline-flex items-center justify-center font-black tracking-[-0.01em] transition-all duration-150 select-none rounded-3xl shadow-xl'

const baseHoverEffects =
    'hover:-translate-y-[2px] hover:shadow-flat-md active:translate-y-[6px] active:shadow-none'

const plainHoverEffects =
    'hover:border-[3px] hover:shadow-flat-lg hover:shadow-blue-700 hover:border-blue-700'

const sizes = {
    xl: 'min-w-[180px] min-h-[48px] text-[16px]',
    lg: 'min-w-[165px] min-h-[44px] text-[15px]',
    md: 'min-w-[150px] min-h-[40px] text-[14px]',
    sm: 'min-w-[135px] min-h-[36px] text-[13px]'
}

const variants = {
    primary:
        'bg-blue-500 border-blue-700 text-white border-[3px] shadow-flat-lg shadow-blue-700',
    danger:
        'bg-[#DA4A4A] border-[#742828] text-white border-[3px] shadow-flat-lg shadow-[#742828]',
    secondary:
        'bg-cream-10 border-blue-700 text-blue-700 border-[3px] shadow-flat-lg shadow-blue-700',
    plain:
        'bg-cream-10 border-blue-700 text-white border-0 [-webkit-text-stroke:1px_var(--color-blue-700)]'
}

const disabledStyles = {
    default:
        'bg-gray-100 border-gray-700 border-[3px] text-white cursor-not-allowed [-webkit-text-stroke:1px_var(--color-gray-700)]',
    plain:
        'bg-transparent border-0 text-gray-100 cursor-not-allowed [-webkit-text-stroke:1px_var(--color-gray-700)]'
}

const classes = computed(() => [
    base,
    sizes[props.size ?? 'xl'],
    !props.disabled ? baseHoverEffects : '',
    !props.disabled && props.variant === 'plain' ? plainHoverEffects : '',
    props.disabled
        ? props.variant === 'plain'
            ? disabledStyles.plain
            : disabledStyles.default
        : variants[props.variant ?? 'primary']
])
</script>

<template>
    <button :class="classes" :disabled="props.disabled" :aria-disabled="props.disabled">
        <span>
            {{ props.text || 'Button Label' }}
        </span>
    </button>
</template>

<style src="src/assets/css/tailwind.css"></style>