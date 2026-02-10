<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useTimer from '@/composables/useTimer'
import TaskRow from '@/components/organism/AutomationSpotter/TaskRow.vue'
import SpotZones from '@/components/organism/AutomationSpotter/SpotZones.vue'
import type { DragCard, Zone } from '@/types/types'
import useApi from '@/composables/useApi'
import type { ApiResponse } from '@/types/types'
import GameHeader from '@/components/molecules/GameHeader.vue'
import GameFooter from '@/components/molecules/GameFooter.vue'
import { UiLoading } from '@/components/atoms/loading'
import GameIntroModal from '@/components/molecules/GameIntroModal.vue'
import introData from '@/assets/gameData/intro.json'
import { useSessionStore } from '@/stores/session'
import { MINIGAME_IDS } from '@/utils/constants'

const session = useSessionStore()

const allCards = ref<DragCard[]>([])
const sourceCards = ref<DragCard[]>([])

const zones = ref<Zone[]>([
  {
    // computer science basic true = 1
    id: true,
    label: 'Bisa',
    cards: [],
  },
  {
    // computer science basic false = 0
    id: false,
    label: 'Tidak Bisa',
    cards: [],
  },
])

const checkedMap = ref<Record<number, boolean>>({})
const isChecked = ref(false)
const question = ref('')
const showIntro = ref(true)

const MAX_TIME = 180 //second
const { time, isGameOver, start, stop } = useTimer(MAX_TIME, {})

const hasLost = computed(() => {
  return isChecked.value && !isLevelWin.value
})

const emit = defineEmits<{
  (e: 'cleared', payload: { game: 'automation-spotter'; score: number }): void
}>()

function onMoved(ids: number[]) {
  if (!isChecked.value) return
  ids.forEach((id) => {
    if (checkedMap.value[id] !== undefined) delete checkedMap.value[id]
  })
}

const { get, loading, error } = useApi()
const gameData = ref<{
  question: string
  card: DragCard[]
} | null>(null)

async function fetchLevel() {
  try {
    const res = await get<
      ApiResponse<{
        question: string
        card: DragCard[]
      }>
    >('/api/v1/minigames/automation-spotter/levels/1')

    if (res && (res.success === false || (res as any).error)) {
      const msg = res.message ?? (res as any).error?.details ?? 'API returned an error'
      const err = new Error(msg)
      ;(err as any).apiError = res
      throw err
    }

    gameData.value = res.data
  } catch (err) {
    console.error('Failed to load level', err)
  }
}

async function startGame() {
  showIntro.value = false

  await session.launchGame(MINIGAME_IDS.automationSpotter)

  loadLevel()
}

onMounted(() => {
  fetchLevel()
})

onUnmounted(stop)

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

async function loadLevel() {
  if (!gameData.value) return

  stop()
  start()

  checkedMap.value = {}
  isChecked.value = false
  question.value = gameData.value.question

  allCards.value = shuffle(gameData.value.card.map((c) => ({ ...c, matched: false })))

  sourceCards.value = [...allCards.value]
  zones.value.forEach((zone) => (zone.cards = []))
}

const matchedCount = computed(() => {
  return Object.values(checkedMap.value).filter(Boolean).length
})

const isLevelWin = computed(() => {
  if (!isChecked.value) return false

  return (
    Object.keys(checkedMap.value).length === allCards.value.length &&
    Object.values(checkedMap.value).every(Boolean)
  )
})

watch(isLevelWin, (win) => win && stop())

function checkAnswers() {
  stop()
  const result: Record<number, boolean> = {}

  zones.value.forEach((zone) => {
    zone.cards.forEach((card) => {
      // Direct comparison: card.answer should equal zone.id
      result[card.id] = card.answer === zone.id
    })
  })

  checkedMap.value = result

  isChecked.value = true
}

async function finishGame() {
  const score = isGameOver.value ? 0 : 100

  try {
    await session.submitScore(
      score,
      allCards.value.map((c) => ({
        id: c.id,
        answer: checkedMap.value[c.id],
      })),
      MAX_TIME - time.value,
    )
  } finally {
    emit('cleared', {
      game: 'automation-spotter',
      score,
    })
  }
}

watch(isGameOver, (over) => {
  if (!over) return
  isChecked.value = true
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full h-full p-2">
    <div v-if="loading">
      <UiLoading class="grid place-items-center" />
    </div>

    <div v-else-if="error">
      <p>Failed to load game</p>
      <button @click="fetchLevel">Retry</button>
    </div>

    <GameIntroModal
      v-if="!loading"
      v-model="showIntro"
      title="Automation Spotter"
      :introData="introData.data[0]"
      @start="startGame"
    />

    <template v-if="!showIntro">
      <div
        class="border-[6px] border-blue-700 flex flex-col items-center gap-4 w-full max-w-full p-6 rounded-4xl"
      >
        <GameHeader title="Automation Spotter" :description="question" :time="time" />

        <TaskRow
          v-model="sourceCards"
          :checked-map="checkedMap"
          :is-checked="isChecked"
          :disabled="isChecked"
          @moved="onMoved"
        />

        <SpotZones
          :zones="zones"
          :checked-map="checkedMap"
          :is-checked="isChecked"
          @moved="onMoved"
        />

        <GameFooter
          :current="matchedCount"
          :target="allCards.length"
          :is-checked="isChecked"
          :has-lost="hasLost"
          :is-win="isLevelWin"
          :show-progress="true"
          @check="checkAnswers"
          @retry="loadLevel"
          @cleared="finishGame"
        />
      </div>
    </template>
  </div>
</template>
