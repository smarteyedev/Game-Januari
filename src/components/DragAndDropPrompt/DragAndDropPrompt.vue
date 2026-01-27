<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useTimer from '@/composables/useTimer'
import type { ApiResponse, Blank, FillBlank } from '@/types/types'
import GameHeader from '../molecules/GameHeader.vue'
import GameFooter from '../molecules/GameFooter.vue'
import BlankSlot from './BlankSlot.vue'
import WordItem from './WordItem.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
import useApi from '@/composables/useApi'

// Timer
const MAX_TIME = 180 //second
const { time, isGameOver, start, stop } = useTimer(MAX_TIME)
const slotCorrectness = ref<Record<number, boolean | null>>({})
const isLocked = ref(false)
//  Words and blanks

onMounted(() => {
  fetchLevel()
})

onUnmounted(() => {
  stop()
})

const emit = defineEmits<{
  (e: 'cleared', payload: { game: 'dragAndDropPrompt'; score: number }): void
}>()

function finishGame() {
  emit('cleared', {
    game: 'dragAndDropPrompt',
    score: isGameOver.value ? 0 : 100,
  })
}

const { get, loading, error } = useApi()
const gameData = ref<{
  sentence: string
  blanks: Blank[]
} | null>(null)

async function fetchLevel() {
  try {
    const res = await get<
      ApiResponse<{
        sentence: string
        blanks: Blank[]
      }>
    >('/api/v1/minigames/drag-and-drop/levels/1')

    gameData.value = res.data
    loadLevel()
  } catch (err) {
    console.error('Failed to load level', err)
  }
}

function loadLevel() {
  if (!gameData.value) return

  board.value = parseSentence(gameData.value.sentence)

  slots.value = {}
  slotCorrectness.value = {}

  board.value.forEach((part) => {
    if (part.type === 'slot') {
      slots.value[part.id] = null
      slotCorrectness.value[part.id] = null
    }
  })

  items.value = [...gameData.value.blanks]

  correctCount.value = null
  isChecked.value = false
  isWin.value = false
  isLocked.value = false

  stop()
  start()
}

function parseSentence(sentence: string) {
  const regex = /\{\{(\d+)\}\}/g
  const result: any[] = []

  let lastIndex = 0
  let match

  while ((match = regex.exec(sentence)) !== null) {
    // text before slot
    if (match.index > lastIndex) {
      result.push({
        type: 'text',
        value: sentence.slice(lastIndex, match.index),
      })
    }

    // slot - store the expected ID from the placeholder
    result.push({
      type: 'slot',
      id: Number(match[1]), // Keep the actual ID from the sentence
      item: null,
    })

    lastIndex = regex.lastIndex
  }

  // remaining text
  if (lastIndex < sentence.length) {
    result.push({
      type: 'text',
      value: sentence.slice(lastIndex),
    })
  }

  return result
}

const board = ref<any[]>([])
const items = ref<Blank[]>([])
const slots = ref<Record<number, Blank | null>>({})

board.value.forEach((part) => {
  if (part.type === 'slot') {
    slotCorrectness.value[part.id] = null
  }
})

let draggedItem: any | null = null
let draggedFromIndex: number | null = null
let draggedFromType: 'pool' | 'board' | null = null

function onDragStart(event: DragEvent, item: any, index: number, type: 'pool' | 'board' | null) {
  playClick()
  draggedItem = item
  draggedFromIndex = index
  draggedFromType = type
}

