<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useTimer from '@/composables/useTimer'
import type { ApiResponse, Blank } from '@/types/types'
import BlankSlot from '@/components/organism/DragAndDrop/BlankSlot.vue'
import WordItem from '@/components/organism/DragAndDrop/WordItem.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
import useApi from '@/composables/useApi'
import GameHeader from '@/components/molecules/GameHeader.vue'
import GameFooter from '@/components/molecules/GameFooter.vue'
import GameIntroModal from '@/components/molecules/GameIntroModal.vue'
import introData from '@/assets/gameData/intro.json'
import { useSessionStore } from '@/stores/session'
import { MINIGAME_IDS } from '@/utils/constants'
import GameState from '@/components/molecules/GameState.vue'
import { shuffle } from '@/utils/shuffle'

const session = useSessionStore()

const MAX_TIME = 180 //second
const { time, isGameOver, start, stop } = useTimer(MAX_TIME)
const slotCorrectness = ref<Record<number, boolean | null>>({})
const isLocked = ref(false)

const showIntro = ref(true)

async function startGame() {
  showIntro.value = false

  await session.launchGame(MINIGAME_IDS.dragAndDrop)

  loadLevel()
}

onMounted(() => {
  fetchLevel()
})

onUnmounted(() => {
  stop()
})

const emit = defineEmits<{
  (e: 'cleared', payload: { game: 'drag-and-drop'; score: number }): void
}>()

async function finishGame() {
  const score = isGameOver.value ? 0 : 100

  const answers = Object.entries(slotCorrectness.value).map(([slotId, correct]) => ({
    slotId: Number(slotId),
    correct,
  }))

  try {
    await session.submitScore(score, answers, MAX_TIME - time.value)
  } finally {
    emit('cleared', {
      game: 'drag-and-drop',
      score,
    })
  }
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

    if (res && (res.success === false || (res as any).error)) {
      const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
      const err = new Error(msg)
        ; (err as any).apiError = res
      throw err
    }

    gameData.value = res.data
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

  items.value = shuffle(gameData.value.blanks)

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

const draggedItem = ref<Blank | null>(null)
const draggedFromIndex = ref<number | null>(null)
const draggedFromType = ref<'pool' | 'board' | null>(null)

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
    isWin.value = true
    isLocked.value = true
    stop()
  } else {
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

  items.value = shuffle(gameData.value.blanks)

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
  <GameState :loading="loading" :error="error" :retryFn="fetchLevel">
    <GameIntroModal v-if="!loading" v-model="showIntro" title="Automation Spotter" :introData="introData.data[1]"
      @start="startGame" />

    <template v-if="!showIntro">
      <div class="p-6">
        <div class="border-[6px] border-blue-700 flex flex-col items-center gap-4 w-full max-w-full p-6 rounded-4xl">
          <GameHeader title="Drag and Drop Prompt"
            description="Isilah bagian kosong prompt dibawah ini dengan kata yang sesuai" :time="time">
          </GameHeader>

          <!-- Sentence -->
          <div class="border rounded-xl p-4 text-base text-justify">
            <template v-for="(part, index) in board" :key="part.type === 'slot' ? `slot-${part.id}` : `text-${index}`">
              <span v-if="part.type === 'text'">
                {{ part.value }}
              </span>

              <BlankSlot v-else :item="slots[part.id]" :slotId="part.id" :onDragStart="onDragStart"
                :isCorrect="slotCorrectness[part.id]" :disabled="isLocked" @drop="onDrop" />
            </template>
          </div>

          <!-- Word pool -->
          <div class="flex flex-wrap gap-3 justify-center">
            <WordItem v-for="(item, index) in items" :key="item.id" :item="item" :slotId="index" :inSlot="false"
              :disabled="isLocked" @dragstart="(e, item, idx) => onDragStart(e, item, idx ?? 0, 'pool')" />
          </div>

          <!-- Actions -->
          <GameFooter #footer class="mt-8" :isGameOver="isGameOver" :current="correctCount ?? 0"
            :target="board.filter((part) => part.type === 'slot').length" @check="checkAnswers" :show-progress="true"
            :has-lost="hasLost" :is-checked="isChecked" :is-win="isWin" @cleared="finishGame()" @retry="retryGame">
          </GameFooter>
        </div>
      </div>
    </template>
  </GameState>
</template>
