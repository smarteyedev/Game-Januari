<script setup lang="ts">
<<<<<<< HEAD
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
=======
import { computed, onMounted, onUnmounted, ref } from 'vue'
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
import type { Blank } from '@/domain/types'
import { levelRepository } from '@/infrastructure'
import BlankSlot from '@/components/games/DragAndDrop/BlankSlot.vue'
import WordItem from '@/components/games/DragAndDrop/WordItem.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
import BaseGame from '@/components/templates/BaseGame.vue'
<<<<<<< HEAD
import Card from '@/components/molecules/Card.vue'
=======
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
import introData from '@/assets/gameData/intro.json'
import { MINIGAME_IDS, MinigameId } from '@/utils/constants'
import { shuffle } from '@/utils/shuffle'
import { useGameService } from '@/application/services/GameService'

// Level fetching
const loading = ref(false)
const error = ref<unknown>(null)

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

<<<<<<< HEAD
const lastPointerX = ref(0)
const lastPointerY = ref(0)

const ghostVisible = ref(false)

// Game state
const showIntro = ref(true)
const isChecked = ref(false)
const isWin = ref(false)
const correctCount = ref<number | null>(null)

// Audio
const audio = new Audio(clickSound)

const isTouchDevice = computed(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)

=======
// Game state
const showIntro = ref(true)
const isChecked = ref(false)
const isWin = ref(false)
const correctCount = ref<number | null>(null)

// Audio
const audio = new Audio(clickSound)

>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => {})
  }
}

<<<<<<< HEAD
const gameServiceOptions = {
  maxTime: 180,
  minigameId: MINIGAME_IDS.dragAndDrop,
  offline: true,
}

const { time, _isWon, startGame, finish, reset } = useGameService(gameServiceOptions)
=======
const { time, _isWon, startGame, finish, reset } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.dragAndDrop,
})
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466

// Computed
const hasLost = computed(() => isChecked.value && !isWin.value)
const totalSlots = computed(() => board.value.filter((part: any) => part.type === 'slot').length)

// Emit
const emit = defineEmits<{
  (e: 'cleared'): void
}>()

// Fetch level
async function fetchLevel() {
  loading.value = true
  error.value = null

  try {
<<<<<<< HEAD
    const data = await levelRepository.getLevel<any>(
      MinigameId.DragAndDrop,
      1,
      gameServiceOptions.offline,
    )
    const raw: any = data as any

    if (raw && raw.content && (raw.content.sentence || raw.content.blanks)) {
      gameData.value = {
        sentence: raw.content.sentence,
        blanks: raw.content.blanks,
      }
    } else if (raw && (raw.sentence || raw.blanks)) {
      gameData.value = raw as any
    } else if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0]
      gameData.value = {
        sentence: first.sentence ?? '',
        blanks: first.blanks ?? [],
      }
    } else {
      gameData.value = raw as any
    }

