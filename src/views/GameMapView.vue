<script setup lang="ts">
import ASIntro from '@/components/AutomationSpotter/ASIntro.vue'
import AutomationSpotter from '@/components/AutomationSpotter/AutomationSpotter.vue'
import DnDPIntro from '@/components/DragAndDropPrompt/DnDPIntro.vue'
import DragAndDropPrompt from '@/components/DragAndDropPrompt/DragAndDropPrompt.vue'
import FeedbackForm from '@/components/feedback/FeedbackForm.vue'
import GameMap from '@/components/GameMap.vue'
import GameModal from '@/components/GameModal.vue'
import IconButton from '@/components/IconButton.vue'
import LevelButtonIconClear from '@/components/icons/LevelButtonIconClear.vue'
import LevelButtonIconLocked from '@/components/icons/LevelButtonIconLocked.vue'
import LevelButtonIconUnlocked from '@/components/icons/LevelButtonIconUnlocked.vue'
import LevelButton from '@/components/LevelButton.vue'
import MemoryGame from '@/components/MemoryGame/MemoryGame.vue'
import MGIntro from '@/components/MemoryGame/MGIntro.vue'
import Score from '@/components/score/Score.vue'
import { supabase } from '@/lib/supabaseClient'
import type { LevelButtonState } from '@/types/types'
import { computed, onBeforeMount, onMounted, ref } from 'vue'

type GameKey = 'automationSpotter' | 'dragAndDropPrompt' | 'memoryGame'

const gameMeta: Record<
  GameKey,
  {
    title: string
    component: any
    intro: any
  }
> = {
  automationSpotter: {
    title: 'Automation Spotter',
    component: AutomationSpotter,
    intro: ASIntro,
  },
  dragAndDropPrompt: {
    title: 'Drag & Drop Prompt',
    component: DragAndDropPrompt,
    intro: DnDPIntro,
  },
  memoryGame: {
    title: 'Memory Game',
    component: MemoryGame,
    intro: MGIntro,
  },
}

const gameOrder: GameKey[] = ['automationSpotter', 'dragAndDropPrompt', 'memoryGame']

const gameState = ref<Record<GameKey, LevelButtonState>>({
  automationSpotter: 'unlocked',
  dragAndDropPrompt: 'locked',
  memoryGame: 'locked',
})

type ModalView = GameKey | 'feedback' | 'score'

const activeView = ref<ModalView | null>(null)
const showIntro = ref(false)

function openGame(game: GameKey) {
  activeView.value = game
  showIntro.value = true
}

function closeGame() {
  activeView.value = null
  showIntro.value = false
}

async function onGameCleared(payload: { game: GameKey; score: number }) {
  const { game, score } = payload

  const sessionId = sessionStorage.getItem('score_session_id')
  console.log(sessionId)
  if (!sessionId) return

  const columnMap: Record<GameKey, string> = {
    automationSpotter: 'automationSpotter',
    dragAndDropPrompt: 'dragAndDrop',
    memoryGame: 'memoryGame',
  }

  await supabase
    .from('Score')
    .update({ [columnMap[game]]: score })
    .eq('id', sessionId)

  // ----- UI logic unchanged -----
  const currentIndex = gameOrder.indexOf(game)
  gameState.value[game] = 'cleared'

  const nextGame = gameOrder[currentIndex + 1]
  if (nextGame) {
    gameState.value[nextGame] = 'unlocked'
    closeGame()
  } else {
    activeView.value = 'feedback'
    showIntro.value = false
  }
}

const mapRef = ref<InstanceType<typeof GameMap> | null>(null)

const mapSize = ref({
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
})

function updateMapSize() {
  const svg = mapRef.value?.svgRef
  if (!svg) return

  const rect = svg.getBoundingClientRect()
  const viewBox = svg.viewBox.baseVal

  mapSize.value = {
    width: rect.width,
    height: rect.height,
    scaleX: rect.width / viewBox.width,
    scaleY: rect.height / viewBox.height,
  }
}

let observer: ResizeObserver | null = null

onMounted(() => {
  updateMapSize()

  observer = new ResizeObserver(updateMapSize)

  const svg = mapRef.value?.svgRef
  if (svg) observer.observe(svg)
})

onBeforeMount(() => {
  observer?.disconnect()
})

function openScore() {
  activeView.value = 'score'
  showIntro.value = false
}