function onDrop(event: DragEvent, dropSlotId: number) {
  if (isLocked.value) return
  playClick()
  // Get the current item in the target slot
  const currentSlotItem = slots.value[dropSlotId]

  // Reset correctness for affected slots
  slotCorrectness.value[dropSlotId] = null
  if (draggedFromType === 'board' && draggedFromIndex !== null) {
    slotCorrectness.value[draggedFromIndex] = null
  }

  if (currentSlotItem) {
    // If target slot already has an item
    if (draggedFromType === 'board') {
      // Swap items between two slots
      slots.value[dropSlotId] = draggedItem
      slots.value[draggedFromIndex as number] = currentSlotItem
    } else if (draggedFromType === 'pool') {
      // Move from pool to slot, put slot item back to pool
      slots.value[dropSlotId] = draggedItem
      const itemIndex = items.value.findIndex((i) => i.id === draggedItem.id)
      if (itemIndex !== -1) items.value.splice(itemIndex, 1)
      items.value.push(currentSlotItem)
    }
  } else {
    // Target slot is empty
    slots.value[dropSlotId] = draggedItem

    if (draggedFromType === 'pool') {
      // Remove from pool
      const itemIndex = items.value.findIndex((i) => i.id === draggedItem.id)
      if (itemIndex !== -1) items.value.splice(itemIndex, 1)
    } else if (draggedFromType === 'board') {
      // Clear the source slot
      slots.value[draggedFromIndex as number] = null
    }
  }

  // Reset drag state
  draggedItem = null
  draggedFromIndex = null
  draggedFromType = null
}

const correctCount = ref<number | null>(null)
const isChecked = ref(false)
const isWin = ref(false)

const hasLost = computed(() => isChecked.value && !isWin.value)

function checkAnswers() {
  isChecked.value = true

  let count = 0
  const totalSlots = board.value.filter((part) => part.type === 'slot').length

  Object.entries(slots.value).forEach(([slotIdStr, item]) => {
    const slotId = Number(slotIdStr)
    const isCorrect = item && item.id === slotId

    slotCorrectness.value[slotId] = isCorrect
    if (isCorrect) count++
  })

  correctCount.value = count

  if (count === totalSlots) {
    // WIN
    isWin.value = true
    isLocked.value = true
    stop()
  } else {
    // NOT WIN
    isWin.value = false
    isLocked.value = true
    stop()
  }
}

watch(isGameOver, (over) => {
  if (over) {
    isChecked.value = true
    isWin.value = false
    isLocked.value = true
  }
})

function retryGame() {
  if (!gameData.value) return

  slots.value = {}
  slotCorrectness.value = {}

  board.value.forEach((part) => {
    if (part.type === 'slot') {
      slotCorrectness.value[part.id] = null
    }
  })

  items.value = [...gameData.value.blanks]

  correctCount.value = null
  isLocked.value = false
  isChecked.value = false
  isWin.value = false

  stop()
  start()
}

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
  <div class="flex flex-col items-center gap-4 w-full max-w-full">
    <GameHeader
      title="Drag and Drop Prompt"
      description="Isilah bagian kosong prompt dibawah ini dengan kata yang sesuai"
      :time="time"
    >
    </GameHeader>

    <!-- Sentence -->
    <div class="border rounded-xl p-4 text-base text-justify">
      <template v-for="(part, index) in board" :key="index">
        <span v-if="part.type === 'text'">
          {{ part.value }}
        </span>

        <BlankSlot
          v-else
          :item="slots[part.id]"
          :slotId="part.id"
          :onDragStart="onDragStart"
          :isCorrect="slotCorrectness[part.id]"
          :disabled="isLocked"
          @drop="onDrop"
        />
      </template>
    </div>

    <!-- Word pool -->
    <div class="flex flex-wrap gap-3 justify-center">
      <WordItem
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :slotId="index"
        :inSlot="false"
        :disabled="isLocked"
        @dragstart="(e, item, idx) => onDragStart(e, item, idx ?? 0, 'pool')"
      />
    </div>

    <!-- Actions -->
    <GameFooter
      slot="footer"
      class="mt-8"
      :isGameOver="isGameOver"
      :current="correctCount ?? 0"
      :target="board.filter((part) => part.type === 'slot').length"
      @check="checkAnswers"
      :show-progress="true"
      :has-lost="hasLost"
      :is-checked="isChecked"
      :is-win="isWin"
      @cleared="finishGame()"
      @retry="retryGame"
    >
    </GameFooter>
  </div>
</template>
