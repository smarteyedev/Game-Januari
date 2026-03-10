<script setup lang="ts">
import { computed, watch } from 'vue'
import MemoryBoard from '@/components/organisms/MemoryGame/MemoryBoard.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { UiButton } from '@/components/atoms/button'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useMemoryGame } from '@/composables/games/useMemoryGame'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'
import type { MemoryCard } from '@/domain/types'

// Game Logic Composable
const {
  cards,
  turns,
  loading: gameLoading,
  error,
  isAllMatched,
  fetchLevel,
  flipCard: gameFlipCard,
  reset: resetGame
} = useMemoryGame()

// Audio
const audio = new Audio(clickSound)

function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => { })
  }
}

const MAX_TIME = 180

const {
  time,
  isWon,
  isLost,
  showIntro,
  introData,
  introLoading,
  gameLoading: baseLoading,
  gameError,
  successResultData,
  start,
  retryGame,
  finishGame
} = useBaseGameLogic({
  maxTime: MAX_TIME,
  minigameId: MINIGAME_IDS.memory,
  offline: true,
  introId: 2,
  fetchLevel
})

// Watch for win condition
watch(isAllMatched, async (matched) => {
  if (matched && !isWon.value && !isLost.value) {
    const totalPairs = cards.value.length / 2
    const scoringAttempts = Math.max(0, (turns.value / 2) - 5) // 5 free attempts

    await finishGame(true, {
      scoreContext: {
        total: totalPairs,
        correct: totalPairs,
        attempts: scoringAttempts,
      }
    })
  }
})

// Card flip handler
function handleFlip(card: MemoryCard) {
  if (isWon.value || isLost.value) return
  playClick()
  gameFlipCard(card)
}

// Emit for session tracking
const emit = defineEmits<{
  (e: 'cleared'): void
  (e: 'open-result'): void
}>()

function handleContinue() {
  emit('cleared')
}

const { isXs, isSm, isMd } = useBreakpoint()

const buttonSize = computed(() => {
  if (isXs.value) return 'xs'
  if (isSm.value) return 'sm'
  if (isMd.value) return 'md'
  return 'xl'
})
</script>

<template>
  <BaseGame module-title="Explore Artificial Intelligence (AI) Tools" :title="'Memory Game'"
    :description="'Pasangkan kartu dengan deskripsi yang benar!'" :time="time" :maxTime="MAX_TIME"
    :loading="baseLoading || introLoading || gameLoading" :error="error || gameError"
    :retryFn="() => fetchLevel(1, true)" v-model:showIntro="showIntro" :introData="introData" :isWin="isWon"
    :hasLost="isLost" :hideSubmit="true" :isChecked="isAllMatched" :successResult="successResultData" @start="start"
    @retry="retryGame(resetGame)" @cleared="handleContinue">
    <MemoryBoard :cards="cards" @flip="handleFlip" />
    <template #footer="{ onOpenResult }">
      <div class="flex flex-col xs:flex-row justify-between w-full items-center">
        <span class="text-body-xs xl:text-body-md text-primary-700 font-bold w-full">
          Card Turns: {{ turns }}
        </span>
        <UiButton v-if="isAllMatched || time <= 0" :size="buttonSize" text="Continue" variant="primary"
          @click="onOpenResult">
        </UiButton>
      </div>
    </template>
  </BaseGame>
</template>