const appRoot = ref<HTMLElement | null>(null)

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    appRoot.value?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<template>
  <div ref="appRoot" class="w-screen h-screen">
    <div class="relative w-full h-full">
      <div class="p-4 flex relative items-center justify-between z-10">
        <div class="pb-[10px] pt-[10px] pr-[16px] pl-[16px] text-center bg-[#E2FEF7] rounded-lg">
          <span class="text-[#00A3B5] font-semibold">
            Explore Artificial Intelligence (AI) Tools
          </span>
        </div>

        <div class="flex gap-4">
          <button
            @click="openScore"
            class="pb-[10px] pt-[10px] pr-[16px] pl-[16px] text-center bg-[#00A3B5] hover:bg-teal-600 text-white font-semibold rounded-lg w-[100px]"
          >
            Score
          </button>

          <!--Fullscreen Button-->
          <IconButton
            @click="toggleFullscreen"
            class="p-2 bg-[#00A3B5] hover:bg-teal-600 rounded-lg"
          >
            <template #icon>
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_4015_3129)">
                  <path
                    d="M9 21C8.175 21 7.5 21.675 7.5 22.5V27C7.5 27.825 8.175 28.5 9 28.5H13.5C14.325 28.5 15 27.825 15 27C15 26.175 14.325 25.5 13.5 25.5H10.5V22.5C10.5 21.675 9.825 21 9 21ZM9 15C9.825 15 10.5 14.325 10.5 13.5V10.5H13.5C14.325 10.5 15 9.825 15 9C15 8.175 14.325 7.5 13.5 7.5H9C8.175 7.5 7.5 8.175 7.5 9V13.5C7.5 14.325 8.175 15 9 15ZM25.5 25.5H22.5C21.675 25.5 21 26.175 21 27C21 27.825 21.675 28.5 22.5 28.5H27C27.825 28.5 28.5 27.825 28.5 27V22.5C28.5 21.675 27.825 21 27 21C26.175 21 25.5 21.675 25.5 22.5V25.5ZM21 9C21 9.825 21.675 10.5 22.5 10.5H25.5V13.5C25.5 14.325 26.175 15 27 15C27.825 15 28.5 14.325 28.5 13.5V9C28.5 8.175 27.825 7.5 27 7.5H22.5C21.675 7.5 21 8.175 21 9Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4015_3129">
                    <rect width="36" height="36" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </template>
          </IconButton>
        </div>
      </div>
      <GameMap ref="mapRef" class="absolute inset-0 min-w-screen min-h-screen z-0" />

      <!-- Automation Spotter Button -->
      <LevelButton
        class="absolute origin-top-left"
        :style="{
          left: `${511 * mapSize.scaleX}px`,
          top: `${441 * mapSize.scaleY}px`,
          transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
        }"
        :state="gameState.automationSpotter"
        @open="openGame('automationSpotter')"
      >
        <template #default="{ state }">
          <LevelButtonIconUnlocked v-if="state === 'unlocked'" />
          <LevelButtonIconClear v-else-if="state === 'cleared'" />
          <LevelButtonIconLocked v-else />
        </template>
      </LevelButton>

      <!-- Drag and Drop Prompt Button -->
      <LevelButton
        class="absolute origin-top-left"
        :style="{
          left: `${1089 * mapSize.scaleX}px`,
          top: `${318 * mapSize.scaleY}px`,
          transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
        }"
        :state="gameState.dragAndDropPrompt"
        @open="openGame('dragAndDropPrompt')"
      >
        <template #default="{ state }">
          <LevelButtonIconUnlocked v-if="state === 'unlocked'" />
          <LevelButtonIconClear v-else-if="state === 'cleared'" />
          <LevelButtonIconLocked v-else />
        </template>
      </LevelButton>

      <!-- Memory Game Button -->
      <LevelButton
        class="absolute origin-top-left"
        :style="{
          left: `${1183 * mapSize.scaleX}px`,
          top: `${654 * mapSize.scaleY}px`,
          transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
        }"
        :state="gameState.memoryGame"
        @open="openGame('memoryGame')"
      >
        <template #default="{ state }">
          <LevelButtonIconUnlocked v-if="state === 'unlocked'" />
          <LevelButtonIconClear v-else-if="state === 'cleared'" />
          <LevelButtonIconLocked v-else />
        </template>
      </LevelButton>
    </div>

    <GameModal
      v-if="activeView"
      :title="
        activeView === 'feedback'
          ? 'Your Feedback'
          : activeView === 'score'
            ? 'Score'
            : gameMeta[activeView].title
      "
      @close="closeGame"
    >
      <!-- FEEDBACK -->
      <template v-if="activeView === 'feedback'">
        <FeedbackForm @submitted="closeGame" />
      </template>

      <template v-else-if="activeView === 'score'">
        <Score />
      </template>

      <!-- INTRO -->
      <template v-else-if="showIntro">
        <component :is="gameMeta[activeView].intro" />

        <div class="flex justify-end mt-6">
          <button
            class="px-6 py-2 bg-[#00A3B5] hover:bg-teal-600 text-white rounded-lg font-semibold"
            @click="showIntro = false"
          >
            Start Game
          </button>
        </div>
      </template>

      <!-- GAME -->
      <template v-else>
        <component :is="gameMeta[activeView].component" @cleared="onGameCleared" />
      </template>
    </GameModal>
  </div>
</template>
