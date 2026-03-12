<script setup lang="ts">
import { watch } from 'vue'
import MemoryCardItem from './components/MemoryCardItem.vue'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { UiButton } from '@/components/atoms'
import { useGameViewContext } from '@/composables/useGameViewContext'
import { useMemoryGame } from './composables/useMemoryGame'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'
import type { MemoryCard } from '@/domain/types'

// Game UI Context
const { buttonSize, playClick } = useGameViewContext()

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
  fetchLevel,
  scoringStrategy: 'memory-game',
})

// Watch for win condition
watch(isAllMatched, async (matched) => {
  if (matched && !isWon.value && !isLost.value) {
    await finishGame(true, {
      scoreContext: {
        attempts: turns.value,
        timeUsed: MAX_TIME - time.value,
      }
    })
  }
})

watch(turns, async (turn) => {
  if (turn > 30 && !isWon.value && !isLost.value) {
    await finishGame(false, {
      scoreContext: {
        attempts: turns.value,
        timeUsed: MAX_TIME,
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
</script>

<template>
  <BaseGame
module-title="Explore Artificial Intelligence (AI) Tools"
:title="'Memory Game'"
    :description="'Pasangkan kartu dengan deskripsi yang benar!'"
:time="time"
:maxTime="MAX_TIME"
    :loading="baseLoading || introLoading || gameLoading"
:error="error || gameError"
    :retryFn="() => fetchLevel(1, true)"
v-model:showIntro="showIntro"
:introData="introData"
:isWin="isWon"
    :hasLost="isLost"
:hideSubmit="true"
:isChecked="isAllMatched"
:successResult="successResultData"
@start="start"
    @retry="retryGame(resetGame)"
@cleared="handleContinue">
    <div class="flex flex-wrap justify-center gap-4.5 max-w-screen-3xl mx-auto basis-1/5">
      <MemoryCardItem
v-for="card in cards"
:key="card.id"
:content-type="card.contentType"
        :logo="card.contentType === 'svg' ? card.value : undefined"
        :text="card.contentType === 'text' || card.contentType === 'img' ? card.value : undefined"
        :flipped="card.flipped || false"
:matched="card.matched || false"
@click="handleFlip(card)" />
    </div>
    <template #footer="{ onOpenResult }">
      <div class="flex flex-col xs:flex-row justify-between w-full items-center">
        <span class="text-body-xs xl:text-body-md text-primary-700 font-bold w-full">
          Card Turns: {{ turns }}
        </span>
        <UiButton
v-if="isAllMatched || time <= 0"
:size="buttonSize"
text="Continue"
variant="primary"
          @click="onOpenResult">
        </UiButton>
      </div>
    </template>
  </BaseGame>
</template>
