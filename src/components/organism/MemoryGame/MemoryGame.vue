<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import useTimer from '@/composables/useTimer'
import type { MemoryCard, ContentType, ApiResponse } from '@/types/types'
import MemoryBoard from './MemoryBoard.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
import useApi from '@/composables/useApi'
import GameFooter from '@/components/molecules/GameFooter.vue'
import GameHeader from '@/components/molecules/GameHeader.vue'
import useGameSession from '@/composables/useGameSession'
import { UiLoading } from '@/components/atoms/loading'

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

const { get, loading, error } = useApi()
const gameData = ref<{
  id: number
  card: MemoryCard[]
} | null>(null)

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

const cards = ref<MemoryCard[]>([])

// GAME STATE
let firstCard: MemoryCard | null = null
let lock = false

const turns = ref(0)
const gameStarted = ref(false)
const MAX_TIME = 180 //second
const gameOver = ref(false)

const { time, start, stop } = useTimer(MAX_TIME, {
  onFinish: () => {
    lock = true
    gameOver.value = true
  },
})

const allMatched = computed(() => cards.value.every((card) => card.matched))

function flipCard(card: MemoryCard) {
  if (gameOver.value) return
  playClick()
  if (lock || card.flipped || card.matched) return

  if (!gameStarted.value) {
    gameStarted.value = true
    start()
  }

  card.flipped = true
  turns.value++

  if (!firstCard) {
    firstCard = card
    return
  }

  // Compare cards based on pairId
  if (firstCard.pairId === card.pairId) {
    firstCard.matched = true
    card.matched = true
    firstCard = null

    // Check immediately after a successful match
    if (allMatched.value) {
      stop()
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

const emit = defineEmits<{
  (e: 'cleared', payload: { game: 'memoryGame'; score: number }): void
}>()

async function finishGame() {
  emit('cleared', {
    game: 'memoryGame',
    score: allMatched.value ? 100 : 0,
  })
}

const audio = new Audio(clickSound)

function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play()
  }
}

function retryGame() {
  cards.value = loadLevel()
  firstCard = null
  lock = false
  gameStarted.value = false
  gameOver.value = false
  stop()
}

onMounted(() => {
  fetchLevel()
})
</script>

<template>
  <div class="gap-4 w-full max-w-full">
    <div v-if="loading">
      <UiLoading class="grid place-items-center" />
    </div>

    <div v-else-if="error">
      <p>Failed to load game</p>
      <button @click="fetchLevel">Retry</button>
    </div>

    <template v-else>
      <GameHeader title="Memory Game" description="Pasangkan kartu dengan deskripsi yang benar!" :time="time" />

      <div class="flex justify-center">
        <MemoryBoard :cards="cards" @flip="flipCard" />
      </div>

      <GameFooter #footer :hide-submit="true" :is-win="allMatched" :has-lost="gameOver && !allMatched"
        :is-checked="allMatched" @cleared="finishGame" @retry="retryGame" class="mt-8">
      </GameFooter>
    </template>
  </div>
</template>
