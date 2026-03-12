<script setup lang="ts">
import { useTemplateRef, nextTick } from 'vue'
import { BoxInput, CharacterKey, UiButton } from '@/components/atoms'
import { MINIGAME_IDS } from '@/utils/constants'
import BaseGame from '@/components/templates/BaseGame.vue'
import { useGameViewContext } from '@/composables/useGameViewContext'
import { useScramblesGame } from './composables/useScramblesGame'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'

// Game UI Context
const { buttonSize, playClick, isXs } = useGameViewContext()

// Game Logic Composable
const {
  question,
  userInput,
  submissions,
  hints,
  attempts,
  maxAttempts,
  answerChars,
  isChecked,
  loading: gameLoading,
  error,
  fetchLevel,
  onCharInput: gameOnCharInput,
  deleteChar: gameDeleteChar,
  submitAnswer: gameSubmitAnswer,
  resetBoard,
  isCharDisabled
} = useScramblesGame()

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
  finishGame
} = useBaseGameLogic({
  maxTime: MAX_TIME,
  minigameId: MINIGAME_IDS.scrambles,
  offline: true,
  introId: 4,
  fetchLevel
})

function onCharInput(char: string) {
  playClick()
  gameOnCharInput(char)
}

function deleteChar() {
  playClick()
  gameDeleteChar()
}

const scrollContainer = useTemplateRef('scrollContainer')

// Submit answer
async function submitAnswer() {
  playClick()
  const result = gameSubmitAnswer()

  nextTick(() => {
    scrollContainer.value?.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: 'smooth',
    })
  })

  if (result.gameOver) {
    const attemptsUsed = maxAttempts.value - attempts.value + (result.win ? 1 : 0)
    await finishGame(result.win || false, {
      scoreContext: {
        total: 1,
        correct: result.win ? 1 : 0,
        attempts: attemptsUsed,
      }
    })
  }
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
title="Scrambles Game"
moduleTitle="Explore Artificial Intelligence (AI) Tools"
:description="question"
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
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-3 md:gap-5 justify-center items-center">
        <BoxInput
:value="userInput"
:locked="hints" />
        <span class="text-primary-700 font-semibold text-body-xs md:text-body-md">You have {{ attempts }} attempts
          left</span>
      </div>

      <div
ref="scrollContainer"
class="h-35 overflow-y-auto">
        <div class="flex flex-col justify-center items-center gap-6 py-3">
          <div
v-for="(s, i) in submissions"
:key="i"
class="flex w-full items-center justify-center gap-1.5 md:gap-5">
            <div
v-for="(char, j) in s.value.split('')"
:key="j"
              class="aspect-square min-w-8 min-h-8 md:min-w-12 md:min-h-12 grid place-items-center border-2 md:border-[3px] rounded-xl md:rounded-3xl shadow-xl text-body-xl md:text-h3 font-bold select-none transition-all"
              :class="{
                'bg-green-50 text-primary-500 border-tosca-700 shadow-tosca-700': s.correct,
                'bg-gray-100 text-gray-400 border-gray-400 shadow-gray-400': !s.correct,
              }">
              {{ char }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center items-center gap-3 md:gap-5">
        <CharacterKey
v-for="{ c, i } in answerChars"
:key="`${c}-${i}`"
:char="c"
          :disabled="isCharDisabled(c) || !isPlaying"
@input="onCharInput" />
      </div>
    </div>

    <template #footer="{ onOpenResult }">
      <div
v-if="!isXs"
class="flex gap-2.5">
        <UiButton
:size="buttonSize"
text="Delete"
variant="danger"
@click="deleteChar"
:disabled="!isPlaying">
        </UiButton>
        <UiButton
:size="buttonSize"
text="Submit"
@click="submitAnswer"
:disabled="!isPlaying">
        </UiButton>

        <UiButton
:size="buttonSize"
text="Continue"
v-if="isWon || isLost"
          @click="() => onOpenResult && onOpenResult()">
        </UiButton>
      </div>
      <div
v-else
class="flex flex-col gap-2.5 w-full justify-center items-center">
        <div class="flex gap-2.5 w-full justify-center items-center">
          <UiButton
class="w-full"
:size="buttonSize"
text="Delete"
variant="danger"
@click="deleteChar"
            :disabled="!isPlaying">
          </UiButton>
          <UiButton
class="w-full"
:size="buttonSize"
text="Submit"
@click="submitAnswer"
:disabled="!isPlaying">
          </UiButton>
        </div>
        <div class="flex w-full justify-center items-center">
          <UiButton
class="w-full"
:size="buttonSize"
text="Continue"
v-if="isWon || isLost"
            @click="() => onOpenResult && onOpenResult()">
          </UiButton>
        </div>
      </div>
    </template>
  </BaseGame>
</template>
