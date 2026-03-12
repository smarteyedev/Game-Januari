<script setup lang="ts">
import TaskRow from '@/components/organisms/AutomationSpotter/TaskRow.vue'
import DropZone from '@/components/organisms/AutomationSpotter/DropZone.vue'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useGameViewContext } from '@/composables/useGameViewContext'
import { useAutomationSpotter } from '@/composables/games/useAutomationSpotter'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'
import type { DragCard } from '@/domain'

interface Zone {
  id: boolean
  label: string
  cards: DragCard[]
}

const _ = defineProps<{
  zones: Zone[]
  checkedMap: Record<number, boolean>
  isChecked: boolean
}>()

// Game UI Context
const { playClick } = useGameViewContext()

// Game Logic Composable
const {
  allCards,
  sourceCards,
  zones,
  checkedMap,
  isChecked,
  question,
  matchedCount,
  fetchLevel,
  onMoved,
  checkAnswers: gameCheckAnswers,
  resetBoard
} = useAutomationSpotter()

// Game Meta State
const SCORING_TIME_TOLERANCE = 30
const answerWeight = 0.7
const timeWeight = 0.3
const MAX_TIME = 180

const {
  time,
  _isWon,
  _isLost,
  showIntro,
  introData,
  introLoading,
  gameLoading,
  gameError,
  successResultData,
  start,
  retryGame,
  finishGame
} = useBaseGameLogic({
  maxTime: MAX_TIME,
  minigameId: MINIGAME_IDS.automationSpotter,
  offline: true,
  scoringParams: {
    timeTolerance: SCORING_TIME_TOLERANCE,
    answerWeight,
    timeWeight
  },
  fetchLevel
})

// Check answers
async function checkAnswers() {
  playClick()
  const result = gameCheckAnswers()

  if (result.isPerfect) {
    await finishGame(true, {
      scoreContext: {
        total: result.totalCount,
        correct: result.correctCount,
      }
    })
  } else {
    await finishGame(false)
  }
}

function handleContinue() {
  emit('cleared')
}

// Emit
const emit = defineEmits<{
  (e: 'cleared'): void
}>()
</script>

<template>
  <BaseGame module-title="Explore Artificial Intelligence (AI) Tools" title="Automation Spotter"
    description="Masukkan kata ke dalam tempat yang benar!" :question="question" :time="time" :maxTime="MAX_TIME"
    :loading="gameLoading || introLoading" :error="gameError" :retryFn="() => fetchLevel(1, true)"
    v-model:showIntro="showIntro" :introData="introData" :isWin="_isWon" :hasLost="_isLost" :isChecked="isChecked"
    :currentProgress="matchedCount" :targetProgress="allCards.length" :showProgress="true" @start="start"
    @retry="retryGame(resetBoard)" @check="checkAnswers" @cleared="handleContinue" :successResult="successResultData">
    <TaskRow v-model="sourceCards" :checked-map="checkedMap" :is-checked="isChecked" :disabled="isChecked"
      @moved="onMoved" />
    <div class="flex flex-col md:flex-row w-full gap-2.5 md:gap-5 xl:gap-8">
      <DropZone v-for="zone in zones" :key="String(zone.id)" :id="String(zone.id)" :text="zone.label"
        v-model="zone.cards" :checked-map="checkedMap" :is-checked="isChecked" :disabled="isChecked" :className="zone.id ? 'bg-green-100 flex-1 text-primary-500' : 'bg-red-100  flex-1 text-[#DA4A4A]'
          " @moved="onMoved($event)" />
    </div>
  </BaseGame>
</template>
