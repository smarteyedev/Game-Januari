<script setup lang="ts">
import UiModal from '@/components/molecules/modal/index.vue'
import GameIntro from '../molecules/GameIntro.vue'
import type { IntroData } from '@/types/types'
import { UiButton } from '../atoms/button'
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
  <UiModal :content-style="{ 'border': 'solid 6px #006082' }" :modelValue="modelValue" size="md" position="center"
    :overlay="true" :prevent-close="false" scroll-mode="modal" @update:modelValue="emit('update:modelValue', $event)"
    @cancel="onClose">
    <!-- HEADER ICON -->
    <template #header-title>
      <div class="flex justify-center w-full">
        <div class="w-33 h-33 flex items-center justify-center">
          <UnknownIcon />
        </div>
      </div>
    </template>

    <!-- HIDE CLOSE BUTTON -->
    <template #close-btn>
      <span class="hidden"></span>
    </template>

    <!-- MAIN CONTENT -->
    <div class="flex flex-col items-center p-10 gap-12 w-169.25 bg-white rounded-[40px] text-center">
      <!-- INTRO CONTENT -->
      <GameIntro v-if="introData" :title="introData.title" :description="introData.description"
        :key_points="introData.key_points" class="w-full" />

      <!-- FALLBACK -->
      <div v-else class="w-full">
        <h2 class="text-h4 leading-9 font-bold text-[#1E1E1E] mb-4">
          {{ title }}
        </h2>
        <p class="text-h5 leading-8 text-[#1E1E1E]">Selesaikan minigame!</p>
      </div>

      <!-- START BUTTON -->
      <ButtonText text="Mulai Game" @click="onStart" variant="primary" size="md">

      </ButtonText>
    </div>

    <!-- EMPTY FOOTER -->
    <template #footer />
  </UiModal>
</template>
