<script setup lang="ts">
import UiModal from '@/components/molecules/modal/index.vue'
import FeedbackForm from '@/components/organism/FeedbackForm.vue'

interface Props {
  title?: string
  modelValue: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'full'
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  showClose?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'submitted'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Your Feedback',
  size: 'md',
  position: 'center',
  showClose: true,
})

const emit = defineEmits<Emits>()

const onClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

function onSubmitted() {
  emit('submitted')
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <UiModal
    :modelValue="modelValue"
    :title="title"
    :size="size"
    :position="position"
    :overlay="true"
    :prevent-close="false"
    scroll-mode="root"
    :divider="true"
    @update:modelValue="emit('update:modelValue', $event)"
    @cancel="onClose"
  >
    <template #close-btn="{ onClick }">
      <slot name="close-btn" :on-click="onClick" />
    </template>

    <div class="flex-1">
      <FeedbackForm @submitted="onSubmitted" />
    </div>
  </UiModal>
</template>
