<template>
  <BaseGame v-if="survey" title="Matrix Game" module-title="Lorem Ipsum" :description="survey?.title" :time="time"
    v-model:showIntro="showIntro" :introData="introData.data[5]" :loading="loading" :error="error" :retryFn="retryGame">

    <div class="flex flex-col w-full">
      <div v-for="q in survey.questions" :key="q.id" class="flex flex-col items-center justify-center gap-5 md:gap-8">
        <MatrixQuestion :title="q.label" :options="survey.options" :correct-answer="q.correctAnswer"
          :finished="isWin || isLose" v-model="answers[q.id]" :disabled="!isPlaying" />
      </div>
    </div>


    <template #footer>
      <div class="flex flex-wrap items-center justify-center gap-4.5">
        <UiButton :size="buttonSize" @click="submit" text="Submit" :disabled="!isPlaying"></UiButton>
        <UiButton :size="buttonSize" @click="restart" text="Restart" variant="danger" :disabled="!isLose"> </UiButton>
        <UiButton :size="buttonSize" @click="continueQuiz" text="Continue" color="success" :disabled="!isWin">
        </UiButton>
      </div>
    </template>
  </BaseGame>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { levelRepository } from '@/infrastructure'
import { MINIGAME_IDS, MinigameId } from '@/utils/constants'
import BaseGame from '@/components/templates/BaseGame.vue'
import { useGameService } from '@/application'
import introData from '@/assets/gameData/intro.json'
import MatrixQuestion from '@/components/molecules/MatrixQuestion.vue'
import { UiButton } from '@/components/atoms/button'
import { useBreakpoint } from '@/composables/useBreakpoint'

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

const { isXs, isSm, isMd } = useBreakpoint()

const buttonSize = computed(() => {
  if (isXs.value) return 'xs'
  if (isSm.value) return 'sm'
  if (isMd.value) return 'md'
  return 'xl'
})

// Fetch game data and start game
async function initializeGame() {
  loading.value = true
  error.value = null

  try {
    if (survey.value && survey.value.questions) {
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
  const raw = await levelRepository.getLevel<any>(MinigameId.Matrix, 1, true)
  const data: any = raw as any

  // Transform the new JSON structure to the expected format
  // New format has content.options and content.subquestions
  if (data && data.content && data.content.options && data.content.subquestions) {
    survey.value = {
      title: data.content.question || data.intro?.title || '',
      options: data.content.options.map((opt: { id: number; label: string }) => ({
        value: opt.id,
        label: opt.label
      })),
      questions: data.content.subquestions.map((sq: { id: number; label: string; answer: number }) => ({
        id: String(sq.id),
        label: sq.label,
        correctAnswer: sq.answer
      }))
    }
  } else if (data && data.options && data.questions) {
    // Old format - use directly
    survey.value = data
  } else {
    // Handle case where data might be empty or malformed
    console.error('Unexpected data format:', data)
    survey.value = null
  }

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
