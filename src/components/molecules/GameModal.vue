<script setup lang="ts">
import UiModal from '@/components/molecules/modal/index.vue'
import { UiButton } from '../atoms/button'
import { UiIcon } from '../atoms/icon'

interface Props {
  title: string
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
}

const _ = withDefaults(defineProps<Props>(), {
  title: 'Judul',
  size: 'lg',
  position: 'center',
  showClose: true,
})

const emit = defineEmits<Emits>()

const onClose = () => {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <UiModal :content-style="{ 'border': 'solid 6px #006082' }" :modelValue="modelValue" :title="title" :size="size"
    :position="position" :overlay="true" :prevent-close="false" scroll-mode="root" :divider="true"
    @update:modelValue="emit('update:modelValue', $event)" @cancel="onClose">
    <!-- Header Extra Slot for custom header content -->
    <template #header-extra>
      <slot name="header-extra" />
    </template>

    <template #header-title>
      <span class="text-h4 font-bold text-blue-700">{{ title }}</span>
    </template>

    <!-- Custom Close Button Slot -->
    <template #close-btn="{ onClick }">
      <slot name="close-btn" :on-click="onClick">
        <UiButton v-if="showClose" variant="ghost" @click="onClick"
          class="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer">
          <template #prepend>
            <UiIcon name="mdi:close-circle-outline" class="h-9 w-9 text-blue-700" />
          </template>
        </UiButton>
      </slot>
    </template>

    <!-- Main Content -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- Footer Slots -->
    <template #footer-left="{ onNegativeClick }">
      <slot name="footer-left" :on-negative-click="onNegativeClick" />
    </template>

    <template #footer-right="{ onPositiveClick }">
      <slot name="footer-right" :on-positive-click="onPositiveClick" />
    </template>

    <!-- Full Footer Override -->
    <template #footer="{ onNegativeClick, onPositiveClick }">
      <slot name="footer" :on-negative-click="onNegativeClick" :on-positive-click="onPositiveClick" />
    </template>
  </UiModal>
</template>
