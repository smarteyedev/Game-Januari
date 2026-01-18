<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import DraggableWord from './DraggableWord.vue'

const props = defineProps<{
  modelValue: string | null
  locked: boolean
  show: boolean
  state?: 'correct' | 'wrong' | 'idle'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | null): void
  (e: 'swap', v: string): void
}>()

const list = ref<string[]>(props.modelValue ? [props.modelValue] : [])

watch(
  () => props.modelValue,
  (v) => {
    list.value = v ? [v] : []
  },
)

// SWAP LOGIC
watch(list, (v, old) => {
  // item removed (dragged out)
  if (v.length === 0 && props.modelValue) {
    emit('update:modelValue', null)
    return
  }
  // first drop
  if (v.length === 1 && !props.modelValue) {
    emit('update:modelValue', v[0]!)
    return
  }

  // swap (order-independent)
  if (v.length === 2 && props.modelValue) {
    const oldWord = props.modelValue
    const newWord = v.find((w) => w !== oldWord)!

    emit('swap', oldWord)
    list.value = [newWord]
    emit('update:modelValue', newWord)
  }
})
</script>

<template>
  <VueDraggable
    v-model="list"
    group="words"
    :sort="false"
    class="inline-flex min-w-[100px] min-h-[24px] px-3 border rounded justify-center items-center align-middle blank"
    :class="
      (show && state === 'correct' && 'border-green-500 text-green-600') ||
      (show && state === 'wrong' && 'border-red-500 text-red-600')
    "
  >
    <DraggableWord v-for="w in list" :key="w" :word="w" variant="blank" />
  </VueDraggable>
</template>
