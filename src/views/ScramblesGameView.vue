<template>
  <div class="flex flex-col items-center p-8">
    <div class="p-2">
      <UiLabel :label="question" />
    </div>

    <div class="p-2">
      <BoxInput
:value="userInput"
:locked="hints" />
    </div>

    <div class="p-2 flex gap-2">
      <span
v-for="i in MAX_ATTEMPTS"
:key="i"
class="w-3 h-3 rounded-full border transition-all"
        :class="i <= MAX_ATTEMPTS - attempts ? 'bg-red-500 border-red-500' : 'border-red-400'" />
    </div>

    <div class="p-2 flex flex-col items-center gap-2">
      <div
v-for="(s, i) in submissions"
:key="i"
class="text-lg font-medium"
        :class="s.correct ? 'text-green-600' : 'line-through text-gray-400'">
        {{ s.value }}
      </div>
    </div>

    <div class="flex gap-2 p-2">
      <CharacterKey
v-for="{ c, i } in answerChars"
:key="`${c}-${i}`"
:char="c"
        :disabled="isCharDisabled(c) || !isPlaying"
@input="onCharInput" />
    </div>

    <div class="flex gap-2 p-2">
      <UiButton
class="flex items-center p-4 rounded-sm"
color="error"
@click="deleteChar"
:disabled="!isPlaying">
        <span>Delete</span>
      </UiButton>
      <UiButton
class="flex items-center p-4 rounded-sm"
@click="submitAnswer"
:disabled="!isPlaying">
        <span>Submit</span>
      </UiButton>

      <UiButton
v-if="isLose"
color="error"
class="flex items-center p-4 rounded-sm"
@click="restartGame">
        <span>Restart</span>
      </UiButton>

      <UiButton
v-if="isWin"
color="success"
class="flex items-center p-4 rounded-sm"
@click="continueGame">
        <span>Continue</span>
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { UiLabel } from '@/components/atoms/label'
import BoxInput from '@/components/atoms/BoxInput.vue'
import CharacterKey from '@/components/atoms/CharacterKey.vue'
import { UiButton } from '@/components/atoms/button'

type Submission = {
  value: string
  correct: boolean
}

type GameResult = 'playing' | 'win' | 'lose'
const gameResult = ref<GameResult>('playing')

const MAX_ATTEMPTS = 4
const JUNK_LETTERS = 3 // increase to make it evil

const attempts = ref(MAX_ATTEMPTS)
const question = ref('')
const answer = ref('')
const userInput = ref<(string | null)[]>([])
const submissions = ref<Submission[]>([])
const hints = ref<(string | null)[]>([])

const isWin = computed(() => gameResult.value === 'win')
const isLose = computed(() => gameResult.value === 'lose')
const isPlaying = computed(() => gameResult.value === 'playing')

import gameData from '@/assets/gameData/scrambles.json'

onMounted(async () => {
  const data = gameData
  question.value = data.question
  answer.value = data.answer.toUpperCase()

  hints.value = Array(answer.value.length).fill(null)
  userInput.value = Array(answer.value.length).fill(null)
})

const displayInput = computed(() =>
  userInput.value.map((c, i) => hints.value[i] ?? c ?? '').join(''),
)

const answerChars = computed(() => {
  const realChars = answer.value.split('')
  const exclude = new Set(realChars)

  const junkChars = Array.from({ length: JUNK_LETTERS }, () => getRandomLetter(exclude))

  const allChars = shuffle([...realChars, ...junkChars])

  return allChars.map((c, i) => ({ c, i }))
})

function onCharInput(char: string) {
  for (let i = 0; i < userInput.value.length; i++) {
    if (!hints.value[i] && userInput.value[i] === null) {
      userInput.value[i] = char
      return
    }
  }
}

function countCharInAnswer(char: string) {
  return answer.value.split('').filter((c) => c === char).length
}

function countCharUsed(char: string) {
  return displayInput.value.split('').filter((c) => c === char).length
}

function isCharDisabled(char: string) {
  const allowed = countCharInAnswer(char)
  const used = countCharUsed(char)

  if (allowed === 0) {
    return used >= 1
  }

  return used >= allowed
}

function deleteChar() {
  for (let i = userInput.value.length - 1; i >= 0; i--) {
    if (!hints.value[i] && userInput.value[i] !== null) {
      userInput.value[i] = null
      return
    }
  }
}

function submitAnswer() {
  if (gameResult.value !== 'playing') return

  const guess = displayInput.value
  const correct = guess === answer.value

  submissions.value.push({ value: guess, correct })

  if (correct) {
    gameResult.value = 'win'
    return
  }

  attempts.value--

  if (attempts.value <= 0) {
    gameResult.value = 'lose'

    // reveal full answer
    hints.value = answer.value.split('')
    userInput.value = Array(answer.value.length).fill(null)
    submissions.value.push({ value: answer.value, correct: true })
  }

  // reveal one random hint
  const candidates = []
  for (let i = 0; i < answer.value.length; i++) {
    if (hints.value[i] === null) {
      candidates.push(i)
    }
  }

  if (candidates.length) {
    const index = candidates[Math.floor(Math.random() * candidates.length)]
    if (index === undefined) return

    const char = answer.value[index]
    if (char === undefined) return

    hints.value[index] = char
    userInput.value[index] = null
  }

  userInput.value = Array(answer.value.length).fill(null)

  if (attempts.value <= 0) {
    gameResult.value = 'lose'
  }
}

function getRandomLetter(exclude: Set<string>): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const available = alphabet.split('').filter((c) => !exclude.has(c))

  // safety fallback
  if (available.length === 0) {
    return 'X'
  }

  return available[Math.floor(Math.random() * available.length)]!
}

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function restartGame() {
  attempts.value = MAX_ATTEMPTS
  submissions.value = []
  hints.value = Array(answer.value.length).fill(null)
  userInput.value = Array(answer.value.length).fill(null)
  gameResult.value = 'playing'
}

function continueGame() {
  restartGame()
}
</script>
