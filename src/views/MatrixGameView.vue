<template>
  <BaseGame title="Matrix Game" :description="survey?.title" :time="time" v-model:showIntro="showIntro"
    :introData="introData.data[5]">


    <div v-if="survey" v-for="q in survey.questions" :key="q.id" class="mb-6">
      <MatrixQuestion :title="q.label" :options="survey.options" :correct-answer="q.correctAnswer"
        :finished="isWin || isLose" v-model="answers[q.id]" :disabled="!isPlaying" />
    </div>


    <div class="flex flex-wrap items-center justify-center gap-2 p-4">
      <ButtonText @click="submit" text="Submit" :disabled="!isPlaying"></ButtonText>
      <ButtonText @click="restart" text="Restart" variant="danger" :disabled="!isLose">
      </ButtonText>
      <ButtonText @click="continueQuiz" text="Continue" color="success" :disabled="!isWin">
      </ButtonText>
    </div>

    <template #footer>
      <span></span>
    </template>
  </BaseGame>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import gameData from '@/assets/gameData/matrix_game.json'
import { UiButton } from '@/components/atoms/button'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useGameService } from '@/application'
import introData from '@/assets/gameData/intro.json'
import MatrixQuestion from '@/components/molecules/MatrixQuestion.vue'
import ButtonText from '@/components/atoms/ButtonText.vue'


type Option = { value: number; label: string }
type Question = { id: string; label: string; correctAnswer: number }
type Survey = { title: string; options: Option[]; questions: Question[] }

const survey = ref<Survey | null>(null)
const answers = ref<Record<string, number | undefined>>({})
const score = ref<number | null>(null)

const { time, _isWon, _isLost, _isPlaying, startGame, finish, reset, retry } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.matrix,
  offline: true
})

const loading = ref(false)
const error = ref<unknown>(null)
const showIntro = ref(true)

const isWin = computed(() => _isWon.value)
const isLose = computed(() => _isLost.value)
const isPlaying = computed(() => _isPlaying.value)

onMounted(async () => {
  survey.value = gameData

  // initialize answers
  survey.value.questions.forEach((q) => {
    answers.value[q.id] = undefined
  })
  await startGame()
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
    survey.value.questions.map(q => ({
      questionId: q.id,
      answer: answers.value[q.id]
    }))
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
