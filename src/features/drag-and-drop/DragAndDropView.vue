<script setup lang="ts">
import { ref } from 'vue'
import BlankSlot from './components/BlankSlot.vue'
import WordItem from './components/WordItem.vue'
import BaseGame from '@/components/templates/BaseGame.vue'
import { DragProvider, DropZone as EngineDropZone } from '@/components/dragengine'
import { Card } from '@/components/atoms'
import { MINIGAME_IDS } from '@/utils/constants'
import { useGameViewContext } from '@/composables/useGameViewContext'
import { useDragAndDrop } from './composables/useDragAndDrop'
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
  moveWord,
  checkAnswers: gameCheckAnswers,
  reset: resetGame
} = useDragAndDrop()

const { playClick } = useGameViewContext()

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

// Check answers
async function checkAnswers() {
  if (!isChecked.value) {
    // First click: Just check and show on board
    checkResult.value = gameCheckAnswers()
    stopTimer()
  }
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

function handleContinue() {
  emit('cleared')
}

// Emit
const emit = defineEmits<{
  (e: 'cleared'): void
}>()

const ghostClass =
  'text-[10px] md:text-[12px] min-h-[24px] font-semibold bg-blue-100 px-2 md:px-[12px] md:py-[10px] border border-primary-500 rounded-[8px] text-center'
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
:successResult="successResultData">
    <DragProvider>
      <!-- Sentence Board -->
      <div
        class="border-2 rounded-xl px-2.5 py-3.25 md:p-2.5 text-justify text-primary-700 font-semibold text-body-xs md:text-body-sm">
        <template
v-for="(part, index) in board"
:key="part.type === 'slot' ? `slot-${part.id}` : `text-${index}`">
          <span v-if="part.type === 'text'">
            {{ part.value }}
          </span>
          <BlankSlot
v-else
:item="slots[part.id]"
:slotId="part.id"
:isCorrect="slotCorrectness[part.id]"
            :disabled="isLocked"
@move="moveWord" />
        </template>
      </div>

      <!-- Word Pool -->
      <EngineDropZone
zone-id="pool"
:items="items"
:max-drag-item="99"
@move="moveWord"
        class="flex flex-wrap gap-3 justify-center border-none bg-transparent p-0">
        <WordItem
v-for="(item, index) in items"
:key="item.id"
:item="item"
:inSlot="false"
          :drag-data="{ item: item, index: index, zoneId: 'pool' }"
:disabled="isLocked"
@drag-end="playClick" />
      </EngineDropZone>

      <template #preview="{ item }">
        <div class="drag-preview-container">
          <Card
:label="(item as any).word"
:custom-class="ghostClass" />
        </div>
      </template>
    </DragProvider>
  </BaseGame>
</template>

<style scoped>
.drag-preview-container {
  pointer-events: none;
  z-index: 9999;
  background: rgba(255, 255, 255, 0);
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  font-weight: 700;
  color: #0f172a;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
</style>
