<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, type Slot } from 'vue'
import GameHeader from '@/components/molecules/GameHeader.vue'
import GameFooter from '@/components/molecules/GameFooter.vue'
import GameIntroModal from '@/components/molecules/GameIntroModal.vue'
import GameState from '@/components/molecules/GameState.vue'
import type { FailureResultData, IntroData, SuccessResultData } from '@/domain/types'
import TopActionBar from '../atoms/TopActionBar.vue'
import Background from '@/assets/img/bg.jpg'
import GameResultModal from '../molecules/GameResultModal.vue'
import GameResultSummaryModal from '../molecules/GameResultSummaryModal.vue'

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
  successResult?: SuccessResultData
  failureResult?: FailureResultData
  /** Current progress value (for progress bar) */
  currentProgress?: number
  /** Target progress value (for progress bar) */
  targetProgress?: number
  /** Whether to show the progress bar */
  showProgress?: boolean
  showSummary?: boolean
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
  /** Custom slots configuration */
  slots?: {
    header?: Slot
    default?: Slot
    footer?: Slot
  }
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
})

// Local control for showing result modal when game is checked
const showResultLocal = ref<boolean>(props.showResult ?? false)

watch(() => props.isChecked, (val) => {
  if (val) showResultLocal.value = true
})

const emit = defineEmits<{
  /** Emit when check/submit button is clicked */
  (e: 'check'): void
  /** Emit when retry button is clicked */
  (e: 'retry'): void
  /** Emit when game is cleared/completed */
  (e: 'cleared'): void
  /** Emit when game starts (after intro) */
  (e: 'start'): void
  /** Emit when intro visibility should change */
  (e: 'update:showIntro', value: boolean): void
}>()

/**
 * Handle start button click
 * Closes intro modal and emits start event
 */
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

/**
 * Toggle fullscreen mode for the game wrapper
 */
function toggleFullscreen() {
  const el = gameWrapper.value
  if (!el) return

  if (!document.fullscreenElement) {
    el.requestFullscreen().catch((err) => {
      console.warn('Failed to enter fullscreen:', err)
    })
  } else {
    document.exitFullscreen()
  }
}

/**
 * Handle fullscreen change event
 */
function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})



</script>

<template>
  <GameState :loading="loading" :error="error" :retryFn="retryFn">
    <div ref="gameWrapper" class="min-h-screen flex flex-col p-4 gap-4 2xl:py-6 2xl:px-9.5 2xl:gap-8 w-full" :style="{
      backgroundImage: `url(${Background})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }">
      <!-- Topbar (always visible) -->
      <TopActionBar :text="moduleTitle" class="z-60" @toggle-fullscreen="toggleFullscreen" :current="currentProgress"
        :target="targetProgress" :isChecked="isChecked" />

      <!-- Content Area -->
      <div class="flex-1 flex flex-col relative">

        <!-- Intro Modal -->
        <GameIntroModal v-if="showIntro && introData" :modelValue="showIntro"
          @update:modelValue="emit('update:showIntro', $event)" :title="title" :introData="introData"
          @start="handleStart" containerPosition="relative" />

        <GameResultModal v-else-if="showResultLocal" :success="isWin" :successResult="successResult"
          :failureResult="failureResult" v-model:modelValue="showResultLocal" @continue="handleCleared"
          @retry="handleRetry" containerPosition="relative" />

        <GameResultSummaryModal v-else-if="props.showSummary" :resultSummary="props.resultSummary"
          v-model:modelValue="props.showSummary" containerPosition="relative" @ />

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
