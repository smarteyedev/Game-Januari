<script setup lang="ts">
import { MINIGAME_IDS } from '@/utils/constants'
import BaseGame from '@/components/templates/BaseGame.vue'
import MatrixQuestion from './components/MatrixQuestion.vue'
import { UiButton } from '@/components/atoms'
import { useGameViewContext } from '@/composables/useGameViewContext'
import { useMatrixGame } from './composables/useMatrixGame'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'

// Game UI Context
const { buttonSize, playClick, isXs } = useGameViewContext()

// Game Logic Composable
const {
  options,
  questions,
  answers,
  title: gameTitle,
  isChecked,
  loading: gameLoading,
  error,
  fetchLevel,
  checkAnswers: gameCheckAnswers,
  resetBoard
} = useMatrixGame()

const MAX_TIME = 180

const {
  time,
  isWon,
  isLost,
  isPlaying,
  showIntro,
  introData,
  introLoading,
  gameLoading: baseLoading,
  gameError,
  successResultData,
  start,
  retryGame,
  finishGame,
  attempts
} = useBaseGameLogic({
  maxTime: MAX_TIME,
  minigameId: MINIGAME_IDS.matrix,
  offline: true,
  introId: 5,
  fetchLevel
})

// Submit answers
async function submit() {
  playClick()
  const result = gameCheckAnswers()

  await finishGame(result.won, {
    answers: result.responses,
    scoreContext: {
      total: result.totalCount,
      correct: result.correctCount,
      attempts: attempts.value,
    }
  })
}

const emit = defineEmits<{
  (e: 'cleared'): void
}>()

function handleContinue() {
  emit('cleared')
}
</script>

<template>
  <BaseGame
title="Matrix Game"
module-title="Explore Artificial Intelligence (AI) Tools"
:description="gameTitle"
    :time="time"
:maxTime="MAX_TIME"
v-model:showIntro="showIntro"
:introData="introData"
    :loading="baseLoading || introLoading || gameLoading"
:error="error || gameError"
    :retryFn="() => fetchLevel(1, true)"
:isWin="isWon"
:hasLost="isLost"
:isChecked="isChecked"
    :successResult="successResultData"
@start="start"
@retry="retryGame(resetBoard)"
@cleared="handleContinue">
    <div class="flex flex-col w-full">
      <div
v-for="q in questions"
:key="q.id"
class="flex flex-col items-center justify-center gap-5 md:gap-8">
        <MatrixQuestion
:title="q.label"
:options="options"
:correct-answer="q.correctAnswer"
          :finished="isWon || isLost"
v-model="answers[q.id]"
:disabled="!isPlaying" />
      </div>
    </div>

    <template #footer="{ onOpenResult }">
      <div
v-if="!isXs"
class="flex flex-wrap items-center justify-center gap-4">
        <UiButton
:size="buttonSize"
@click="submit"
text="Submit"
:disabled="!isPlaying"></UiButton>
        <UiButton
:size="buttonSize"
@click="() => onOpenResult && onOpenResult()"
text="Continue"
color="success"
          v-if="isWon || isLost">
        </UiButton>
      </div>
      <div
v-else
class="flex flex-col items-center justify-center gap-4 w-full">
        <div class="flex gap-2.5 items-center justify-center w-full">
          <UiButton
:size="buttonSize"
@click="submit"
text="Submit"
:disabled="!isPlaying"
class="w-full"></UiButton>
        </div>
        <div class="flex gap-2.5 items-center justify-center w-full">
          <UiButton
:size="buttonSize"
@click="() => onOpenResult && onOpenResult()"
text="Continue"
color="success"
            class="w-full"
v-if="isWon || isLost">
          </UiButton>
        </div>
      </div>
    </template>
  </BaseGame>
</template>
