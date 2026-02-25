<template>
  <BaseGame
    title="Scrambles Game"
    :description="question"
    :time="time"
    v-model:showIntro="showIntro"
    :introData="introData.data[4]"
    :loading="loading"
    :error="error"
    :retryFn="retryGame"
  >
    <div class="flex flex-col gap-[32px] justify-center items-center">
      <div class="flex flex-col gap-[20px] justify-center items-center">
        <BoxInput :value="userInput" :locked="hints" />
        <UiLabel
          :label="`You have ${attempts} attempts left`"
          class="text-primary-700 font-semibold text-body-md"
        />
      </div>

      <div v-for="(s, i) in submissions" :key="i" class="flex gap-[20px]">
        <div
          v-for="(char, j) in s.value.split('')"
          :key="j"
          class="aspect-square min-w-15 min-h-15 grid place-items-center border-[3px] rounded-3xl shadow-xl text-h3 font-bold select-none transition"
          :class="{
            // Correct guess (green styled)
            'bg-green-50 text-primary-500 border-tosca-700 shadow-tosca-700': s.correct,

            // Wrong guess (muted + strike feeling)
            'bg-gray-100 text-gray-400 border-gray-400 shadow-gray-400': !s.correct,
          }"
        >
          {{ char }}
        </div>
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-[20px]">
      <div class="flex gap-[20px]">
        <CharacterKey
          v-for="{ c, i } in answerChars"
          :key="`${c}-${i}`"
          :char="c"
          :disabled="isCharDisabled(c) || !isPlaying"
          @input="onCharInput"
        />
      </div>
      <div class="flex gap-4.5">
        <UiButton text="Delete" variant="danger" @click="deleteChar" :disabled="!isPlaying">
        </UiButton>
        <UiButton text="Submit" @click="submitAnswer" :disabled="!isPlaying"> </UiButton>

        <UiButton text="Restart" v-if="isLose" variant="danger" @click="restartGame"> </UiButton>

        <UiButton text="Continue" v-if="isWin" @click="continueGame"> </UiButton>
      </div>
    </div>

    <template #footer>
      <span></span>
    </template>
  </BaseGame>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import BoxInput from '@/components/atoms/BoxInput.vue'
import CharacterKey from '@/components/atoms/CharacterKey.vue'
import UiButton from '@/components/atoms/button/index.vue'
import gameData from '@/assets/gameData/scrambles.json'
import { shuffle } from '@/utils/shuffle'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useGameService } from '@/application'
import introData from '@/assets/gameData/intro.json'
import { UiLabel } from '@/components/atoms/label'

type Submission = {
  value: string
  correct: boolean
}

const { time, _isWon, _isLost, _isPlaying, startGame, finish, retry } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.scrambles,
  offline: true,
})

const isWin = computed(() => _isWon.value)
const isLose = computed(() => _isLost.value)
const isPlaying = computed(() => _isPlaying.value)

const loading = ref(true)
const error = ref<unknown>(null)
const showIntro = ref(true)

const MAX_ATTEMPTS = 4
const JUNK_LETTERS = 3 // increase to make it evil

const attempts = ref(MAX_ATTEMPTS)
const question = ref('')
const answer = ref('')
const userInput = ref<(string | null)[]>([])
const submissions = ref<Submission[]>([])
const hints = ref<(string | null)[]>([])

// Fetch game data and start game
async function initializeGame() {
  loading.value = true
  error.value = null

  try {
    const data = gameData
    question.value = data.question
    answer.value = data.answer.toUpperCase()

    hints.value = Array(answer.value.length).fill(null)
    userInput.value = Array(answer.value.length).fill(null)

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
  await initializeGame()
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

async function submitAnswer() {
  if (!isPlaying.value) return

  const guess = displayInput.value
  const correct = guess === answer.value

  submissions.value.push({ value: guess, correct })

  if (correct) {
    await finish(true)
    return
  }

  attempts.value--

  if (attempts.value <= 0) {
    // reveal full answer
    hints.value = answer.value.split('')
    userInput.value = Array(answer.value.length).fill(null)
    submissions.value.push({ value: answer.value, correct: true })
    await finish(false)
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
    await finish(false)
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

async function restartGame() {
  attempts.value = MAX_ATTEMPTS
  submissions.value = []
  hints.value = Array(answer.value.length).fill(null)
  userInput.value = Array(answer.value.length).fill(null)
  await retry()
}

function continueGame() {
  restartGame()
}
</script>
