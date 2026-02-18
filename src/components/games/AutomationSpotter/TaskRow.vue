<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { ref } from 'vue'
import DraggableCard from './DraggableCard.vue'
import type { DragCard } from '@/domain/types'
import { computed } from 'vue'
import clickSound from '@/assets/sounds/btn_click.ogg'

const props = defineProps<{
  modelValue: DragCard[]
  checkedMap: Record<number, boolean>
  isChecked: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: DragCard[]): void
  (e: 'moved', ids: number[]): void
}>()

const prevIds = ref<number[]>((props.modelValue ?? []).map((c) => c.id))

const local = computed<DragCard[]>({
  get: () => props.modelValue ?? [],
  set: (v) => {
    emit('update:modelValue', v)

    const newIds = (v ?? []).map((c) => c.id)
    const added = newIds.filter((id) => !prevIds.value.includes(id))
    const removed = prevIds.value.filter((id) => !newIds.includes(id))
    const moved = Array.from(new Set([...added, ...removed]))
    if (moved.length) emit('moved', moved)

    prevIds.value = newIds
  },
})

function getChecked(id: number): boolean | null {
  if (!props.isChecked) return null
  return props.checkedMap[id] !== undefined ? props.checkedMap[id] : null
}

const audio = new Audio(clickSound)

function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play()
  }
}
</script>

<template>
  <VueDraggable
    v-model="local"
    :group="{ name: 'cards', pull: true, put: true }"
    item-key="id"
    :disabled="disabled"
    @start="playClick"
    @end="playClick"
    class="flex flex-wrap max-w-full justify-center items-center gap-2 w-full"
  >
    <DraggableCard
      v-for="c in local"
      :key="c.id"
      :card="c"
      :is-in-zone="false"
      :checked="getChecked(c.id)"
      :class="{
        'cursor-grab active:cursor-grabbing': !disabled,
        'cursor-default': disabled,
      }"
    />
  </VueDraggable>
</template>
