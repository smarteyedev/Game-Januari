<template>
  <BaseGame title="Connections Game" description="Connections game" :time="time" v-model:showIntro="showIntro"
    :introData="introData.data[3]" :loading="loading" :error="error" :retryFn="retryGame">
    <div class="flex  justify-center gap-2.5 md:gap-5 items-center">
      <ConnectionsCard v-for="index in 4" :key="index" :label="getSolvedGroup(index - 1)?.label || ''"
        :state="getSolvedGroup(index - 1) ? 'solved' : 'idle'" :color="getSolvedColor(index - 1)" :clickable="false" />
    </div>
    <div>
      <span class="text-body-xl font-semibold text-primary-700">Create a group of four</span>
    </div>
    <div class="grid grid-cols-4 lg:grid-cols-8 gap-5 p-2">
      <ConnectionsCard v-for="item in items" :key="item.label" :label="item.label" :state="item.state"
        :color="categoryColorMap[item.category]" :clickable="item.state !== 'solved'" @click="toggleItem(item)" />
    </div>

    <!-- Control Buttons -->

    <template #footer>
      <div class="flex flex-col items-center gap-4.5">
        <!--Event message for user feedback-->
        <div class="text-primary-700 text-body-xl font-bold">
          <UiLabel v-if="wrongCount !== null && !(isWon || isLost)"
            :label="`Wrong, you are ${wrongCount} away to form a correct group`" />
          <UiLabel v-if="solvedNewGroup !== null && !(isWon || isLost)"
            :label="`You found a new group: ${solvedNewGroup.label}`" />
          <UiLabel v-if="isWon" :label="`You win`" />
          <UiLabel v-if="isLost" :label="`you lose`" />
        </div>
        <div class="flex gap-4">
          <UiButton text="Submit" variant="primary" :disabled="selected.length !== 4 || isWon || isLost"
            @click="submitSelection">
          </UiButton>

          <!--Hidden, if lose show restart, if win show continue-->
          <UiButton text="Restart" variant="danger" v-if="isLost" @click="restartGame" :color="'error'">
          </UiButton>
          <UiButton text="Continue" v-if="isWon" :color="'success'"> </UiButton>
        </div>
        <div class="text-primary-700 font-semibold text-body-md">
          <UiLabel :label="`You have ${attemptsLeft} attempts left`" />
        </div>
      </div>
    </template>
  </BaseGame>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { UiLabel } from '@/components/atoms/label'
import ConnectionsCard from '@/components/molecules/ConnectionsCard.vue'
import gameData from '@/assets/gameData/connection_game.json'
import BaseGame from '@/components/templates/BaseGame.vue'
import { MINIGAME_IDS } from '@/utils/constants'
import { useGameService } from '@/application'
import introData from '@/assets/gameData/intro.json'
import { UiButton } from '@/components/atoms/button'
import { shuffle } from '@/utils/shuffle'

type Category = {
  id: string
  label: string
}

type ItemState = 'idle' | 'selected' | 'solved'

type Item = {
  label: string
  category: string
  state: ItemState
}

type SolvedGroup = {
  id: string
  label: string
  color: string
}

const COLOR_POOL = [
  'bg-red-200',
  'bg-orange-200',
  'bg-amber-200',
  'bg-yellow-200',
  'bg-lime-200',
  'bg-green-200',
  'bg-emerald-200',
  'bg-teal-200',
  'bg-cyan-200',
  'bg-sky-200',
  'bg-blue-200',
  'bg-indigo-200',
  'bg-violet-200',
  'bg-purple-200',
  'bg-fuchsia-200',
  'bg-pink-200',
  'bg-rose-200',
]

const { time, _isWon, _isLost, startGame, finish, retry } = useGameService({
  maxTime: 180,
  minigameId: MINIGAME_IDS.connections,
  offline: true,
})

const loading = ref(true)
const error = ref<unknown>(null)
const showIntro = ref(true)

const isWon = computed(() => _isWon.value)
const isLost = computed(() => _isLost.value)

const categoryColorMap = ref<Record<string, string>>({})
const categories = ref<Category[]>([])
const items = ref<Item[]>([])
const selected = ref<Item[]>([])
const categoryLabelMap = ref<Record<string, string>>({})
const solvedGroups = ref<SolvedGroup[]>([])
const maxAttempts = 4
const attemptsLeft = ref(maxAttempts)

