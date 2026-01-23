<script setup lang="ts">
import IconButton from '@/components/IconButton.vue'
import UnknownIcon from './icons/UnknownIcon.vue';
import GameIntro from './GameIntro.vue';
import type { IntroData } from '@/types/types'

defineProps<{
  title: string
  introData?: IntroData
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'close'): void
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/50">
    <div class="flex justify-center p-4">
      <div
        class="
          flex flex-col gap-[48px]
          bg-white rounded-xl p-[40px]
          w-[800px] max-w-[90vw]
          h-auto max-h-[90vh]
          overflow-y-auto
          justify-start items-center
        "
      >
        <div>
            <UnknownIcon></UnknownIcon>
        </div>

        <!-- Pass introData to GameIntro if it exists -->
        <GameIntro
          v-if="introData"
          :title="introData.title"
          :description="introData.description"
          :key_points="introData.key_points"
        />
        
        <!-- Fallback if no introData -->
        <div v-else class="text-center">
          <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
          <p>Selesaikan minigame!</p>
        </div>

        <div class="flex">
          <IconButton
            class="px-6 py-2 bg-[#00A3B5] text-white rounded-lg"
            @click="$emit('start')"
          >
            Start Game
          </IconButton>
        </div>
      </div>
    </div>
  </div>
</template>