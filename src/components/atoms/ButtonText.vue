<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  text?: string
  variant?: 'primary' | 'secondary' | 'plain' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}>()

const base =
  'inline-flex items-center justify-center font-black ' +
  'transition-all duration-150 select-none rounded-3xl shadow-xl'

const baseHoverEffects =
  'hover:-translate-y-[2px] hover:shadow-flat-md active:translate-y-[6px] active:shadow-none'

const plainHoverEffects =
  'hover:border-[3px] hover:shadow-flat-lg hover:shadow-primary-700 hover:border-primary-700'

const sizes = {
  xl: 'min-w-[180px] min-h-[48px] text-[16px] hover:text-[18px]',
  lg: 'min-w-[165px] min-h-[44px] text-[15px] hover:text-[17px]',
  md: 'min-w-[150px] min-h-[40px] text-[14px] hover:text-[16px]',
  sm: 'min-w-[135px] min-h-[36px] text-[13px] hover:text-[15px]',
}

const variants = {
  primary:
    'bg-primary-500 border-[3px] text-white shadow-flat-lg ' +
    '[--btn-accent:var(--color-primary-700)] ' +
    'border-primary-700 shadow-primary-700',

  danger:
    'bg-[#DA4A4A] border-[3px] text-white shadow-flat-lg ' +
    '[--btn-accent:#742828] ' +
    'border-[#742828] shadow-[#742828]',

  secondary:
    'bg-cream-10 border-[3px] text-primary-700 shadow-flat-lg ' +
    '[--btn-accent:var(--color-primary-700)] ' +
    'border-primary-700 shadow-primary-700',

  plain: 'bg-cream-10 border-0 text-white ' + '[--btn-accent:var(--color-primary-700)]',
}

const disabledStyles = {
  default:
    'bg-gray-100 border-[3px] text-white cursor-not-allowed ' +
    '[--btn-accent:var(--color-gray-700)] ' +
    'border-gray-700',

  plain:
    'bg-transparent border-0 text-gray-100 cursor-not-allowed ' +
    '[--btn-accent:var(--color-gray-700)]',
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
    : variants[props.variant ?? 'primary'],
])

const textEffects = computed(() => {
  if (props.disabled) return ''
  if (props.variant === 'secondary') return ''
  return 'text-cartoon text-cartoon-sm'
})
</script>

<template>
  <button :class="classes" :disabled="props.disabled" :aria-disabled="props.disabled">
    <span :class="textEffects">
      {{ props.text || 'Button Label' }}
    </span>
  </button>
</template>

<style src="src/assets/css/tailwind.css"></style>