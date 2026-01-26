<script setup lang="ts">
import AutomationSpotter from '@/components/AutomationSpotter/AutomationSpotter.vue'
import DragAndDropPrompt from '@/components/DragAndDropPrompt/DragAndDropPrompt.vue'
import FeedbackForm from '@/components/organism/FeedbackForm.vue'
import GameMap from '@/components/Map/GameMap.vue'
import GameModal from '@/components/organism/GameModal.vue'
import LevelButtonIconClear from '@/components/icons/LevelButtonIconClear.vue'
import LevelButtonIconLocked from '@/components/icons/LevelButtonIconLocked.vue'
import LevelButtonIconUnlocked from '@/components/icons/LevelButtonIconUnlocked.vue'
import LevelButton from '@/components/Map/LevelButton.vue'
import MemoryGame from '@/components/MemoryGame/MemoryGame.vue'
import { supabase } from '@/lib/supabaseClient'
import type { IntroData, LevelButtonState } from '@/types/types'
import { onBeforeMount, onMounted, ref } from 'vue'
import bgmSound from '@/assets/sounds/bgm.ogg'
import LevelPath1 from '@/components/Map/LevelPath1.vue'
import LevelPath2 from '@/components/Map/LevelPath2.vue'
import GameIntroModal from '@/components/organism/GameIntroModal.vue'
import GameIntroData from '@/assets/gameData/intro.json'
import GameMapHeader from '@/components/molecules/GameMapHeader.vue'

type GameKey = 'automationSpotter' | 'dragAndDropPrompt' | 'memoryGame'

interface GameIntroMapping {
  automationSpotter: IntroData
  dragAndDropPrompt: IntroData
  memoryGame: IntroData
}

const gameMeta: Record<
  GameKey,
  {
    title: string
    component: any
  }
> = {
  automationSpotter: {
    title: 'Automation Spotter',
    component: AutomationSpotter,
  },
  dragAndDropPrompt: {
    title: 'Drag & Drop Prompt',
    component: DragAndDropPrompt,
  },
  memoryGame: {
    title: 'Memory Game',
    component: MemoryGame,
  },
}

const gameOrder: GameKey[] = ['automationSpotter', 'dragAndDropPrompt', 'memoryGame']
const introData = ref<GameIntroMapping | null>(null)

const gameState = ref<Record<GameKey, LevelButtonState>>({
  automationSpotter: 'unlocked',
  dragAndDropPrompt: 'locked',
  memoryGame: 'locked',
})

type ModalView =
  | { type: 'intro'; game: GameKey }
  | { type: 'game'; game: GameKey }
  | { type: 'feedback' }
  | { type: 'score' }
  | null

const activeView = ref<ModalView>(null)

// Add reactive show flags for each modal type
const showIntroModal = ref(false)
const showGameModal = ref(false)
const showFeedbackModal = ref(false)
const showScoreModal = ref(false)

async function loadIntroData() {
  try {
    const introCollection: IntroData[] = GameIntroData.data

    if (introCollection.length < 3) {
      throw new Error('Not enough intro data')
    }

    const mapping: GameIntroMapping = {
      automationSpotter: introCollection[0]!,
      dragAndDropPrompt: introCollection[1]!,
      memoryGame: introCollection[2]!
    }

    introData.value = mapping
  } catch (error) {
    console.error('Failed to load intro data:', error)
  }
}

function openGame(game: GameKey) {
  activeView.value = { type: 'intro', game }
  showIntroModal.value = true
}

function startGame(game: GameKey) {
  activeView.value = { type: 'game', game }
  showIntroModal.value = false
  showGameModal.value = true
}

function closeModal() {
  activeView.value = null
  showIntroModal.value = false
  showGameModal.value = false
  showFeedbackModal.value = false
  showScoreModal.value = false
}

