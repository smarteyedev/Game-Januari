<script setup lang="ts">
import UiModal from '@/components/molecules/modal/index.vue'
import GameIntro from '../molecules/GameIntro.vue'
import type { IntroData } from '@/domain/types'
import UnknownIcon from '../atoms/iconComponent/UnknownIcon.vue'
import ButtonText from '../atoms/ButtonText.vue'

interface Props {
  title: string
  introData?: IntroData
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'start'): void
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const onClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onStart = () => {
  emit('start')
  emit('update:modelValue', false)
}
</script>

<template>
  <UiModal :prevent-close="true" :modelValue="modelValue" size="md" position="center" scroll-mode="content"
    :content-style="{
      border: '6px solid #006082',
      boxShadow: '0px 8px 0px #006082',
      borderRadius: '40px',
      background: '#FFFCF6',
    }" @update:modelValue="emit('update:modelValue', $event)" @cancel="onClose">
    <!-- HEADER ICON -->
    <template #header-title>
      <div class="flex justify-center items-center w-full">
        <div class="w-24 h-25.5 drop-shadow-[0_8px_0_#006082]">
          <UnknownIcon />
        </div>
      </div>
    </template>

    <template #close-btn>
      <span class="hidden" />
    </template>

    <!-- BODY -->
    <div class="px-10 pt-[24px] flex justify-center">
      <GameIntro v-if="introData" :title="introData.title" :description="introData.description"
        :key_points="introData.key_points" class="w-full max-w-149.25" />
    </div>

    <!-- FOOTER -->
    <template #footer>
      <div class="flex justify-center pb-10">
        <ButtonText text="Mulai Game" variant="primary" size="lg" class="w-40.5 h-11" @click="onStart" />
      </div>
    </template>
  </UiModal>
</template>
