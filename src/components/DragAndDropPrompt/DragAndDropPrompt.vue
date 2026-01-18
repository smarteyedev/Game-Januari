<script setup lang="ts">
import { ref, computed, watch, onUnmounted, nextTick } from 'vue'
import useTimer from '@/composables/useTimer'
import DragBlank from './DragBlank.vue'
import WordPool from './WordPool.vue'
import gameData from '@/assets/gameData/fillBlank.json'
import type { FillBlankLevel } from '@/types/types'
import GameHeader from '../GameHeader.vue'
import GameFooter from '../GameFooter.vue'

//  Game state
const levelIndex = ref(0)
const level = computed<FillBlankLevel | null>(() => gameData.levels[levelIndex.value] ?? null)

// Timer
const MAX_TIME = 60
const { time, isGameOver, start, stop } = useTimer(MAX_TIME)

//  Words and blanks
type AnswerMap = Record<string, string | null>

const answers = ref<AnswerMap>({})
const wordPool = ref<string[]>([])

const emit = defineEmits<{
  (e: 'cleared', payload: { game: 'dragAndDropPrompt'; score: number }): void
}>()

watch(
  level,
  (lvl) => {
    if (!lvl) return

    answers.value = Object.fromEntries(lvl.blanks.map((b) => [b.id, null]))

    wordPool.value = [...lvl.words]
    start()
  },
  { immediate: true },
)

watch(
  answers,
  () => {
    if (hasChecked.value) {
      hasChecked.value = false
    }
  },
  { deep: true },
)

//  Sentence
const sentenceParts = computed(() => (level.value ? level.value.sentence.split('____') : []))

// Checking logic
const hasChecked = ref(false)

const correctIds = computed(() => {
  if (!hasChecked.value || !level.value) return new Set<string>()

  return new Set(
    level.value.blanks.filter((b) => answers.value[b.id] === b.answer).map((b) => b.id),
  )
})

const correctCount = computed(() => correctIds.value.size)
const totalBlanks = computed(() => level.value?.blanks.length ?? 0)

const isLevelCorrect = computed(() =>
  hasChecked.value && level.value
    ? level.value.blanks.every((b) => answers.value[b.id] === b.answer)
    : false,
)

function checkAnswers() {
  hasChecked.value = true
  if (isLevelCorrect.value) stop()
}

function restartGame() {
  stop()
  levelIndex.value = 0
  hasChecked.value = false
  isGameOver.value = false
  start()
}

onUnmounted(stop)

const blankState = (id: string) => {
  if (!hasChecked.value) return 'idle'
  return answers.value[id] === level.value!.blanks.find((b) => b.id === id)!.answer
    ? 'correct'
    : 'wrong'
}

async function handleSwap(oldWord: string) {
  // Wait for the blank that lost its word to update its modelValue
  await nextTick()

  // If a blank became empty (swap from another blank), fill it with the old word.
  const emptyId = Object.keys(answers.value).find((id) => answers.value[id] === null)
  if (emptyId) {
    answers.value[emptyId] = oldWord
    return
  }

  // Otherwise push back to the word pool (swap from pool)
  wordPool.value.push(oldWord)
}

function finishGame() {
  emit('cleared', {
    game: 'dragAndDropPrompt',
    score: isGameOver.value ? 0 : correctCount.value,
  })
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 min-w-full w-[90vw]">
    <GameHeader
      title="Drag and Drop Prompt"
      description="Isilah bagian kosong prompt dibawah ini dengan kata yang sesuai"
      :time="time"
    >
    </GameHeader>

    <!-- Sentence -->
    <div v-if="level" class="border rounded-xl p-4 text-base text-justify">
      <template v-for="(part, i) in sentenceParts" :key="i">
        {{ part }}
        <DragBlank
          v-if="level.blanks[i]"
          v-model="answers[level.blanks[i].id]!"
          :answer="level.blanks[i].answer"
          :locked="correctIds.has(level.blanks[i].id)"
          :show="hasChecked"
          :state="blankState(level.blanks[i].id)"
          @swap="handleSwap"
        />
      </template>
    </div>

    <!-- Word pool -->
    <WordPool v-model="wordPool" />

    <!-- Actions -->
    <GameFooter
      class="mt-8"
      :isGameOver="isGameOver"
      :current="correctCount"
      :target="totalBlanks"
      @check="checkAnswers"
      :show-progress="true"
      @cleared="finishGame()"
    ></GameFooter>
  </div>
</template>
