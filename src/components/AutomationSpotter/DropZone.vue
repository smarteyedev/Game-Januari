<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { ref } from 'vue'
import DraggableCard from './DraggableCard.vue'
import type { DragCard } from '@/types/types'

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
    'relative rounded-lg min-w-0 w-full p-2 min-h-[180px] sm:min-h-[220px] md:min-h-[243px]',
    className,
  ]">
    <p
      class="text-xl md:text-3xl absolute inset-0 flex items-center justify-center font-bold pointer-events-none text-inherit px-2 text-center">
      {{ text }}
    </p>

    <VueDraggable :model-value="modelValue" @update:model-value="updateModel"
      :group="{ name: 'cards', pull: true, put: true }" :disabled="disabled" item-key="id"
      class="relative flex flex-col gap-2 min-h-[120px] md:min-h-[160px] p-2 text-black">
      <DraggableCard v-for="card in modelValue" :key="card.id" :card="card" :is-in-zone="true"
        :checked="isChecked && checkedMap[card.id] !== undefined ? checkedMap[card.id] : null" :class="{
          'cursor-grab active:cursor-grabbing': !disabled,
          'cursor-default': disabled,
        }" />
    </VueDraggable>
  </div>
</template>