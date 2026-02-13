<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { ApiResponse, Blank } from '@/types/types'
import BlankSlot from '@/components/organism/DragAndDrop/BlankSlot.vue'
import WordItem from '@/components/organism/DragAndDrop/WordItem.vue'
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
  sentence: string
  blanks: Blank[]
} | null>(null)

// Board and slot state
const board = ref<any[]>([])
const items = ref<Blank[]>([])
const slots = ref<Record<number, Blank | null>>({})
const slotCorrectness = ref<Record<number, boolean | null>>({})
const isLocked = ref(false)

// Drag state
const draggedItem = ref<Blank | null>(null)
const draggedFromIndex = ref<number | null>(null)
const draggedFromType = ref<'pool' | 'board' | null>(null)

// Game state
const showIntro = ref(true)
const isChecked = ref(false)
const isWin = ref(false)
const correctCount = ref<number | null>(null)

// Audio
const audio = new Audio(clickSound)

function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => { })
  }
}

// useGame composable
const { time, isWon, startGame, finish, reset } = useGame({
  maxTime: 180,
  minigameId: MINIGAME_IDS.dragAndDrop,
})

// Computed
const hasLost = computed(() => isChecked.value && !isWin.value)
const totalSlots = computed(() => board.value.filter((part: any) => part.type === 'slot').length)

// Emit
const emit = defineEmits<{
  (e: 'cleared', payload: { game: 'drag-and-drop'; score: number }): void
}>()

// Fetch level
async function fetchLevel() {
  try {
    const res = await get<
      ApiResponse<{
        sentence: string
        blanks: Blank[]
      }>
    >('/api/v1/minigames/drag-and-drop/levels/1')

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

// Parse sentence into board parts
function parseSentence(sentence: string) {
  const regex = /\{\{(\d+)\}\}/g
  const result: any[] = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(sentence)) !== null) {
    if (match.index > lastIndex) {
      result.push({ type: 'text', value: sentence.slice(lastIndex, match.index) })
    }
    result.push({ type: 'slot', id: Number(match[1]), item: null })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < sentence.length) {
    result.push({ type: 'text', value: sentence.slice(lastIndex) })
  }

  return result
}

// Load level
function loadLevel() {
  if (!gameData.value) return

  reset()
  board.value = parseSentence(gameData.value.sentence)
  slots.value = {}
  slotCorrectness.value = {}
  items.value = shuffle(gameData.value.blanks)

  board.value.forEach((part: any) => {
    if (part.type === 'slot') {
      slots.value[part.id] = null
      slotCorrectness.value[part.id] = null
    }
  })

  correctCount.value = null
  isChecked.value = false
  isWin.value = false
  isLocked.value = false
}

// Drag handlers
function onDragStart(_: DragEvent, item: Blank, index: number, type: 'pool' | 'board') {
  playClick()
  draggedItem.value = item
  draggedFromIndex.value = index
  draggedFromType.value = type
}

function onDrop(_: DragEvent, dropSlotId: number) {
  if (isLocked.value || !draggedItem.value) return

  const currentSlotItem = slots.value[dropSlotId]
  slotCorrectness.value[dropSlotId] = null

  if (draggedFromType.value === 'board' && draggedFromIndex.value !== null) {
    slotCorrectness.value[draggedFromIndex.value] = null
  }

  if (currentSlotItem) {
    if (draggedFromType.value === 'board') {
      slots.value[dropSlotId] = draggedItem.value
      slots.value[draggedFromIndex.value!] = currentSlotItem
    } else {
      slots.value[dropSlotId] = draggedItem.value
      items.value = items.value.filter((i) => i.id !== draggedItem.value!.id)
      items.value.push(currentSlotItem)
    }
  } else {
    slots.value[dropSlotId] = draggedItem.value
    if (draggedFromType.value === 'pool') {
      items.value = items.value.filter((i) => i.id !== draggedItem.value!.id)
    } else {
      slots.value[draggedFromIndex.value!] = null
    }
  }

  draggedItem.value = null
  draggedFromIndex.value = null
  draggedFromType.value = null
}

// Check answers
async function checkAnswers() {
  isChecked.value = true

  let count = 0
  Object.entries(slots.value).forEach(([slotIdStr, item]) => {
    const slotId = Number(slotIdStr)
    const isCorrect = item && item.id === slotId
    slotCorrectness.value[slotId] = isCorrect
    if (isCorrect) count++
  })

  correctCount.value = count
  const won = count === totalSlots.value
  isWin.value = won
  isLocked.value = true

  if (won) {
    await finish(true)
  }
}

function handleContinue() {
  const score = isWon.value ? 100 : 0
  emit('cleared', { game: 'drag-and-drop', score: score })
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

// Lifecycle
onMounted(() => {
  fetchLevel()
})

onUnmounted(() => {
  // Cleanup handled by useGame
})
</script>

<template>
  <BaseGame :title="'Drag and Drop Prompt'"
    :description="'Isilah bagian kosong prompt dessous ini dengan kata yang sesuai'" :time="time" :maxTime="180"
    :loading="loading" :error="error" :retryFn="fetchLevel" v-model:showIntro="showIntro" :introData="introData.data[1]"
    :isWin="isWon" :hasLost="hasLost" :isChecked="isChecked" :currentProgress="correctCount ?? 0"
    :targetProgress="totalSlots" :showProgress="true" @start="start" @retry="retryGame" @check="checkAnswers"
    @cleared="handleContinue">
    <!-- Sentence Board -->
    <div class="border rounded-xl p-4 text-base text-justify">
      <template v-for="(part, index) in board" :key="part.type === 'slot' ? `slot-${part.id}` : `text-${index}`">
        <span v-if="part.type === 'text'">
          {{ part.value }}
        </span>
        <BlankSlot v-else :item="slots[part.id]" :slotId="part.id" :onDragStart="onDragStart"
          :isCorrect="slotCorrectness[part.id]" :disabled="isLocked" @drop="onDrop" />
      </template>
    </div>

    <!-- Word Pool -->
    <div class="flex flex-wrap gap-3 justify-center">
      <WordItem v-for="(item, index) in items" :key="item.id" :item="item" :slotId="index" :inSlot="false"
        :disabled="isLocked" @dragstart="(e, item, idx) => onDragStart(e, item, idx ?? 0, 'pool')" />
    </div>
  </BaseGame>
</template>
