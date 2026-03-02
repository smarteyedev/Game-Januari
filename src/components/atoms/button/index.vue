<script setup lang="ts">
import { computed } from 'vue'
import { UiIcon } from '../icon'

const props = withDefaults(
  defineProps<{
    text?: string
    variant?: 'primary' | 'secondary' | 'plain' | 'danger'
<<<<<<< HEAD
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
=======
    size?: 'sm' | 'md' | 'lg' | 'xl'
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    disabled?: boolean

    icon?: string
    iconAppend?: string
    loading?: boolean
    square?: boolean
  }>(),
  {
    icon: '',
    iconAppend: '',
  },
)

const isDisabled = computed(() => props.disabled || props.loading)

<<<<<<< HEAD
function getIconSize(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {
  const map = {
    xs: 14,
=======
function getIconSize(size: 'sm' | 'md' | 'lg' | 'xl') {
  const map = {
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  }
  return map[size ?? 'xl']
}

const base =
  'inline-flex items-center justify-center font-black ' +
<<<<<<< HEAD
  'cursor-pointer rounded-[12px] shadow-xl px-6 transition-all'

// const baseHoverEffects = 'hover:-translate-y-[2px] active:translate-y-[6px] active:shadow-none'

// const plainHoverEffects = 'hover:border-[3px] hover:shadow-primary-700 hover:border-primary-700'

const sizes = {
  xl: 'min-h-[56px] text-[20px] active:text-[24px] active:min-h-[64px]',
  lg: 'min-h-[48px] text-[18px] active:text-[20px] active:min-h-[56px]',
  md: 'min-h-[44px] text-[16px] active:text-[18px] active:min-h-[48px]',
  sm: 'min-h-[40px] text-[14px] active:text-[14px] active:min-h-[44px]',
  xs: 'min-h-[36px] text-[12px] active:text-[14px] active:min-h-[40px]',
=======
  'transition-all duration-150 select-none rounded-3xl shadow-xl'

const baseHoverEffects = 'hover:-translate-y-[2px] active:translate-y-[6px] active:shadow-none'

const plainHoverEffects = 'hover:border-[3px] hover:shadow-primary-700 hover:border-primary-700'

const sizes = {
  xl: 'min-w-[180px] min-h-[48px] text-[16px] hover:text-[18px]',
  lg: 'min-w-[165px] min-h-[44px] text-[15px] hover:text-[17px]',
  md: 'min-w-[150px] min-h-[40px] text-[14px] hover:text-[16px]',
  sm: 'min-w-[135px] min-h-[36px] text-[13px] hover:text-[15px]',
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
}

const variants = {
  primary:
    'bg-primary-500 border-[3px] text-white  ' +
    '[--btn-accent:var(--color-primary-700)] ' +
    'border-primary-700 shadow-primary-700',

  danger:
    'bg-[#DA4A4A] border-[3px] text-white  ' +
    '[--btn-accent:#742828] ' +
    'border-[#742828] shadow-[#742828]',

  secondary:
    'bg-cream-10 border-[3px] text-primary-700 ' +
    '[--btn-accent:var(--color-primary-700)] ' +
    'border-primary-700 shadow-primary-700',

  plain: 'bg-cream-10 border-0 text-white ' + '[--btn-accent:var(--color-primary-700)]',
}

const disabledStyles = {
  default:
    'bg-gray-100 border-[3px] text-white cursor-not-allowed ' +
    '[--btn-accent:var(--color-gray-700)] ' +
    'border-gray-700 shadow-gray-700',

  plain:
    'bg-transparent border-0 text-gray-100 cursor-not-allowed ' +
    '[--btn-accent:var(--color-gray-700)]',
}

const classes = computed(() => [
  base,
  sizes[props.size ?? 'xl'],
<<<<<<< HEAD
  // !props.disabled ? baseHoverEffects : '',
  // !props.disabled && props.variant === 'plain' ? plainHoverEffects : '',
=======
  !props.disabled ? baseHoverEffects : '',
  !props.disabled && props.variant === 'plain' ? plainHoverEffects : '',
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
  props.disabled
    ? props.variant === 'plain'
      ? disabledStyles.plain
      : disabledStyles.default
    : variants[props.variant ?? 'primary'],
])

const textEffects = computed(() => {
  if (props.variant === 'secondary') return ''

  return ['text-cartoon', 'text-cartoon-sm', props.disabled ? 'text-gray-300' : '']
})
</script>

<template>
  <button :class="classes" :disabled="isDisabled" :aria-disabled="isDisabled">
    <!-- Prepend -->
    <span v-if="props.loading || props.icon" class="mr-2 flex items-center">
      <UiIcon
        :name="props.loading ? 'uil-spinner' : props.icon"
        :width="getIconSize(props.size ?? 'xl')"
        :height="getIconSize(props.size ?? 'xl')"
        mode="svg"
        :class="{ 'animate-spin': props.loading }"
      />
    </span>

    <!-- Label -->
    <span v-if="!props.square" :class="textEffects">
      {{ props.text || 'Button Label' }}
    </span>

    <!-- Append -->
    <span v-if="props.iconAppend" class="ml-2 flex items-center">
<<<<<<< HEAD
      <UiIcon
=======
      <UiAtomsIcon
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
        :name="props.iconAppend"
        :width="getIconSize(props.size ?? 'xl')"
        :height="getIconSize(props.size ?? 'xl')"
        mode="svg"
      />
    </span>
  </button>
</template>

<style src="@/assets/css/tailwind.css"></style>
