<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import TaskRow from '@/components/organism/AutomationSpotter/TaskRow.vue'
import SpotZones from '@/components/organism/AutomationSpotter/SpotZones.vue'
import type { DragCard, Zone } from '@/types/types'
import useApi from '@/composables/useApi'
import type { ApiResponse } from '@/types/types'
import BaseGame from '@/components/templates/BaseGame.vue'
import introData from '@/assets/gameData/intro.json'
import { MINIGAME_IDS } from '@/utils/constants'
import { shuffle } from '@/utils/shuffle'
import { useGame } from '@/composables/useGame'

const { get, loading, error } = useApi()

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

// useGame composable
const {
  time,
  isWon,
  isLost,
  startGame,
  finish,
  reset,
} = useGame({
  maxTime: 180,
  minigameId: MINIGAME_IDS.automationSpotter,
  onWin: () => {
    emit('cleared', { game: 'automation-spotter', score: 100 })
  },
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
  try {
    const res = await get<
      ApiResponse<{
        question: string
        card: DragCard[]
      }>
    >('/api/v1/minigames/automation-spotter/levels/1')

    if (res && (res.success === false || (res as any).error)) {
      const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
      const err = new Error(msg)
        ; (err as any).apiError = res
      throw err
    }

    gameData.value = res.data
    loadLevel()
  } catch (err) {
    console.error('Failed to load level', err)
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

  if (Object.values(result).every(Boolean) &&
    Object.keys(result).length === allCards.value.length) {
    await finish(true)
  }
}


function handleContinue() {
  emit('cleared', { game: 'automation-spotter', score: 100 })
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
  (e: 'cleared', payload: { game: 'automation-spotter'; score: number }): void
}>()

// Lifecycle
onMounted(() => {
  fetchLevel()
})

onUnmounted(() => {
  // Cleanup handled by useGame
})
</script>

<template>
  <BaseGame :title="'Automation Spotter'" :description="question" :time="time" :maxTime="180" :loading="loading"
    :error="error" :retryFn="fetchLevel" v-model:showIntro="showIntro" :introData="introData.data[0]" :isWin="isWon"
    :hasLost="hasLost" :isChecked="isChecked" :currentProgress="matchedCount" :targetProgress="allCards.length"
    :showProgress="true" @start="start" @retry="retryGame" @check="checkAnswers" @cleared="handleContinue">
    <TaskRow v-model="sourceCards" :checked-map="checkedMap" :is-checked="isChecked" :disabled="isChecked"
      @moved="onMoved" />
    <SpotZones :zones="zones" :checked-map="checkedMap" :is-checked="isChecked" @moved="onMoved" />
  </BaseGame>
</template>
