<template>
  <div class="p-4">
    <UiLabel :label="survey?.title" />

    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="p-3"></th>
          <th
v-for="o in survey?.options"
:key="o.value"
class="p-3 text-center">
            <UiLabel :label="o.label" />
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
v-for="q in survey?.questions"
:key="q.id"
class="border-t">
          <td class="p-3 text-left whitespace-nowrap">
            <UiLabel :label="q.label" />
          </td>

          <td
v-for="o in survey?.options"
:key="o.value"
class="p-3 text-center">
            <UiRadio
              v-model="answers[q.id]"
              :value="o.value"
              :class="radioClass(q, o)"
              :disabled="score !== null"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex gap-2 p-4">
      <UiButton
@click="submit"
class="flex items-center p-2 rounded-sm">Submit</UiButton>
      <UiButton
        @click="restart"
        class="flex items-center p-2 rounded-sm"
        color="error"
        :disabled="!finished"
        >Restart
      </UiButton>
      <UiButton
        @click="continueQuiz"
        class="flex items-center p-2 rounded-sm"
        color="success"
        :disabled="!finished"
      >
        Continue</UiButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { UiLabel } from '@/components/atoms/label'
import { UiRadio } from '@/components/atoms/radio'
import { UiButton } from '@/components/atoms/button'

type Option = { value: number; label: string }
type Question = { id: string; label: string; correctAnswer: number }
type Survey = { title: string; options: Option[]; questions: Question[] }

const survey = ref<Survey | null>(null)
const answers = ref<Record<string, number | undefined>>({})
const score = ref<number | null>(null)
const finished = ref(false)

import gameData from '@/assets/gameData/matrix_game.json'

onMounted(async () => {
  survey.value = gameData

  // initialize answers
  survey.value.questions.forEach((q) => {
    answers.value[q.id] = undefined
  })
})

const submit = () => {
  if (!survey.value) return

  let s = 0
  survey.value.questions.forEach((q) => {
    if (answers.value[q.id] === q.correctAnswer) s++
  })
  score.value = s
  finished.value = true
}

const restart = () => {
  if (!survey.value) return
  survey.value.questions.forEach((q) => {
    answers.value[q.id] = undefined
  })
  score.value = null
}

const continueQuiz = () => {
  alert('Continue to next step')
}

// returns CSS class for radio based on correctness
const radioClass = (q: Question, o: Option) => {
  if (score.value === null) return 'scale-125 cursor-pointer'

  const userSelected = answers.value[q.id]
  if (userSelected === o.value && userSelected === q.correctAnswer) {
    return 'scale-125 cursor-pointer bg-green-200 rounded'
  } else if (userSelected === o.value && userSelected !== q.correctAnswer) {
    return 'scale-125 cursor-pointer bg-red-200 rounded'
  } else if (o.value === q.correctAnswer) {
    return 'scale-125 cursor-pointer bg-green-100 rounded'
  } else {
    return 'scale-125 cursor-pointer'
  }
}
</script>
