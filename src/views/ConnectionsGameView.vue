<script setup lang="ts">
import ConnectionsCard from '@/components/atoms/ConnectionsCard.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import BaseGame from '@/components/templates/BaseGame.vue'
import { UiButton } from '@/components/atoms/button'
import { useGameViewContext } from '@/composables/useGameViewContext'
import { useConnectionsGame } from '@/composables/games/useConnectionsGame'
import { useBaseGameLogic } from '@/composables/useBaseGameLogic'

// Game Logic Composable
const {
  categories,
  items,
  selected,
  solvedGroups,
  attemptsLeft,
  maxAttempts,
  wrongCount,
  solvedNewGroup,
  categoryColorMap,
  loading: gameLoading,
  error,
  isChecked,
  fetchLevel,
  toggleItem,
  submitSelection: gameSubmitSelection,
  reset: resetGame
} = useConnectionsGame()

const { buttonSize, playClick } = useGameViewContext()

const MAX_TIME = 180

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
  finishGame
} = useBaseGameLogic({
  maxTime: MAX_TIME,
  minigameId: MINIGAME_IDS.connections,
  offline: true,
  introId: 3,
  fetchLevel
})

// Emit
const emit = defineEmits<{
  (e: 'cleared'): void
}>()

function handleContinue() {
  emit('cleared')
}

function handleToggleItem(item: any) {
  playClick()
  toggleItem(item)
}

// Check Selection
async function submitSelection() {
  playClick()
  const result = gameSubmitSelection()
  if (!result) return

  if (result.gameOver) {
    const attemptsUsed = maxAttempts.value - attemptsLeft.value + (result.win ? 0 : 1)
    await finishGame(result.win || false, {
      scoreContext: {
        total: categories.value.length,
        correct: solvedGroups.value.length,
        attempts: attemptsUsed,
      }
    })
  }
}

function getSolvedGroup(index: number) {
  return solvedGroups.value[index]
}

function getSolvedColor(index: number) {
  const group = solvedGroups.value[index]
  return group ? (categoryColorMap.value[group.id] ?? 'bg-gray-50') : 'bg-gray-50'
}
</script>

<template>
  <BaseGame title="Connections Game" moduleTitle="Explore Artificial Intelligence (AI) Tools"
    description="Connections game" :time="time" :maxTime="MAX_TIME" v-model:showIntro="showIntro" :introData="introData"
    :loading="baseLoading || introLoading || gameLoading" :error="error || gameError"
    :retryFn="() => fetchLevel(1, true)" :isWin="_isWon" :hasLost="_isLost" :isChecked="isChecked"
    :successResult="successResultData" @start="start" @retry="retryGame(resetGame)" @check="submitSelection"
    @cleared="handleContinue">
    <div class="grid grid-cols-4 lg:grid-cols-8 gap-5 w-full">
      <div class="col-span-4 lg:col-start-3 lg:col-span-4 grid grid-cols-4 gap-5">
        <ConnectionsCard v-for="index in 4" :key="index" :label="getSolvedGroup(index - 1)?.label || ''"
          :state="getSolvedGroup(index - 1) ? 'solved' : 'idle'" :color="getSolvedColor(index - 1)"
          :clickable="false" />
      </div>
    </div>
    <div>
      <span class="text-body-xs md:text-body-sm lg:text-body-xl font-semibold text-primary-700">Create a group of
        four</span>
    </div>
    <div class="grid grid-cols-4 lg:grid-cols-8 gap-5 place-items-center w-full">
      <ConnectionsCard v-for="item in items" :key="item.label" :label="item.label" :state="item.state"
        :color="categoryColorMap[item.category]" :clickable="item.state !== 'solved'" @click="handleToggleItem(item)" />
    </div>

    <template #footer="{ onOpenResult }">
      <div class="flex flex-col items-center gap-4.5">
        <div class="text-primary-700 text-body-xs md:text-body-sm lg:text-body-xl font-bold">
          <span v-if="wrongCount !== null && !(_isWon || _isLost)">Wrong, you are {{ wrongCount }} away to form a
            correct
            group</span>
          <span v-if="solvedNewGroup !== null && !(_isWon || _isLost)">You found a new group:
            {{ solvedNewGroup.label }}</span>
          <span v-if="_isWon">You win</span>
          <span v-if="_isLost">You lose</span>
        </div>
        <div class="flex gap-4">
          <UiButton :size="buttonSize" text="Submit" variant="primary"
            :disabled="selected.length !== 4 || _isWon || _isLost" @click="submitSelection">
          </UiButton>

          <UiButton :size="buttonSize" text="Continue" v-if="_isWon || _isLost" :color="'success'"
            @click="() => onOpenResult && onOpenResult()">
          </UiButton>
        </div>
        <div class="text-primary-700 font-semibold text-body-xs md:text-body-sm lg:text-body-xl">
          <<<<<<< HEAD <span :label="`You have ${attemptsLeft} attempts left`" />
          =======
          <span> You have {{ attemptsLeft }} attempts left</span>
          >>>>>>> dev
        </div>
      </div>
    </template>
  </BaseGame>
</template>
