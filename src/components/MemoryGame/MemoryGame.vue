<script setup lang="ts">
import { ref, computed } from 'vue'
import useTimer from '@/composables/useTimer'
import type { MemoryCard, ContentType } from '@/types/types'
import MemoryBoard from './MemoryBoard.vue'
import gameData from '@/assets/gameData/memoryGame.json'
import GameHeader from '../GameHeader.vue'
import GameFooter from '../GameFooter.vue'

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

function loadLevel(): MemoryCard[] {
  const level = gameData
  if (!level) return []

  // Direct mapping from JSON to MemoryCard with game state
  return shuffle(
    level.card.map((card) => ({
      ...card,
      contentType: card.contentType as ContentType,
      flipped: false,
      matched: false,
    }))
  )
}

const cards = ref<MemoryCard[]>(loadLevel())

// GAME STATE
let firstCard: MemoryCard | null = null
let lock = false

const turns = ref(0)
const gameStarted = ref(false)
const score = ref(100)
const MAX_TURNS_BEFORE_PENALTY = 10
const PENALTY_PER_FLIP = 2
const MAX_TIME = 60
const gameOver = ref(false)

const { time, start, stop } = useTimer(MAX_TIME, {
  onFinish: () => {
    score.value = 0
    lock = true
    gameOver.value = true
  },
})

const allMatched = computed(() => cards.value.every((card) => card.matched))

function flipCard(card: MemoryCard) {
  playClick()
  if (lock || card.flipped || card.matched) return

  if (!gameStarted.value) {
    gameStarted.value = true
    start()
  }

  card.flipped = true
  turns.value++

  if (turns.value > MAX_TURNS_BEFORE_PENALTY) {
    score.value = Math.max(0, score.value - PENALTY_PER_FLIP)
  }

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

function finishGame() {
  
  emit('cleared', {
    game: 'memoryGame',
    score: allMatched.value ? score.value : 0,
  })
}


import clickSound from '@/assets/sounds/btn_click.ogg'

const audio = new Audio(clickSound)

function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play()
  }
}
</script>

<template>
  <div class="w-[90vw]">
    <GameHeader
      title="Memory Game"
      description="Pasangkan kartu dengan deskripsi yang benar!"
      :time="time"
    />

    <div class="flex justify-center">
      <MemoryBoard :cards="cards" @flip="flipCard" />
    </div>

    <GameFooter @cleared="finishGame()" class="mt-8">
      <template #left>
        <p class="text-lg font-semibold">Card Turns: {{ turns }}</p>
      </template>
    </GameFooter>
  </div>
</template>