<script setup lang="ts">
import TaskRow from '@/components/games/AutomationSpotter/TaskRow.vue'
import SpotZones from '@/components/games/AutomationSpotter/SpotZones.vue'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useAutomationSpotter } from '@/composables/games/useAutomationSpotter'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'

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
  <BaseGame
    module-title="Explore Artificial Intelligence (AI) Tools"
    title="Automation Spotter"
    description="Masukkan kata ke dalam tempat yang benar!"
    :question="question"
    :time="time"
    :maxTime="MAX_TIME"
    :loading="gameLoading || introLoading"
    :error="gameError"
    :retryFn="() => fetchLevel(1, true)"
    v-model:showIntro="showIntro"
    :introData="introData"
    :isWin="_isWon"
    :hasLost="_isLost"
    :isChecked="isChecked"
    :currentProgress="matchedCount"
    :targetProgress="allCards.length"
    :showProgress="true"
    @start="start"
    @retry="retryGame(resetBoard)"
    @check="checkAnswers"
    @cleared="handleContinue"
    :successResult="successResultData"
  >
    <TaskRow
      v-model="sourceCards"
      :checked-map="checkedMap"
      :is-checked="isChecked"
      :disabled="isChecked"
      @moved="onMoved"
    />
    <SpotZones
      :zones="zones"
      :checked-map="checkedMap"
      :is-checked="isChecked"
      @moved="onMoved"
    />
  </BaseGame>
</template>
