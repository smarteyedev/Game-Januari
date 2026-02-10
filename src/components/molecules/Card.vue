<template>
  <div :draggable="draggable && !disabled" @dragstart="handleDragStart" @click="handleClick" :class="[
    baseClass,
    customClass,
    {
      'cursor-grab': draggable && !disabled,
      'cursor-default': disabled,
    },
  ]">
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
    customClass?: string // Parent can pass any Tailwind/utility classes
  }>(),
  {
    draggable: false,
    disabled: false,
    customClass: '',
  },
)

const { label, draggable, disabled } = props

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

const baseClass = 'select-none text-sm rounded-lg break-words flex items-center justify-center'
</script>
