<script setup lang="ts">
import { type Slot } from 'vue'
import GameHeader from '@/components/molecules/GameHeader.vue'
import GameFooter from '@/components/molecules/GameFooter.vue'
import GameIntroModal from '@/components/molecules/GameIntroModal.vue'
import GameState from '@/components/molecules/GameState.vue'
import type { IntroData } from '@/domain/types'
import { toTimeMmss } from '@/utils/string'
import DisplayLabel from '../atoms/DisplayLabel.vue'
import Background from '@/assets/img/bg.jpg'

interface BaseGameProps {
  /** Game title */
  moduleTitle?: string
  /** Game title */
  title: string
  /** Game description */
  description?: string
  /** Game description */
  question?: string
  /** Current time in seconds */
  time: number
  /** Maximum time in seconds */
  maxTime?: number
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: unknown
  /** Retry function for error state */
  retryFn?: () => void
  /** Whether the intro modal should show */
  showIntro?: boolean
  /** Intro modal data */
  introData?: IntroData
  /** Current progress value */
  currentProgress?: number
  /** Target progress value */
  targetProgress?: number
  /** Whether to show progress bar */
  showProgress?: boolean
  /** Whether the game is checked/done */
  isChecked?: boolean
  /** Whether the game is won */
  isWin?: boolean
  /** Whether the game is lost */
  hasLost?: boolean
  /** Whether to hide submit button */
  hideSubmit?: boolean
  /** Function to format time display */
  formatTime?: (seconds: number) => string
  /** Custom slots configuration */
  slots?: {
    header?: Slot
    default?: Slot
    footer?: Slot
  }
}

withDefaults(defineProps<BaseGameProps>(), {
  description: '',
  maxTime: 180,
  loading: false,
  showIntro: false,
  showProgress: false,
  isChecked: false,
  isWin: false,
  hasLost: false,
  hideSubmit: false,
  formatTime: (s: number) => toTimeMmss(s),
})

const emit = defineEmits<{
  (e: 'check'): void
  (e: 'retry'): void
  (e: 'cleared'): void
  (e: 'start'): void
  (e: 'update:showIntro', value: boolean): void
}>()

function handleStart() {
  emit('update:showIntro', false)
  emit('start')
}



</script>

<template>
  <GameState :loading="loading" :error="error" :retryFn="retryFn">
    <div class="min-h-screen flex flex-col p-2 gap-4 w-full" :style="{
      backgroundImage: `url(${Background})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }">
      <!-- Topbar (always visible) -->
      <DisplayLabel v-if="moduleTitle" :text="moduleTitle" class="z-60" />

      <!-- Content Area -->
      <div class="flex-1 flex flex-col relative">
        <!-- Intro Modal -->
        <GameIntroModal v-if="showIntro && introData" :modelValue="showIntro"
          @update:modelValue="emit('update:showIntro', $event)" :title="title" :introData="introData"
          @start="handleStart" containerPosition="relative" />

        <!-- Game Content -->
        <div v-else
          class="border-[3px] md:border-[6px] border-primary-700 flex flex-col items-center gap-6 md:gap-8 w-full max-w-full p-4 md:p-5 rounded-[24px] md:rounded-[36px] bg-white shadow-xl shadow-primary-700">
          <slot name="header">
            <GameHeader :title="title" :description="description" :question="question" :time="time" />
          </slot>

          <slot />

          <slot name="footer">
            <GameFooter :current="currentProgress" :target="targetProgress" :showProgress="showProgress"
              :isChecked="isChecked" :isWin="isWin" :hasLost="hasLost" :hideSubmit="hideSubmit" @check="emit('check')"
              @retry="emit('retry')" @cleared="emit('cleared')">
              <template #footer-left>
                <slot name="footer-left" />
              </template>

              <template #footer-right>
                <slot name="footer-right" />
              </template>
            </GameFooter>
          </slot>
        </div>
      </div>
    </div>
  </GameState>
</template>
