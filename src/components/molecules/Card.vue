<template>
  <div
    :draggable="draggable && !disabled"
    @dragstart="handleDragStart"
    @click="handleClick"
    :class="[
      variant === 'card' ? baseClass : 'w-full h-full flex items-center justify-center',
      variant === 'card'
        ? {
            'cursor-grab': draggable && !disabled,
            'cursor-default': disabled,
            'bg-white': !noBackground && (!isInZone || checked === null),
            'bg-green-500': !noBackground && isInZone && checked === true,
            'bg-red-500': !noBackground && isInZone && checked === false,
            'px-3 py-1 border rounded': !inSlot,
            'bg-transparent p-0 m-0 rounded-none font-medium border-0': inSlot || noBackground, // Add noBackground here
          }
        : {
            'cursor-default': disabled,
          },
      noBackground ? 'bg-transparent' : '', // Force transparent background
    ]"
  >
    <slot>
      {{ label }}
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    draggable?: boolean
    disabled?: boolean
    isInZone?: boolean
    checked?: boolean | null
    inSlot?: boolean
    variant?: 'card' | 'content'
    noBackground?: boolean
  }>(),
  {
    draggable: false,
    disabled: false,
    isInZone: false,
    checked: null,
    inSlot: false,
    variant: 'card',
    noBackground: false,
  },
)

const { label, draggable, disabled, isInZone, checked, inSlot, variant, noBackground } = props

const emit = defineEmits<{
  (e: 'dragstart', ev: DragEvent): void
  (e: 'click', ev?: MouseEvent): void
}>()

function handleDragStart(ev: DragEvent) {
  if (disabled) {
    ev.preventDefault()
    return
  }
  emit('dragstart', ev)
}

function handleClick(ev?: MouseEvent) {
  if (disabled) return
  emit('click', ev)
}

const baseClass =
  'text-center min-w-[96px] md:min-w-[128px] select-none text-sm rounded-lg break-words flex items-center justify-center'
</script>

<style scoped>
.px-3\.py-2 {
  padding: 0.5rem 0.75rem;
}
</style>
