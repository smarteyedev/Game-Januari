<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { Blank } from '@/domain/types'
import BlankSlot from '@/components/organisms/DragAndDrop/BlankSlot.vue'
import WordItem from '@/components/organisms/DragAndDrop/WordItem.vue'
import clickSound from '@/assets/sounds/btn_click.ogg'
import BaseGame from '@/components/templates/BaseGame.vue'
import Card from '@/components/molecules/Card.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useDragAndDrop } from '@/composables/games/useDragAndDrop'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'

// Game Logic Composable
const {
  board,
  items,
  slots,
  slotCorrectness,
  isChecked,
  isLocked,
  loading: gameLoading,
  error,
  totalSlots,
  correctCount,
  fetchLevel,
  performDrop: gamePerformDrop,
  checkAnswers: gameCheckAnswers,
  reset: resetGame
} = useDragAndDrop()

// Drag UI State
const draggedItem = ref<Blank | null>(null)
const draggedFromId = ref<number | undefined>(undefined)
const draggedFromType = ref<'pool' | 'board' | null>(null)
const lastPointerX = ref(0)
const lastPointerY = ref(0)
const ghostVisible = ref(false)
const ghostLabel = ref<string | undefined>(undefined)
const dragCompleted = ref(false)

// Meta Game State
const MAX_TIME = 180
const checkResult = ref<{ won: boolean; correctCount: number; totalSlots: number } | null>(null)

const {
  time,
  _isWon,
  _isLost,
  showIntro,
  introData,
  introLoading,
  gameLoading: baseLoading,
  gameError,
  successResultData,
  start,
  retryGame,
  finishGame,
  stopTimer,
  attempts
} = useBaseGameLogic({
  maxTime: MAX_TIME,
  minigameId: MINIGAME_IDS.dragAndDrop,
  offline: true,
  introId: 1,
  fetchLevel
})

// Audio
const audio = new Audio(clickSound)
function playClick() {
  if (audio) {
    audio.currentTime = 0
    audio.volume = 1
    audio.play().catch(() => {})
  }
}

const isTouchDevice = computed(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0)

// Drag handlers
function onDragStart(payload: { item: Blank; slotId?: number; clientX: number; clientY: number }) {
  if (isLocked.value) return
  playClick()
  draggedItem.value = payload.item
  draggedFromId.value = payload.slotId
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
    gamePerformDrop(dropId, draggedItem.value, draggedFromType.value!, draggedFromId.value)
    dragCompleted.value = true
  }

  cleanupDrag()
}

function cleanupDrag() {
  draggedItem.value = null
  draggedFromId.value = undefined
  draggedFromType.value = null
  ghostVisible.value = false
  ghostLabel.value = undefined

  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', handlePointerUp)
}

// Global cancels
function handleGlobalPointerCancel() {
  cleanupDrag()
}

onMounted(() => {
  window.addEventListener('pointercancel', handleGlobalPointerCancel as any)
})

onUnmounted(() => {
  window.removeEventListener('pointercancel', handleGlobalPointerCancel as any)
})

// Ghost Positioning
const ghostLeft = computed(() => `${lastPointerX.value}px`)
const ghostTop = computed(() => `${lastPointerY.value}px`)
const ghostClass =
  'text-[10px] md:text-[12px] min-h-[24px] font-semibold bg-blue-100 px-2 md:px-[12px] md:py-[10px] border border-primary-500 rounded-[8px] text-center'

// Check answers
async function checkAnswers() {
  if (!isChecked.value) {
    // First click: Just check and show on board
    checkResult.value = gameCheckAnswers()
    stopTimer()
  } else {
    // Second click: Show result modal
    if (checkResult.value) {
      await finishGame(checkResult.value.won, {
        scoreContext: {
          total: checkResult.value.totalSlots,
          correct: checkResult.value.correctCount,
          attempts: attempts.value,
        }
      })
    } else {
      await finishGame(false)
    }
  }
}

function handleContinue() {
  emit('cleared')
}

// Emit
const emit = defineEmits<{
  (e: 'cleared'): void
}>()
</script>

<template>
  <BaseGame
    module-title="Explore Artificial Intelligence (AI) Tools"
    :title="'Drag and Drop Prompt'"
    :description="'Isilah bagian kosong dengan kata yang sesuai!'"
    :time="time"
    :maxTime="MAX_TIME"
    :loading="baseLoading || introLoading || gameLoading"
    :error="error || gameError"
    :retryFn="() => fetchLevel(1, true)"
    v-model:showIntro="showIntro"
    :introData="introData"
    :isWin="_isWon"
    :hasLost="_isLost"
    :isChecked="isChecked"
    :currentProgress="correctCount"
    :targetProgress="totalSlots"
    :showProgress="true"
    @start="start"
    @retry="retryGame(() => { checkResult = null; resetGame(); })"
    @check="checkAnswers"
    @cleared="handleContinue"
    :successResult="successResultData"
  >
    <!-- Sentence Board -->
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
        v-for="item in items"
        :key="item.id"
        :item="item"
        :inSlot="false"
        :disabled="isLocked"
        @dragstart="onDragStart"
      />
    </div>
  </BaseGame>
  <div
    v-if="ghostVisible"
    class="dd-ghost"
    :style="{ left: ghostLeft, top: ghostTop }"
  >
    <Card
      :label="ghostLabel"
      :class="ghostClass"
    />
  </div>
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
