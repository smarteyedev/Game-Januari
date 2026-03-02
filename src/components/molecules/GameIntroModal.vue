<script setup lang="ts">
import UiModal from '@/components/molecules/modal/index.vue'
import GameIntro from '../molecules/GameIntro.vue'
import type { IntroData } from '@/domain/types'
import UnknownIcon from '../atoms/svg/UnknownIcon.vue'
import UiButton from '@/components/atoms/button/index.vue'
import type { TContainerPosition } from './modal'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { computed } from 'vue'

interface Props {
  title: string
  introData?: IntroData
  modelValue: boolean
  containerPosition: TContainerPosition
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'start'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  containerPosition: 'fixed',
})
const emit = defineEmits<Emits>()

const onClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onStart = () => {
  emit('start')
  emit('update:modelValue', false)
}

const { isXs, isSm, isMd } = useBreakpoint()

const buttonSize = computed(() => {
  if (isXs.value) return 'xs'
  if (isSm.value) return 'sm'
  if (isMd.value) return 'md'
  return 'xl'
})

const iconSizeClass = computed(() => {
  if (isXs.value) return 'w-16 h-16'
  if (isSm.value) return 'w-20 h-20'
  if (isMd.value) return 'w-24 h-24'
  return 'w-31 h-33.25'
})
</script>

<template>
  <UiModal
    :container-position="props.containerPosition"
    :prevent-close="true"
    :modelValue="modelValue"
    size="md"
    position="center"
    scroll-mode="content"
    :content-style="{
      border: '6px solid #006082',
      boxShadow: '0px 8px 0px #006082',
      borderRadius: '40px',
      background: '#FFFCF6',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
    }"
    @update:modelValue="emit('update:modelValue', $event)"
    @cancel="onClose"
  >
    <!-- HEADER ICON -->
    <template #header-title>
      <div class="flex justify-center items-center w-full">
        <div :class="iconSizeClass">
          <UnknownIcon />
        </div>
      </div>
    </template>

    <template #close-btn>
      <span class="hidden" />
    </template>

    <!-- BODY -->
    <div class="flex-1 overflow-y-auto px-10 pt-6 flex justify-center">
      <GameIntro
        v-if="introData"
        :title="introData.title"
        :description="introData.description"
        :key_points="introData.key_points"
        class="w-full max-w-149.25"
      />
    </div>

    <!-- FOOTER -->
    <template #footer>
      <div class="flex justify-center shrink-0">
        <UiButton text="Mulai Game" variant="primary" :size="buttonSize" @click="onStart" />
      </div>
    </template>
  </UiModal>
</template>
