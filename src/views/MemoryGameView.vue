<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { MemoryCard, ContentType } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import MemoryBoard from '@/components/games/MemoryGame/MemoryBoard.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
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

const { time, _isWon, _isLost, startGame, finish, reset } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.memory,
})

// Fetch level from API
async function fetchLevel() {
  loading.value = true
  error.value = null

  try {
    const data = await levelRepository.getLevel<{
      id: number
      card: MemoryCard[]
    }>(MinigameId.Memory, 1)

    gameData.value = data
    cards.value = loadLevel()
  } catch (err) {
    error.value = err
    console.error('Failed to load level', err)
  } finally {
    loading.value = false
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

// Computed states
const allMatched = computed(
  () => cards.value.length > 0 && cards.value.every((card) => card.matched),
)
const gameOver = computed(() => _isLost.value || (_isWon.value && allMatched.value))

// Emit for session tracking
const emit = defineEmits<{
  (e: 'cleared'): void
}>()

function handleContinue() {
  emit('cleared')
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
    :introData="introData.data[2]" :isWin="_isWon" :hasLost="_isLost" :hideSubmit="true" :isChecked="allMatched"
    @start="start" @retry="retryGame" @cleared="handleContinue">
    <MemoryBoard :cards="cards" @flip="flipCard" />
  </BaseGame>
</template>
