<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import DraggableWord from './DraggableWord.vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>()

const local = computed<string[]>({
  get: () => props.modelValue ?? [],
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <VueDraggable
    v-model="local"
    group="words"
    item-key="word"
    class="flex flex-wrap gap-3 justify-center"
  >
    <DraggableWord v-for="w in local" :key="w" :word="w" />
  </VueDraggable>
</template>