const wrongCount = ref<number | null>(null)
const solvedNewGroup = ref<{ id: string; label: string } | null>(null)

function countAway(items: Item[]) {
  const freq: Record<string, number> = {}

  items.forEach((item) => {
    freq[item.category] = (freq[item.category] || 0) + 1
  })

  const maxSame = Math.max(...Object.values(freq))
  return 4 - maxSame
}

function colorFromCategory(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return COLOR_POOL[Math.abs(hash) % COLOR_POOL.length]!
}

function assignCategoryColors(categories: { id: string }[]) {
  categories.forEach((cat) => {
    categoryColorMap.value[cat.id] = colorFromCategory(cat.id)
  })
}

// Fetch game data and start game
async function initializeGame() {
  loading.value = true
  error.value = null

  try {
    await startGame()

    const data = gameData

    categories.value = data.category
    assignCategoryColors(data.category)

    categoryLabelMap.value = Object.fromEntries(data.category.map((c: any) => [c.id, c.label]))

    items.value = shuffle(
      data.items.map((item: any) => ({
        label: item.label,
        category: item.category,
        state: 'idle',
      })),
    )
  } catch (err) {
    error.value = err
    console.error('Failed to initialize game', err)
  } finally {
    loading.value = false
  }
}

// Retry function for error state
function retryGame() {
  initializeGame()
}

onMounted(async () => {
  await initializeGame()
})

function toggleItem(item: Item) {
  if (item.state === 'solved') return
  if (isWon.value || isLost.value) return

  if (item.state === 'selected') {
    item.state = 'idle'
    selected.value = selected.value.filter((i) => i !== item)
    return
  }

  if (selected.value.length < 4) {
    item.state = 'selected'
    selected.value.push(item)
  }
}

async function submitSelection() {
  if (selected.value.length !== 4) return
  if (isWon.value || isLost.value) return

  solvedNewGroup.value = null
  wrongCount.value = null

  const categoryId = selected.value[0]!.category
  const isMatch = selected.value.every((item) => item.category === categoryId)

  if (!isMatch) {
    attemptsLeft.value--

    wrongCount.value = countAway(selected.value)

    selected.value.forEach((i) => (i.state = 'idle'))
    selected.value = []

    if (attemptsLeft.value <= 0) {
      revealAllGroups()
      await finish(false)
    }

    return
  }

  // correct group
  selected.value.forEach((item) => {
    item.state = 'solved'
  })

  solvedGroups.value.push({
    id: categoryId,
    label: categoryLabelMap.value[categoryId]!,
    color: categoryColorMap.value[categoryId]!,
  })

  solvedNewGroup.value = {
    id: categoryId,
    label: categoryLabelMap.value[categoryId]!,
  }

  selected.value = []

  // win condition
  if (solvedGroups.value.length === categories.value.length) {
    await finish(true)
  }
}

function getSolvedGroup(index: number) {
  return solvedGroups.value[index]
}

function getSolvedColor(index: number) {
  const group = solvedGroups.value[index]
  return group ? (categoryColorMap.value[group.id] ?? 'bg-gray-50') : 'bg-gray-50'
}

function revealAllGroups() {
  const solvedCategoryIds = new Set(solvedGroups.value.map((g) => g.id))

  // mark all items as solved
  items.value.forEach((item) => {
    item.state = 'solved'
  })

  // add missing groups to solvedGroups
  categories.value.forEach((cat) => {
    if (!solvedCategoryIds.has(cat.id)) {
      solvedGroups.value.push({
        id: cat.id,
        label: categoryLabelMap.value[cat.id]!,
        color: categoryColorMap.value[cat.id]!,
      })
    }
  })
}

async function restartGame() {
  await retry()
  resetLocalState()
}

function resetLocalState() {
  attemptsLeft.value = maxAttempts
  wrongCount.value = null
  solvedNewGroup.value = null
  solvedGroups.value = []
  selected.value = []

  items.value.forEach((item) => (item.state = 'idle'))
  items.value = shuffle(items.value)
}
</script>
