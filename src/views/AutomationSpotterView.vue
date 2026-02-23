<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TaskRow from '@/components/games/AutomationSpotter/TaskRow.vue'
import SpotZones from '@/components/games/AutomationSpotter/SpotZones.vue'
import type { DragCard, Zone } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import BaseGame from '@/components/templates/BaseGame.vue'
import introData from '@/assets/gameData/intro.json'
import { MINIGAME_IDS, MinigameId } from '@/utils/constants'
import { shuffle } from '@/utils/shuffle'
import { useGameService } from '@/application/services/GameService'

// Level fetching
const loading = ref(false)
const error = ref<unknown>(null)

// Game data
const gameData = ref<{
  question: string
  card: DragCard[]
} | null>(null)

// Card state
const allCards = ref<DragCard[]>([])
const sourceCards = ref<DragCard[]>([])

const zones = ref<Zone[]>([
  { id: true, label: 'Bisa', cards: [] },
  { id: false, label: 'Tidak Bisa', cards: [] },
])

const checkedMap = ref<Record<number, boolean>>({})
const isChecked = ref(false)
const question = ref('')
const showIntro = ref(true)

const { time, _isWon, startGame, finish, reset } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.automationSpotter,
})

// Computed
const matchedCount = computed(() => Object.values(checkedMap.value).filter(Boolean).length)
const isLevelWin = computed(() => {
  if (!isChecked.value) return false
  return (
    Object.keys(checkedMap.value).length === allCards.value.length &&
    Object.values(checkedMap.value).every(Boolean)
  )
})
const hasLost = computed(() => isChecked.value && !isLevelWin.value)

// Fetch level
async function fetchLevel() {
  loading.value = true
  error.value = null

  try {
    const data = await levelRepository.getLevel<{
      question: string
      card: DragCard[]
    }>(MinigameId.AutomationSpotter, 1)

    gameData.value = data
    loadLevel()
  } catch (err) {
    error.value = err
    console.error('Failed to load level', err)
  } finally {
    loading.value = false
  }
}

// Load level
function loadLevel() {
  if (!gameData.value) return

  reset()
  question.value = gameData.value.question
  allCards.value = shuffle(gameData.value.card.map((c) => ({ ...c, matched: false })))
  sourceCards.value = [...allCards.value]
  zones.value.forEach((zone) => (zone.cards = []))
  checkedMap.value = {}
  isChecked.value = false
}

// Handle drag moves
function onMoved(ids: number[]) {
  if (!isChecked.value) return
  ids.forEach((id) => {
    if (checkedMap.value[id] !== undefined) delete checkedMap.value[id]
  })
}

// Check answers
async function checkAnswers() {
  const result: Record<number, boolean> = {}

  zones.value.forEach((zone) => {
    zone.cards.forEach((card) => {
      result[card.id] = card.answer === zone.id
    })
  })

  checkedMap.value = result
  isChecked.value = true

  if (
    Object.values(result).every(Boolean) &&
    Object.keys(result).length === allCards.value.length
  ) {
    await finish(true)
  }
}

function handleContinue() {
  emit('cleared')
}

// Retry game
function retryGame() {
  loadLevel()
}

// Start game
async function start() {
  showIntro.value = false
  await startGame()
}

// Emit
const emit = defineEmits<{
  (e: 'cleared'): void
}>()

// Lifecycle
onMounted(() => {
  fetchLevel()
})

onUnmounted(() => {
  // Cleanup handled by useGameService
})
</script>

<template>
  <BaseGame module-title="Explore Artificial Intelligence (AI) Tools" :title="'Automation Spotter'"
    description="Masukkan kata ke dalam tempat yang benar!" :question="question" :time="time" :maxTime="180"
    :loading="loading" :error="error" :retryFn="fetchLevel" v-model:showIntro="showIntro" :introData="introData.data[0]"
    :isWin="_isWon" :hasLost="hasLost" :isChecked="isChecked" :currentProgress="matchedCount"
    :targetProgress="allCards.length" :showProgress="true" @start="start" @retry="retryGame" @check="checkAnswers"
    @cleared="handleContinue">
    <TaskRow v-model="sourceCards" :checked-map="checkedMap" :is-checked="isChecked" :disabled="isChecked"
      @moved="onMoved" />
    <SpotZones :zones="zones" :checked-map="checkedMap" :is-checked="isChecked" @moved="onMoved" />
  </BaseGame>
</template>
