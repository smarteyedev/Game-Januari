<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { MemoryCard, ContentType, ApiResponse } from '@/types/types'
import MemoryBoard from '@/components/organism/MemoryGame/MemoryBoard.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
import useApi from '@/composables/useApi'
import BaseGame from '@/components/templates/BaseGame.vue'
import introData from '@/assets/gameData/intro.json'
import { MINIGAME_IDS } from '@/utils/constants'
import { shuffle } from '@/utils/shuffle'
import { useGame } from '@/composables/useGame'

const { get, loading, error } = useApi()

// Game data
const gameData = ref<{
  id: number
  card: MemoryCard[]
} | null>(null)

const cards = ref<MemoryCard[]>([])

// Card matching state
let firstCard: MemoryCard | null = null
let lock = false
const turns = ref(0)

// Audio
const audio = new Audio(clickSound)

function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => { })
  }
}

// Fetch level from API
async function fetchLevel() {
  try {
    const res = await get<
      ApiResponse<{
        id: number
        card: MemoryCard[]
      }>
    >('/api/v1/minigames/memory-game/levels/1')

    if (res && (res.success === false || (res as any).error)) {
      const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
      const err = new Error(msg)
        ; (err as any).apiError = res
      throw err
    }

    gameData.value = res.data
    cards.value = loadLevel()
  } catch (err) {
    console.error('Failed to load level', err)
  }
}

// Load and shuffle cards
function loadLevel(): MemoryCard[] {
  if (!gameData.value) return []

  return shuffle(
    gameData.value.card.map((card) => ({
      ...card,
      contentType: card.contentType as ContentType,
      flipped: false,
      matched: false,
    })),
  )
}

// Card flip logic
async function flipCard(card: MemoryCard) {
  if (gameOver.value || lock || card.flipped || card.matched) return

  playClick()
  card.flipped = true
  turns.value++

  if (!firstCard) {
    firstCard = card
    return
  }

  // Check match
  if (firstCard.pairId === card.pairId) {
    firstCard.matched = true
    card.matched = true
    firstCard = null

    if (allMatched.value) {
      await finish(true)
    }
  } else {
    lock = true
    setTimeout(() => {
      card.flipped = false
      if (firstCard) firstCard.flipped = false
      firstCard = null
      lock = false
    }, 800)
  }
}

// Game state
const showIntro = ref(true)

// useGame composable
const { time, isWon, isLost, startGame, finish, reset } = useGame({
  maxTime: 180,
  minigameId: MINIGAME_IDS.memory,
})

// Computed states
const allMatched = computed(
  () => cards.value.length > 0 && cards.value.every((card) => card.matched),
)
const gameOver = computed(() => isLost.value || (isWon.value && allMatched.value))

// Emit for session tracking
const emit = defineEmits<{
  (e: 'cleared', payload: { game: string; score: number }): void
}>()

function handleContinue() {
  const score = isWon.value ? 100 : 0
  emit('cleared', { game: 'memory-game', score: score })
}

// Start game
async function start() {
  showIntro.value = false
  await startGame()
}

// Reset game
function retryGame() {
  cards.value = loadLevel()
  firstCard = null
  lock = false
  turns.value = 0
  reset()
}

// Lifecycle
onMounted(() => {
  fetchLevel()
})
</script>

<template>
  <BaseGame :title="'Memory Game'" :description="'Pasangkan kartu dengan deskripsi yang benar!'" :time="time"
    :maxTime="180" :loading="loading" :error="error" :retryFn="fetchLevel" v-model:showIntro="showIntro"
    :introData="introData.data[2]" :isWin="isWon" :hasLost="isLost" :hideSubmit="true" :isChecked="allMatched"
    @start="start" @retry="retryGame" @cleared="handleContinue">
    <MemoryBoard :cards="cards" @flip="flipCard" />
  </BaseGame>
</template>