=======
    const data = await levelRepository.getLevel<{
      sentence: string
      blanks: Blank[]
    }>(MinigameId.DragAndDrop, 1)

    gameData.value = data
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
    loadLevel()
  } catch (err) {
    error.value = err
    console.error('Failed to load level', err)
  } finally {
    loading.value = false
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
<<<<<<< HEAD
// Pointer / drag start (mouse, pointer or touch)
const hoveredSlotId = ref<number | null>(null)
const dragCompleted = ref(false)

function onDragStart(payload: { item: Blank; slotId?: number; clientX: number; clientY: number }) {
=======
function onDragStart(_: DragEvent, item: Blank, index: number, type: 'pool' | 'board') {
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
  playClick()
  draggedItem.value = payload.item
  draggedFromIndex.value = payload.slotId ?? null
  draggedFromType.value = payload.slotId != null ? 'board' : 'pool'

  lastPointerX.value = payload.clientX
  lastPointerY.value = payload.clientY

  ghostLabel.value = payload.item.word
  dragCompleted.value = false
  ghostVisible.value = true

  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', handlePointerUp)
}

function handlePointerMove(e: PointerEvent) {
  if (!draggedItem.value) return

  lastPointerX.value = e.clientX
  lastPointerY.value = e.clientY
}

function handlePointerUp(e: PointerEvent) {
  if (!draggedItem.value) return

  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  const slotEl = el?.closest('[data-dd-slot]') as HTMLElement | null

  if (slotEl) {
    const dropId = Number(slotEl.dataset.ddSlot)
    performDrop(dropId)
  }

  cleanupDrag()
}

// Ghost (floating feedback)
const ghostLabel = ref<string | undefined>(undefined)
const ghostClass =
  'text-[10px] md:text-[12px] min-h-[24px] font-semibold bg-blue-100 px-2 md:px-[12px] md:py-[10px] border border-primary-500 rounded-[8px] text-center'

// Computed ghost position strings to ensure correct template typings
const ghostLeft = computed(() =>
  lastPointerX.value !== null ? `${lastPointerX.value}px` : '-9999px',
)
const ghostTop = computed(() =>
  lastPointerY.value !== null ? `${lastPointerY.value}px` : '-9999px',
)

function updateHoveredSlot(x: number, y: number) {
  const el = document.elementFromPoint(x, y) as HTMLElement | null
  if (!el) {
    hoveredSlotId.value = null
    return
  }
  const slotEl = el.closest('[data-dd-slot]') as HTMLElement | null
  if (slotEl && slotEl.dataset.ddSlot) hoveredSlotId.value = Number(slotEl.dataset.ddSlot)
  else hoveredSlotId.value = null
}

function handleGlobalPointerMove(e: PointerEvent) {
  if (!draggedItem.value) return
  lastPointerX.value = e.clientX
  lastPointerY.value = e.clientY
  updateHoveredSlot(e.clientX, e.clientY)
}

function handleGlobalPointerUp(e: PointerEvent | TouchEvent) {
  if (!draggedItem.value) return
  let x: number | null = null
  let y: number | null = null

  if ((e as PointerEvent).clientX !== undefined) {
    x = (e as PointerEvent).clientX
    y = (e as PointerEvent).clientY
  } else if ((e as TouchEvent).changedTouches && (e as TouchEvent).changedTouches[0]) {
    const t = (e as TouchEvent).changedTouches[0]
    if (t) {
      x = t.clientX
      y = t.clientY
    }
  }

  if (x !== null && y !== null) {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    const slotEl = el && el.closest ? (el.closest('[data-dd-slot]') as HTMLElement | null) : null
    if (slotEl && slotEl.dataset.ddSlot) {
      const dropId = Number(slotEl.dataset.ddSlot)
      performDrop(dropId)
    } else {
      // No slot found: cancel drag
      draggedItem.value = null
      draggedFromIndex.value = null
      draggedFromType.value = null
    }
  } else {
    draggedItem.value = null
    draggedFromIndex.value = null
    draggedFromType.value = null
  }

  hoveredSlotId.value = null
  ghostVisible.value = false
  cleanupDrag()
}

async function cancelDrag() {
  // Hide ghost immediately and clear label so it cannot re-render
  ghostVisible.value = false
  ghostLabel.value = undefined

  // Wait for DOM update to ensure ghost is removed from DOM
  await nextTick()

  // If drag already completed, do not restore
  if (!dragCompleted.value) {
    // If we picked the item up from a board slot, restore it back to that slot
    if (draggedItem.value && draggedFromType.value === 'board' && draggedFromIndex.value !== null) {
      slots.value[draggedFromIndex.value] = draggedItem.value
    }
  }

  draggedItem.value = null
  draggedFromIndex.value = null
  draggedFromType.value = null
  hoveredSlotId.value = null
}

function handleGlobalPointerCancel() {
  cancelDrag()
}

function performDrop(dropSlotId: number) {
  if (isLocked.value || !draggedItem.value) return

  const currentSlotItem = slots.value[dropSlotId]
<<<<<<< HEAD
=======
  slotCorrectness.value[dropSlotId] = null

  if (draggedFromType.value === 'board' && draggedFromIndex.value !== null) {
    slotCorrectness.value[draggedFromIndex.value] = null
  }
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466

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

  // mark drag completed and hide ghost
  dragCompleted.value = true
  ghostVisible.value = false
}

function cleanupDrag() {
  draggedItem.value = null
  draggedFromIndex.value = null
  draggedFromType.value = null
  ghostVisible.value = false
  ghostLabel.value = undefined

  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
}

<<<<<<< HEAD
onMounted(() => {
  window.addEventListener('pointermove', handleGlobalPointerMove)
  window.addEventListener('pointerup', handleGlobalPointerUp as any)
  window.addEventListener('pointercancel', handleGlobalPointerCancel as any)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', handleGlobalPointerMove)
  window.removeEventListener('pointerup', handleGlobalPointerUp as any)
  window.removeEventListener('pointercancel', handleGlobalPointerCancel as any)
})

=======
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
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

// Lifecycle
onMounted(() => {
  fetchLevel()
})

onUnmounted(() => {
  // Cleanup handled by useGameService
})
</script>

<template>
  <BaseGame
    module-title="Explore Artificial Intelligence (AI) Tools"
    :title="'Drag and Drop Prompt'"
    :description="'Isilah bagian kosong dengan kata yang sesuai!'"
    :time="time"
    :maxTime="180"
    :loading="loading"
    :error="error"
    :retryFn="fetchLevel"
    v-model:showIntro="showIntro"
    :introData="introData.data[1]"
    :isWin="_isWon"
    :hasLost="hasLost"
    :isChecked="isChecked"
    :currentProgress="correctCount ?? 0"
    :targetProgress="totalSlots"
    :showProgress="true"
    @start="start"
    @retry="retryGame"
    @check="checkAnswers"
    @cleared="handleContinue"
  >
    <!-- Sentence Board -->
<<<<<<< HEAD

    <div
      class="border-2 rounded-xl px-2.5 py-3.25 md:p-2.5 text-justify text-primary-700 font-semibold text-body-xs md:text-body-sm"
    >
      <template
        v-for="(part, index) in board"
        :key="part.type === 'slot' ? `slot-${part.id}` : `text-${index}`"
      >
        <span v-if="part.type === 'text'">
          {{ part.value }}
        </span>
        <BlankSlot
          v-else
          :item="slots[part.id]"
          :slotId="part.id"
          :onDragStart="onDragStart"
          :isTouchDevice="isTouchDevice"
          :isCorrect="slotCorrectness[part.id]"
          :disabled="isLocked"
        />
      </template>
    </div>

    <!-- Word Pool -->
    <div class="flex flex-wrap gap-3 justify-center">
      <WordItem
        v-for="(item, _) in items"
        :key="item.id"
        :item="item"
        :inSlot="false"
        :disabled="isLocked"
        @dragstart="onDragStart"
      />
    </div>
  </BaseGame>
  <div v-if="ghostVisible" class="dd-ghost" :style="{ left: ghostLeft, top: ghostTop }">
    <Card :label="ghostLabel" :class="ghostClass" />
  </div>
=======
    <div class="border-2 rounded-xl p-2.5 text-justify text-primary-700 font-medium text-body-sm">
      <template
        v-for="(part, index) in board"
        :key="part.type === 'slot' ? `slot-${part.id}` : `text-${index}`"
      >
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

    <!-- Word Pool -->
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
  </BaseGame>
>>>>>>> 6831fc723e8333367ce0adcb4c9165009771c466
</template>

<style scoped>
.dd-ghost {
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background: rgba(255, 255, 255, 0);
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  font-weight: 700;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
</style>
