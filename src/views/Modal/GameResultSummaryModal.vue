<script setup lang="ts">
<<<<<<<< HEAD:src/views/GameResultSummaryModal.vue
import UiModal from '@/components/organisms/modal/index.vue'
import type { TContainerPosition } from '@/components/organisms/modal/types.ts'
========
import UiModal from '@/components/molecules/modal/index.vue'
import type { TContainerPosition } from '@/components/molecules/modal/types'
>>>>>>>> dev:src/views/Modal/GameResultSummaryModal.vue
import GameResultSummary from './GameResultSummary.vue'

interface Props {
  modelValue: boolean
  containerPosition: TContainerPosition
  resultSummary?: any
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'toggle-summary'): void
}

const props = withDefaults(defineProps<Props>(), {
  containerPosition: 'fixed',
  resultSummary: undefined,
})
const emit = defineEmits<Emits>()

const onClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <UiModal :container-position="props.containerPosition" :prevent-close="true" :modelValue="modelValue" size="md"
    position="center" scroll-mode="content" :content-style="{
      border: '6px solid #006082',
      boxShadow: '0px 8px 0px #006082',
      borderRadius: '40px',
      background: '#FFFCF6',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
    }" @update:modelValue="emit('update:modelValue', $event)" @cancel="onClose">
    <!-- BODY -->
    <div class="flex-1 overflow-y-auto flex justify-center">
      <GameResultSummary :resultSummary="props.resultSummary" @toggle-summary="emit('toggle-summary')" />
    </div>
  </UiModal>
</template>
