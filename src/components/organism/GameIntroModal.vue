<script setup lang="ts">
import UiModal from '@/components/molecules/modal/index.vue'
import UnknownIcon from '../icons/UnknownIcon.vue'
import GameIntro from '../molecules/GameIntro.vue'
import type { IntroData } from '@/types/types'
import { UiButton } from '../atoms/button'

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
  <UiModal :modelValue="modelValue" size="md" position="center" :overlay="true" :prevent-close="false"
    scroll-mode="modal" @update:modelValue="emit('update:modelValue', $event)" @cancel="onClose">
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
    <div class="
        flex flex-col items-center
        p-10 gap-12
        w-169.25
        bg-white
        rounded-[40px]
        text-center
      ">
      <!-- INTRO CONTENT -->
      <GameIntro v-if="introData" :title="introData.title" :description="introData.description"
        :key_points="introData.key_points" class="w-full" />

      <!-- FALLBACK -->
      <div v-else class="w-full">
        <h2 class="
            text-[28px] leading-9
            font-bold
            text-[#1E1E1E]
            mb-4
          ">
          {{ title }}
        </h2>
        <p class="
            text-[24px] leading-8
            text-[#1E1E1E]
          ">
          Selesaikan minigame!
        </p>
      </div>

      <!-- START BUTTON -->
      <UiButton @click="onStart" class="
          flex flex-row items-center justify-center
          px-4 py-2.5 gap-0.5
          w-41 min-w-32 h-14
          bg-[#00A3B5]
          rounded-[10px]
          text-white
          text-[18px] leading-7
          font-medium
        ">
        Start Game
      </UiButton>
    </div>

    <!-- EMPTY FOOTER -->
    <template #footer />
  </UiModal>
</template>
