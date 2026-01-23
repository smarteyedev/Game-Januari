<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useTimer from '@/composables/useTimer'
import TaskRow from './TaskRow.vue'
import SpotZones from './SpotZones.vue'
import type { DragCard, Zone } from '@/types/types'
import gameData from '@/assets/gameData/automationSpotter.json'
import GameHeader from '../GameHeader.vue'
import GameFooter from '../GameFooter.vue'

const allCards = ref<DragCard[]>([])
const sourceCards = ref<DragCard[]>([])

const zones = ref<Zone[]>([
  {  // computer science basic true = 1
    id: true,
    label: 'Bisa',
    cards: [],
  },
  {  // computer science basic false = 0
    id: false,
    label: 'Tidak Bisa',
    cards: [],
  },
])

const checkedMap = ref<Record<number, boolean>>({})
const isChecked = ref(false)
const question = ref("")

const MAX_TIME = 60
const { time, isGameOver, start, stop } = useTimer(MAX_TIME, {})

const emit = defineEmits<{
  (e: 'cleared', payload: { game: 'automationSpotter'; score: number }): void
}>()

function onMoved(ids: number[]) {
  if (!isChecked.value) return
  ids.forEach((id) => {
    if (checkedMap.value[id] !== undefined) delete checkedMap.value[id]
  })
}

onMounted(() => {
  loadLevel()
  start()
})
onUnmounted(stop)

function loadLevel() {
  const level = gameData
  if (!level) return

  checkedMap.value = {}
  isChecked.value = false
  question.value = gameData.question

  allCards.value = level.card.map((c) => ({
    ...c,
    matched: false,
  }))

  sourceCards.value = [...allCards.value]

  // Reset all zones
  zones.value.forEach((zone) => {
    zone.cards = []
  })
}

const matchedCount = computed(() => {
  if (!isChecked.value) return 0
  return Object.values(checkedMap.value).filter(Boolean).length
})

const isLevelWin = computed(() => isChecked.value && matchedCount.value === allCards.value.length)

watch(isLevelWin, (win) => win && stop())

function checkAnswers() {
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

function finishGame() {
  emit('cleared', {
    game: 'automationSpotter',
    score: isGameOver.value ? 0 : matchedCount.value,
  })
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 min-w-full w-[90vw]">
    <GameHeader
      title="Automation Spotter"
      :description="question"
      :time="time"
    >
    </GameHeader>

    <!-- Cards -->
    <TaskRow
      v-model="sourceCards"
      :checked-map="checkedMap"
      :is-checked="isChecked"
      @moved="onMoved"
    />

    <SpotZones :zones="zones" :checked-map="checkedMap" :is-checked="isChecked" @moved="onMoved" />

    <GameFooter
      :current="matchedCount"
      :target="allCards.length"
      @check="checkAnswers"
      :show-progress="true"
      @cleared="finishGame()"
    ></GameFooter>
  </div>
</template>