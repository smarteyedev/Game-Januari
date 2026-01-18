<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import useTimer from '@/composables/useTimer'
import TaskRow from './TaskRow.vue'
import SpotZones from './SpotZones.vue'
import type { DragCard } from '@/types/types'
import gameData from '@/assets/gameData/automationSpotter.json'
import GameHeader from '../GameHeader.vue'
import GameFooter from '../GameFooter.vue'

const levelIndex = ref(0)
const allCards = ref<DragCard[]>([])
const sourceCards = ref<DragCard[]>([])

type ZoneId = 'zone1' | 'zone2'

interface Zone {
  id: ZoneId
  label: string
  cards: DragCard[]
}

const zones = ref<Record<ZoneId, Zone>>({
  zone1: {
    id: 'zone1',
    label: 'Bisa',
    cards: [],
  },
  zone2: {
    id: 'zone2',
    label: 'Tidak Bisa',
    cards: [],
  },
})

const checkedMap = ref<Record<number, boolean>>({})
const isChecked = ref(false)

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
  const level = gameData.levels[levelIndex.value]
  if (!level) return

  checkedMap.value = {}
  isChecked.value = false

  allCards.value = level.card.map((c) => ({
    ...c,
    matched: false,
  }))

  sourceCards.value = [...allCards.value]

  Object.values(zones.value).forEach((z) => {
    z.cards = []
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

  Object.values(zones.value).forEach((zone) => {
    zone.cards.forEach((card) => {
      result[card.id] = card.idTarget === zone.id
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
      description="Pilih tugas yang bisa diotomatisasi AI ke kolom Bisa dan yang tidak ke kolom Tidak Bisa"
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