async function onGameCleared(payload: { game: GameKey; score: number }) {
  const { game, score } = payload

  const sessionId = sessionStorage.getItem('score_session_id')
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

  const currentIndex = gameOrder.indexOf(game)
  gameState.value[game] = 'cleared'

  const nextGame = gameOrder[currentIndex + 1]

  if (nextGame) {
    gameState.value[nextGame] = 'unlocked'
    closeModal()
  } else {
    activeView.value = { type: 'feedback' }
    showGameModal.value = false
    showFeedbackModal.value = true
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
let bgm = new Audio(bgmSound)

function stopAudio(audio: HTMLAudioElement) {
  if (audio) {
    audio.pause()
    audio.currentTime = 0
  }
}

onMounted(() => {
  updateMapSize()
  loadIntroData()

  observer = new ResizeObserver(updateMapSize)
  const svg = mapRef.value?.svgRef

  bgm.loop = true
  bgm.volume = 0.1
  bgm.play().catch(err => {
    console.warn('Audio play blocked:', err)
  })
  if (svg) observer.observe(svg)
})

onBeforeMount(() => {
  observer?.disconnect()
  stopAudio(bgm)
})

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

      <GameMapHeader @toggle-fullscreen="toggleFullscreen"></GameMapHeader>

      <GameMap ref="mapRef" class="absolute inset-0 min-w-screen min-h-screen z-0" />
      <LevelPath1 class="absolute origin-top-left" :style="{
        left: `${587 * mapSize.scaleX}px`,
        top: `${354 * mapSize.scaleY}px`,
        transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
      }"></LevelPath1>

      <LevelPath2 class="absolute origin-top-left" :style="{
        left: `${1156 * mapSize.scaleX}px`,
        top: `${378 * mapSize.scaleY}px`,
        transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
      }"></LevelPath2>

      <!-- Automation Spotter Button -->
      <LevelButton class="absolute origin-top-left" :style="{
        left: `${511 * mapSize.scaleX}px`,
        top: `${441 * mapSize.scaleY}px`,
        transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
      }" :state="gameState.automationSpotter" @open="openGame('automationSpotter')">
        <template #default="{ state }">
          <LevelButtonIconUnlocked v-if="state === 'unlocked'" />
          <LevelButtonIconClear v-else-if="state === 'cleared'" />
          <LevelButtonIconLocked v-else />
        </template>
      </LevelButton>

      <!-- Drag and Drop Prompt Button -->
      <LevelButton class="absolute origin-top-left" :style="{
        left: `${1089 * mapSize.scaleX}px`,
        top: `${318 * mapSize.scaleY}px`,
        transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
      }" :state="gameState.dragAndDropPrompt" @open="openGame('dragAndDropPrompt')">
        <template #default="{ state }">
          <LevelButtonIconUnlocked v-if="state === 'unlocked'" />
          <LevelButtonIconClear v-else-if="state === 'cleared'" />
          <LevelButtonIconLocked v-else />
        </template>
      </LevelButton>

      <!-- Memory Game Button -->
      <LevelButton class="absolute origin-top-left" :style="{
        left: `${1183 * mapSize.scaleX}px`,
        top: `${654 * mapSize.scaleY}px`,
        transform: `scale(${Math.min(mapSize.scaleX, mapSize.scaleY)})`,
      }" :state="gameState.memoryGame" @open="openGame('memoryGame')">
        <template #default="{ state }">
          <LevelButtonIconUnlocked v-if="state === 'unlocked'" />
          <LevelButtonIconClear v-else-if="state === 'cleared'" />
          <LevelButtonIconLocked v-else />
        </template>
      </LevelButton>
    </div>

    <GameIntroModal v-if="activeView?.type === 'intro'" :modelValue="showIntroModal"
      :title="gameMeta[activeView.game].title" :introData="introData?.[activeView.game]"
      @update:modelValue="showIntroModal = $event" @start="startGame(activeView.game)" @close="closeModal" />

    <!-- GAME MODAL -->
    <GameModal v-if="activeView?.type === 'game'" :modelValue="showGameModal" :title="gameMeta[activeView.game].title"
      @update:modelValue="showGameModal = $event" @close="closeModal">
      <component :is="gameMeta[activeView.game].component" @cleared="onGameCleared" />
    </GameModal>

    <!-- FEEDBACK MODAL -->
    <GameModal v-if="activeView?.type === 'feedback'" :modelValue="showFeedbackModal" title="Your Feedback"
      @update:modelValue="showFeedbackModal = $event" @close="closeModal">
      <FeedbackForm @submitted="closeModal" />
    </GameModal>

  </div>
</template>