<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { GameHeader, GameFooter, GameState, TopNavigation } from '@/components/molecules'
import { GameOverlayManager } from '@/views/Modal'
import type { IntroData, SuccessResultData } from '@/domain/types'
import Background from '@/assets/img/bg.jpg'

/**
 * BaseGame Component Props
 * Base template component for all game views
 */
interface BaseGameProps {
  /** Module/category title displayed in the top action bar */
  moduleTitle?: string
  /** Game title displayed in the header */
  title: string
  /** Game description/instructions */
  description?: string
  /** Current question or prompt to display */
  question?: string
  /** Current time remaining in seconds */
  time: number
  /** Maximum time allowed in seconds (default: 180) */
  maxTime?: number
  /** Whether the game is currently loading */
  loading?: boolean
  /** Error object if game failed to load */
  error?: unknown
  /** Function to call when retry button is clicked */
  retryFn?: () => void
  /** Whether to show the intro modal */
  showIntro?: boolean
  showResult?: boolean
  /** Data for the intro modal */
  introData?: IntroData
  /** Current progress value (for progress bar) */
  currentProgress?: number
  /** Target progress value (for progress bar) */
  targetProgress?: number
  /** Whether to show the progress bar */
  showProgress?: boolean
  showSummary?: boolean
  /** Result summary data */
  resultSummary?: any
  /** Success result data provided by game service */
  successResult?: SuccessResultData | null
  /** Whether the game has been checked/submitted */
  isChecked?: boolean
  /** Whether the player won the game */
  isWin?: boolean
  /** Whether the player lost the game */
  hasLost?: boolean
  /** Whether to hide the submit/check button */
  hideSubmit?: boolean
  /** Custom time formatter function */
  formatTime?: (seconds: number) => string
}

const props = withDefaults(defineProps<BaseGameProps>(), {
  description: '',
  maxTime: 180,
  loading: false,
  showIntro: false,
  showResult: false,
  showProgress: false,
  isChecked: false,
  isWin: false,
  hasLost: false,
  hideSubmit: false,
  successResult: null,
})

const emit = defineEmits<{
  (e: 'check'): void
  (e: 'retry'): void
  (e: 'cleared'): void
  (e: 'start'): void
  (e: 'update:showIntro', value: boolean): void
  (e: 'update:showResult', value: boolean): void
  (e: 'update:showSummary', value: boolean): void
  (e: 'toggle-summary'): void
}>()

// Local control for showing result modal when game is checked
const showResultLocal = ref<boolean>(props.showResult ?? false)
const showSummaryLocal = ref<boolean>(props.showSummary ?? false)

function handleStart() {
  emit('update:showIntro', false)
  emit('start')
}

function handleRetry() {
  showResultLocal.value = false
  emit('retry')
}

function handleCleared() {
  showResultLocal.value = false
  emit('cleared')
}

const gameWrapper = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

function toggleFullscreen() {
  const el = gameWrapper.value
  if (!el) return
  if (!document.fullscreenElement) {
    el.requestFullscreen().catch(err => console.warn('Fullscreen failed', err))
  } else {
    document.exitFullscreen()
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

function handleOpenResult() {
  showResultLocal.value = true
}

function handleViewSummary() {
  if (showSummaryLocal.value) {
    showSummaryLocal.value = false
    showResultLocal.value = false
  } else {
    showResultLocal.value = false
    showSummaryLocal.value = true
  }
  emit('toggle-summary')
}

function handleCheck() {
  emit('check')
}
</script>

<template>
  <GameState :loading="loading" :error="error" :retryFn="retryFn">
    <div ref="gameWrapper" class="min-h-screen flex flex-col p-4 gap-4 2xl:py-6 2xl:px-9.5 2xl:gap-8 w-full" :style="{
      backgroundImage: `url(${Background})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }">
      <TopNavigation :text="moduleTitle" :is-intro="showIntro" class="z-60" @toggle-fullscreen="toggleFullscreen"
        @toggle-summary="handleViewSummary" :current="currentProgress" :target="targetProgress" :isChecked="isChecked"
        :isWin="isWin" :isShown="showSummaryLocal" />

      <div class="flex-1 flex flex-col relative">
        <GameOverlayManager :show-intro="showIntro" :show-result="showResultLocal" :show-summary="showSummaryLocal"
          :title="title" :intro-data="introData" :is-win="isWin" :success-result="successResult"
          @update:show-intro="emit('update:showIntro', $event)" @update:show-result="showResultLocal = $event"
          @update:show-summary="showSummaryLocal = $event" @start="handleStart" @retry="handleRetry"
          @cleared="handleCleared" @toggle-summary="handleViewSummary" />

        <div v-if="!showIntro && !showResultLocal && !showSummaryLocal"
          class="border-[3px] md:border-[6px] border-primary-700 flex flex-col items-center gap-6 md:gap-8 w-full max-w-full p-4 md:p-5 rounded-[24px] md:rounded-[36px] bg-white shadow-xl shadow-primary-700">
          <slot name="header">
            <GameHeader :title="title" :description="description" :question="question" :time="time" />
          </slot>

          <slot />

          <slot name="footer" :onCheck="handleCheck" :onRetry="handleRetry" :onCleared="handleCleared"
            :onOpenResult="handleOpenResult">
            <GameFooter :current="currentProgress" :target="targetProgress" :showProgress="showProgress"
              :isChecked="isChecked" :isWin="isWin" :hasLost="hasLost" :hideSubmit="hideSubmit" @check="handleCheck"
              @retry="handleRetry" @cleared="handleCleared" @open-result="handleOpenResult">
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
