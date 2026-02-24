<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { ref, computed } from 'vue'
import DraggableCard from './DraggableCard.vue'
import type { DragCard } from '@/domain/types'

const props = defineProps<{
  text: string
  className?: string
  modelValue: DragCard[]
  checkedMap: Record<number, boolean>
  isChecked: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DragCard[]): void
  (e: 'moved', ids: number[]): void
}>()

const prevIds = ref<number[]>(props.modelValue?.map((c) => c.id) ?? [])

// Extract text color classes from className prop
const textColorClass = computed(() => {
  if (!props.className) return ''
  const colorMatch = props.className.match(
    /text-\[#[0-9A-Fa-f]+\]|text-(?:primary|error|warning|success|info|secondary|gray)-?\d*/,
  )
  return colorMatch ? colorMatch[0] : ''
})

function updateModel(newVal: DragCard[]) {
  emit('update:modelValue', newVal)

  const newIds = newVal.map((c) => c.id)
  const added = newIds.filter((id) => !prevIds.value.includes(id))
  const removed = prevIds.value.filter((id) => !newIds.includes(id))

  const moved = Array.from(new Set([...added, ...removed]))
  if (moved.length) emit('moved', moved)

  prevIds.value = newIds
}
</script>

<template>
  <div :class="[
    'relative w-full px-2.5 py-[16px] rounded-2xl min-w-32 min-h-64',
    className,
  ]">
    <p :class="[
      'font-semibold text-body-xl absolute inset-0 flex items-center justify-center pointer-events-none px-2 text-center',
      textColorClass,
    ]">
      {{ text }}
    </p>

    <VueDraggable :model-value="modelValue" @update:model-value="updateModel"
      :group="{ name: 'cards', pull: true, put: true }" :disabled="disabled" item-key="id"
      class="relative gap-2 flex flex-col h-full w-full">
      <DraggableCard v-for="card in modelValue" :key="`${card.id}-${isChecked}`" :card="card" :is-in-zone="true"
        :checked="isChecked && checkedMap[card.id] !== undefined ? checkedMap[card.id] : null" :class="{
          'cursor-grab active:cursor-grabbing': !disabled,
          'cursor-default': disabled,
        }" />
    </VueDraggable>
  </div>
</template>
