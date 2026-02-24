<template>
  <BaseGame
    title="Matrix Game"
    :description="survey?.title"
    :time="time"
    v-model:showIntro="showIntro"
    :introData="introData.data[5]"
    :loading="loading"
    :error="error"
    :retryFn="retryGame"
  >
    <div class="flex flex-col items-center justify-center gap-[32px]">
      <div v-if="survey">
        <div
          v-for="q in survey.questions"
          :key="q.id"
          class="flex flex-col items-center justify-center gap-[28px] mb-4"
        >
          <MatrixQuestion
            :title="q.label"
            :options="survey.options"
            :correct-answer="q.correctAnswer"
            :finished="isWin || isLose"
            v-model="answers[q.id]"
            :disabled="!isPlaying"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-4.5">
        <UiButton @click="submit" text="Submit" :disabled="!isPlaying"></UiButton>
        <UiButton @click="restart" text="Restart" variant="danger" :disabled="!isLose"> </UiButton>
        <UiButton @click="continueQuiz" text="Continue" color="success" :disabled="!isWin">
        </UiButton>
      </div>
    </div>

    <template #footer>
      <span></span>
    </template>
  </BaseGame>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import gameData from '@/assets/gameData/matrix_game.json'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useGameService } from '@/application'
import introData from '@/assets/gameData/intro.json'
import MatrixQuestion from '@/components/molecules/MatrixQuestion.vue'
import { UiButton } from '@/components/atoms/button'

type Option = { value: number; label: string }
type Question = { id: string; label: string; correctAnswer: number }
type Survey = { title: string; options: Option[]; questions: Question[] }

const survey = ref<Survey | null>(null)
const answers = ref<Record<string, number | undefined>>({})
const score = ref<number | null>(null)

const { time, _isWon, _isLost, _isPlaying, startGame, finish, retry } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.matrix,
  offline: true,
})

const loading = ref(true)
const error = ref<unknown>(null)
const showIntro = ref(true)

const isWin = computed(() => _isWon.value)
const isLose = computed(() => _isLost.value)
const isPlaying = computed(() => _isPlaying.value)

// Fetch game data and start game
async function initializeGame() {
  loading.value = true
  error.value = null

  try {
    if (survey.value) {
      // initialize answers
      survey.value.questions.forEach((q) => {
        answers.value[q.id] = undefined
      })
    }
    await startGame()
  } catch (err) {
    error.value = err
    console.error('Failed to initialize game', err)
  } finally {
    loading.value = false
  }
}

// Retry function for error state
function retryGame() {
  initializeGame()
}

onMounted(async () => {
  survey.value = gameData
  await initializeGame()
})

const submit = async () => {
  if (!survey.value) return

  let correct = 0

  survey.value.questions.forEach((q) => {
    if (answers.value[q.id] === q.correctAnswer) correct++
  })

  score.value = correct

  const won = correct === survey.value.questions.length

  await finish(
    won,
    survey.value.questions.map((q) => ({
      questionId: q.id,
      answer: answers.value[q.id],
    })),
  )
}

const restart = async () => {
  if (!survey.value) return
  survey.value.questions.forEach((q) => {
    answers.value[q.id] = undefined
  })
  score.value = null
  await retry()
}

const continueQuiz = () => {
  alert('Continue to next step')
}
</script>
